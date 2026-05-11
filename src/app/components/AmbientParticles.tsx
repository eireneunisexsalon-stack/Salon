'use client';

import { useEffect, useState } from 'react';

export default function AmbientParticles() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 20 + 20}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map(p => (
        <div 
          key={p.id}
          className="particle animate-drift"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  );
}
