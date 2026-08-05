"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      login(data.user);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border",
                "bg-white border-gray-300 text-gray-900",
                "dark:bg-white/10 dark:border-white/15 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-[#FF6D5A] focus:border-transparent",
                "transition-all duration-200"
              )}
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border",
                "bg-white border-gray-300 text-gray-900",
                "dark:bg-white/10 dark:border-white/15 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-[#FF6D5A] focus:border-transparent",
                "transition-all duration-200"
              )}
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full py-3 px-4 rounded-xl font-medium text-white",
          "bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71]",
          "hover:shadow-lg hover:-translate-y-0.5",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          "transition-all duration-300",
          "flex items-center justify-center gap-2"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </button>

      <p className="text-center text-xs text-gray-500 dark:text-white/40">
        Solo usuarios creados por el admin pueden acceder al curso.
      </p>
    </form>
  );
}
