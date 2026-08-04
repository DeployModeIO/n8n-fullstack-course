"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { Chrome } from "lucide-react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={cn(
          "flex w-full items-center justify-center gap-3 rounded-xl border",
          "px-6 py-3.5 text-sm font-medium backdrop-blur-xl transition-all duration-300",
          "bg-white border-gray-300 text-gray-900",
          "hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-lg",
          "dark:bg-white/5 dark:border-white/10 dark:text-white/90",
          "dark:hover:bg-white/10 dark:hover:border-white/20",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Chrome size={20} className="text-[#FF6D5A]" />
        {loading ? "Conectando..." : "Continuar con Google"}
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-white/40">
        Al iniciar sesión, aceptas los términos y condiciones del curso.
      </p>
    </div>
  );
}
