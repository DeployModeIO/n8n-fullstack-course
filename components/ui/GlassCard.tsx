import { cn } from "@/lib/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export default function GlassCard({
  children,
  className,
  hover = false,
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border backdrop-blur-xl transition-all duration-300",
        "bg-white/60 border-gray-200/50 shadow-lg",
        "dark:bg-white/10 dark:border-white/15",
        paddingMap[padding],
        hover && "hover:-translate-y-1 hover:shadow-xl cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
