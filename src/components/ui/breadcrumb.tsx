"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <motion.nav
      className={cn(
        "flex items-center space-x-1 sm:space-x-2 p-2 sm:p-4 rounded-lg sm:rounded-xl",
        "backdrop-blur-xl bg-white/10 border border-white/20",
        "shadow-lg overflow-x-auto",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Home icon */}
      <Link href="/">
        <motion.div
          className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.div>
      </Link>
      
      {items.length > 0 && (
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
      )}
      
      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={`breadcrumb-${index}-${item.href}`} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <Link href={item.href}>
            <motion.div
              className={cn(
                "flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors",
                "hover:bg-white/20",
                index === items.length - 1 
                  ? "bg-white/30 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.icon && (
                <span className="text-xs sm:text-sm">{item.icon}</span>
              )}
              <span className="text-xs sm:text-sm whitespace-nowrap">{item.title}</span>
            </motion.div>
          </Link>
          
          {index < items.length - 1 && (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      ))}
    </motion.nav>
  );
}

// Helper function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    // Convert segment to title (capitalize and replace hyphens)
    const title = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Add appropriate icons based on section
    let icon: React.ReactNode = undefined;
    if (segment === 'sonic-science') icon = '🧠';
    else if (segment === 'experience-library') icon = '🛠️';
    else if (segment === 'transformation-journeys') icon = '🔮';
    else if (segment === 'research-observatory') icon = '🔬';
    else if (segment === 'community-cosmos') icon = '💫';
    else if (segment === 'sonic-lab') icon = '🧪';
    
    breadcrumbs.push({
      title,
      href: currentPath,
      icon,
    });
  }
  
  return breadcrumbs;
}