import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative h-2 flex-1 overflow-hidden rounded-full",
          "border bg-gray-200 border-gray-300/50",
          "dark:bg-white/5 dark:border-white/5"
        )}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-medium text-gray-600 dark:text-white/50">
          {clamped}%
        </span>
      )}
    </div>
  );
}
