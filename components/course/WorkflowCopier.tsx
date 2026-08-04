"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import GlassCard from "@/components/ui/GlassCard";
import { Copy, Check } from "lucide-react";

interface WorkflowCopierProps {
  workflowJson: string | object;
  title: string;
}

export default function WorkflowCopier({
  workflowJson,
  title,
}: WorkflowCopierProps) {
  const [copied, setCopied] = useState(false);

  const jsonString =
    typeof workflowJson === "string"
      ? workflowJson
      : JSON.stringify(workflowJson, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="mt-6" padding="lg">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white/90">{title}</h4>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium",
            "backdrop-blur-xl transition-all duration-300",
            copied
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
          )}
        >
          {copied ? (
            <>
              <Check size={14} />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar Workflow
            </>
          )}
        </button>
      </div>

      <div
        className={cn(
          "max-h-80 overflow-auto rounded-xl border border-white/5 bg-black/40 p-4",
          "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        )}
      >
        <pre className="text-xs leading-relaxed text-green-400/80">
          <code>{jsonString}</code>
        </pre>
      </div>
    </GlassCard>
  );
}
