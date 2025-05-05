"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/logout-button";

export function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">PureMatch</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Главная
            </Link>
            {!loading && !isLoggedIn && (
              <>
                <Link
                  href="/auth/login"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/auth/login" ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Вход
                </Link>
                <Link
                  href="/auth/register"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/auth/register" ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Регистрация
                </Link>
              </>
            )}
            {!loading && isLoggedIn && (
              <>
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/profile" ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Профиль
                </Link>
                <Link
                  href="/matches"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/matches" ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Совпадения
                </Link>
                <Link
                  href="/messages"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/messages" ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Сообщения
                </Link>
                <LogoutButton className="text-sm py-1 px-3" />
              </>
            )}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
