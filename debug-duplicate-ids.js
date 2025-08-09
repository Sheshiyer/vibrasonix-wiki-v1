const { getAllDocs } = require('./src/lib/docs.ts');

function transformDocsToItems(allDocs) {
  const items = [];
  
  Object.entries(allDocs).forEach(([section, docs]) => {
    docs.forEach((doc) => {
      items.push({
        id: doc.slug,
        title: doc.metadata.title,
        section: section,
        slug: doc.slug,
      });
    });
  });
  
  return items;
}

async function checkDuplicateIds() {
  try {
    const allDocs = await getAllDocs();
    const docItems = transformDocsToItems(allDocs);
    
    console.log('Total documents:', docItems.length);
    
    // Check for duplicate IDs
    const idCounts = {};
    const duplicates = [];
    
    docItems.forEach(item => {
      if (idCounts[item.id]) {
        idCounts[item.id]++;
        if (idCounts[item.id] === 2) {
          duplicates.push(item.id);
        }
      } else {
        idCounts[item.id] = 1;
      }
    });
    
    if (duplicates.length > 0) {
      console.log('\nDuplicate IDs found:');
      duplicates.forEach(id => {
        console.log(`ID: ${id} (appears ${idCounts[id]} times)`);
        const duplicateItems = docItems.filter(item => item.id === id);
        duplicateItems.forEach((item, index) => {
          console.log(`  ${index + 1}. Section: ${item.section}, Title: ${item.title}`);
        });
      });
    } else {
      console.log('\nNo duplicate IDs found.');
    }
    
    // Show first 10 items for reference
    console.log('\nFirst 10 document items:');
    docItems.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ID: ${item.id}, Section: ${item.section}, Title: ${item.title}`);
    });
    
  } catch (error) {
    console.error('Error checking duplicate IDs:', error);
  }
}

checkDuplicateIds();