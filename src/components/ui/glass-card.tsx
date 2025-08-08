"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: boolean;
  interactive?: boolean;
  gradient?: 'primary' | 'secondary' | 'accent' | 'rainbow';
}

const gradientVariants = {
  primary: "from-primary/20 via-primary/10 to-transparent",
  secondary: "from-secondary/20 via-secondary/10 to-transparent",
  accent: "from-accent/20 via-accent/10 to-transparent",
  rainbow: "from-primary/20 via-secondary/20 to-accent/20",
};

export function GlassCard({ 
  children, 
  className, 
  blur = true, 
  interactive = false,
  gradient = 'rainbow'
}: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { scale: 1, rotateX: 0, rotateY: 0 },
    hover: { 
      scale: interactive ? 1.02 : 1,
      rotateX: interactive ? 2 : 0,
      rotateY: interactive ? 2 : 0,
    },
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: { 
      opacity: 1, 
      scale: 1.1,
    },
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10",
        blur && "backdrop-blur-xl",
        interactive && "cursor-pointer transform-gpu perspective-1000",
        className
      )}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated glow effect */}
      <motion.div 
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r opacity-0 blur-sm",
          gradientVariants[gradient]
        )}
        variants={glowVariants}
        animate={isHovered ? "hover" : "initial"}
      />
      
      {/* Main gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        gradientVariants[gradient]
      )} />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '200%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
      
      {/* Border highlight */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/30 opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </motion.div>
  );
}