"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { LogIn, LogOut } from "lucide-react";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user as User | null);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User | null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-white/10" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur-xl bg-white/70 border-gray-200/50 dark:bg-white/10 dark:border-white/15">
          <span className="text-sm font-medium text-gray-900 dark:text-white/90">
            {user.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2",
            "backdrop-blur-xl text-sm font-medium",
            "bg-white/70 border-gray-200/50 text-gray-700",
            "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
            "dark:bg-white/10 dark:border-white/15 dark:text-white/70",
            "dark:hover:bg-red-500/20 dark:hover:border-red-500/30 dark:hover:text-red-300",
            "transition-all duration-300"
          )}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(
        "flex items-center gap-2 rounded-xl border px-4 py-2",
        "backdrop-blur-xl text-sm font-medium",
        "bg-white/70 border-gray-200/50 text-gray-900",
        "hover:bg-white hover:border-gray-300 hover:-translate-y-0.5",
        "dark:bg-white/10 dark:border-white/15 dark:text-white/90",
        "dark:hover:bg-white/10 dark:hover:border-white/20",
        "transition-all duration-300"
      )}
    >
      <LogIn size={18} className="text-[#FF6D5A]" />
      Iniciar Sesión
    </Link>
  );
}
