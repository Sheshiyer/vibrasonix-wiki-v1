"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

interface Blob {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  blur: string;
  duration: number;
  delay: number;
}

export function LiquidBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Generate enhanced particle system
    const particlePositions = Array.from({ length: 30 }).map((_, i) => ({
      left: (i * 37) % 100, // Deterministic positioning
      top: (i * 23) % 100,
      size: 0.5 + ((i % 4) * 0.5),
      duration: 4 + (i % 6),
      delay: (i % 8),
    }));
    setParticles(particlePositions);

    // Generate dynamic blob system with deterministic values
    const blobConfigs = [
      { color: "bg-gradient-to-r from-purple-500/30 to-pink-500/30", blur: "blur-3xl", size: 96 },
      { color: "bg-gradient-to-r from-blue-500/25 to-cyan-500/25", blur: "blur-2xl", size: 80 },
      { color: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20", blur: "blur-3xl", size: 88 },
      { color: "bg-gradient-to-r from-orange-500/25 to-red-500/25", blur: "blur-2xl", size: 72 },
      { color: "bg-gradient-to-r from-indigo-500/30 to-purple-500/30", blur: "blur-3xl", size: 104 },
      { color: "bg-gradient-to-r from-rose-500/20 to-pink-500/20", blur: "blur-2xl", size: 64 },
    ];

    const dynamicBlobs = blobConfigs.map((config, i) => ({
      id: `blob-${i}`,
      x: (i * 17) % 100, // Deterministic positioning
      y: (i * 29) % 100,
      size: config.size,
      color: config.color,
      blur: config.blur,
      duration: 15 + (i * 3),
      delay: i * 2,
    }));
    setBlobs(dynamicBlobs);
  }, []);

  if (!isClient) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Enhanced gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-transparent to-blue-950/20" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-950/10 to-transparent" />
      
      {/* Dynamic animated blobs */}
       {blobs.map((blob, index) => (
         <motion.div
           key={blob.id}
           className={`absolute rounded-full ${blob.color} ${blob.blur}`}
           style={{
             width: `${blob.size * 4}px`,
             height: `${blob.size * 4}px`,
             left: `${blob.x}%`,
             top: `${blob.y}%`,
           }}
           animate={{
              x: [
                0,
                Math.sin(index * 0.5) * 120,
                Math.cos(index * 0.3) * 80,
                0
              ],
              y: [
                0,
                Math.cos(index * 0.7) * 100,
                Math.sin(index * 0.4) * 60,
                0
              ],
              scale: [1, 1.3, 0.8, 1.1, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
            }}
           transition={{
             duration: blob.duration,
             repeat: Infinity,
             ease: "easeInOut",
             delay: blob.delay,
           }}
         />
       ))}
      
      {/* Morphing background shapes */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Enhanced particle system */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/30 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.1)`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Floating light rays */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)
          `,
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          backgroundPosition: [
            "0% 0%, 100% 100%",
            "100% 100%, 0% 0%",
            "0% 0%, 100% 100%"
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Ambient glow overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(139, 92, 246, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}