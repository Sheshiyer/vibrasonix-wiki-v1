import React from 'react';

export const mdxComponents = {
  // Custom components for interactive elements
  div: ({ className, style, children, ...props }: any) => (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto">
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
  tr: ({ children, ...props }: any) => {
    // Generate a stable key based on the first cell content if available
    const firstChild = Array.isArray(children) ? children[0] : children;
    const key = props.key || `tr-${Math.random().toString(36).substr(2, 9)}`;
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
  // Handle interactive dashboard elements with proper React component names
  InteractiveDashboard: ({ children, ...props }: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border" {...props}>
      {children}
    </div>
  ),
  FrequencySlider: ({ children, ...props }: any) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border" {...props}>
      {children}
    </div>
  ),
  BrainwaveDisplay: ({ children, ...props }: any) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border" {...props}>
      {children}
    </div>
  ),
  SliderVisualization: ({ children, ...props }: any) => (
    <div className="my-4 p-4 bg-gray-50 rounded border" {...props}>
      {children}
    </div>
  ),
  WaveAnimation: ({ children, ...props }: any) => (
    <div className="my-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded border" {...props}>
      {children}
    </div>
  ),
  BrainActivityMap: ({ children, ...props }: any) => (
    <div className="my-4 p-4 bg-gray-50 rounded border" {...props}>
      {children}
    </div>
  ),
  BrainwaveTable: ({ children, ...props }: any) => (
    <div className="my-6" {...props}>
      {children}
    </div>
  ),
  // Additional interactive components
  EffectsCards: ({ children, ...props }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8" {...props}>
      {children}
    </div>
  ),
  EffectCard: ({ children, ...props }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow" {...props}>
      {children}
    </div>
  ),
  NavigationCards: ({ children, ...props }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8" {...props}>
      {children}
    </div>
  ),
  NavCard: ({ children, href, className, ...props }: any) => (
    <a href={href} className={`block p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${className || ''}`} {...props}>
      {children}
    </a>
  ),
  DashboardFooter: ({ children, ...props }: any) => (
    <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-muted-foreground" {...props}>
      {children}
    </div>
  ),
};