const fs = require('fs');
const path = require('path');

const docsDirectory = path.join(process.cwd(), 'docs');

function filePathToSlug(filePath) {
  const relativePath = path.relative(docsDirectory, filePath);
  return relativePath
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/\\+/g, '/')
    .split('/')
    .filter(Boolean)
    .join('/');
}

function getDocFiles(dir = docsDirectory) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') && !['IMPLEMENTATION.md', 'CHANGELOG.md', 'CODEBASE_INDEX.md'].includes(item)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

const files = getDocFiles();
const slugs = files.map(file => {
  const slug = filePathToSlug(file);
  return { file, slug };
});

console.log('All slugs:');
slugs.forEach(({ file, slug }) => {
  console.log(`${slug} <- ${file}`);
});

// Check for duplicates
const slugCounts = {};
slugs.forEach(({ slug }) => {
  slugCounts[slug] = (slugCounts[slug] || 0) + 1;
});

const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
if (duplicates.length > 0) {
  console.log('\nDuplicate slugs found:');
  duplicates.forEach(([slug, count]) => {
    console.log(`${slug}: ${count} times`);
    const filesWithSlug = slugs.filter(s => s.slug === slug);
    filesWithSlug.forEach(({ file }) => {
      console.log(`  - ${file}`);
    });
  });
} else {
  console.log('\nNo duplicate slugs found.');
}