import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export async function compileMDXFile(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight, rehypeSlug],
        remarkPlugins: [remarkGfm],
      },
    },
  });
  return content;
}

// Cache MDX compilation
const mdxCache = new Map();

export async function getCachedMDX(source: string) {
  if (mdxCache.has(source)) {
    return mdxCache.get(source);
  }
  const compiled = await compileMDXFile(source);
  mdxCache.set(source, compiled);
  return compiled;
} 