"use client";

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Simple gradient background suitable for a wiki */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/10 via-transparent to-blue-950/10" />
      
      {/* Subtle texture overlay */}
       <div 
         className="absolute inset-0 opacity-20"
         style={{
           background: `
             radial-gradient(ellipse at top, rgba(139, 92, 246, 0.05) 0%, transparent 60%),
             radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.05) 0%, transparent 60%)
           `,
         }}
       />
    </div>
  );
}