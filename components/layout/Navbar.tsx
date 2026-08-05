"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import AuthButton from "@/components/ui/AuthButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/curso", label: "Curso" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin =
    !!user && user.role === "admin" && user.email === "luisriverosu@gmail.com";

  const allLinks = isAdmin
    ? [...navLinks, { href: "/admin", label: "Admin" }]
    : navLinks;

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl",
        "bg-white/70 border-gray-200/50 shadow-sm",
        "dark:bg-white/10 dark:border-white/15 dark:shadow-none"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="bg-gradient-to-r from-[#FF6D5A] via-[#EA4B71] to-[#1E90FF] bg-clip-text text-xl font-bold text-transparent"
          >
            N8N Course
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium",
                "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                "dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                "transition-all duration-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <AuthButton />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "flex items-center justify-center rounded-lg border p-2",
            "bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-100",
            "dark:bg-white/10 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10",
            "backdrop-blur-xl transition-all duration-200 md:hidden"
          )}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t backdrop-blur-xl md:hidden bg-white/70 border-gray-200/50 dark:bg-white/10 dark:border-white/15">
          <div className="space-y-1 px-4 py-3">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-4 py-2.5 text-sm font-medium",
                  "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  "dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                  "transition-all duration-200"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 border-t px-4 py-3 border-gray-200/50 dark:border-white/10">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
