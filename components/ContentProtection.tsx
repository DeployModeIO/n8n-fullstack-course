'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/context';

export default function ContentProtection({
  children,
  watermarkLabel,
}: {
  children: React.ReactNode;
  watermarkLabel?: string;
}) {
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const block = (e: Event) => {
      e.preventDefault();
      return false;
    };

    node.addEventListener('contextmenu', block);
    node.addEventListener('copy', block);
    node.addEventListener('cut', block);
    node.addEventListener('selectstart', block);

    return () => {
      node.removeEventListener('contextmenu', block);
      node.removeEventListener('copy', block);
      node.removeEventListener('cut', block);
      node.removeEventListener('selectstart', block);
    };
  }, []);

  const label = watermarkLabel || user?.email || 'Curso N8N';

  return (
    <div ref={ref} className="no-select relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] select-none overflow-hidden opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(-30deg, transparent 0 120px, rgba(255,109,90,0.5) 120px 240px)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-3 right-3 z-[61] select-none rounded-md bg-black/30 px-2 py-1 text-[10px] text-white/60 backdrop-blur"
      >
        {label}
      </div>
      {children}
    </div>
  );
}
