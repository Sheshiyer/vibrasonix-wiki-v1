import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

// Custom components for react-markdown
const components = {
  // Table components with proper styling
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, node, ...props }: any) => {
    // Use a more reliable key generation approach
    const key = props.key || `tr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return (
      <tr key={key} {...props}>
        {children}
      </tr>
    );
  },
  th: ({ children, ...props }: any) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-gray-300 px-4 py-2" {...props}>
      {children}
    </td>
  ),
  
  // Custom interactive components
  div: ({ children, className, ...props }: any) => {
    // Handle special component classes
    if (className?.includes('InteractiveDashboard')) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border" {...props}>
          {children}
        </div>
      );
    }
    if (className?.includes('BrainwaveTable')) {
      return (
        <div className="my-6" {...props}>
          {children}
        </div>
      );
    }
    if (className?.includes('FrequencySlider') || className?.includes('BrainwaveDisplay')) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm border my-4" {...props}>
          {children}
        </div>
      );
    }
    if (className?.includes('EffectsCards')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8" {...props}>
          {children}
        </div>
      );
    }
    if (className?.includes('NavigationCards')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8" {...props}>
          {children}
        </div>
      );
    }
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },
  
  // Code blocks with syntax highlighting
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },
  
  // Headings with proper styling
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold mb-4 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-medium mb-3 mt-5" {...props}>
      {children}
    </h3>
  ),
  
  // Paragraphs and lists
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="mb-1" {...props}>
      {children}
    </li>
  ),
  
  // Links
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline" 
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600" {...props}>
      {children}
    </blockquote>
  ),
};

export function AlternativeContentRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

export default AlternativeContentRenderer;