'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { FlaskConical, ChevronDown, Target, ListChecks, Trophy } from 'lucide-react';

export interface LabData {
  id: string;
  title: string;
  objective: string;
  instructions: string;
  deliverable: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const difficultyStyle: Record<LabData['difficulty'], string> = {
  easy: 'bg-green-500/10 text-green-600 dark:text-green-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  hard: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const difficultyLabel: Record<LabData['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

export default function LabViewer({ labs }: { labs: LabData[] }) {
  const [openId, setOpenId] = useState<string | null>(labs[0]?.id ?? null);

  if (!labs.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white/90">
        <FlaskConical size={20} className="text-[#FF6D5A]" />
        Laboratorios Prácticos
      </h2>

      {labs.map((lab) => {
        const open = openId === lab.id;
        return (
          <div
            key={lab.id}
            className="overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15"
          >
            <button
              onClick={() => setOpenId(open ? null : lab.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                {lab.title}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    difficultyStyle[lab.difficulty]
                  )}
                >
                  {difficultyLabel[lab.difficulty]}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    'text-gray-500 transition-transform',
                    open && 'rotate-180'
                  )}
                />
              </span>
            </button>

            {open && (
              <div className="space-y-4 border-t border-gray-200/50 px-5 py-4 dark:border-white/10">
                <div className="flex items-start gap-2">
                  <Target size={16} className="mt-0.5 text-[#1E90FF]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Objetivo
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lab.objective}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ListChecks size={16} className="mt-0.5 text-[#FF6D5A]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Instrucciones
                    </p>
                    <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400 dark:prose-p:text-white/70">
                      {lab.instructions}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Trophy size={16} className="mt-0.5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Entregable
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lab.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
