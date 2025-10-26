"use client";

import React, { useEffect, useState } from "react";
import ThemeSwitcher from "../global/ThemeSwitcher";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthSelector } from "@/features/auth/hooks.redux";
import { useRouter, usePathname } from "next/navigation";
import { authMutations } from "@/features/auth/hooks.query";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuthSelector();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout } = authMutations.logout();

  const closeMenu = () => setIsMenuOpen(false);

  // Scroll to section function
  const handleSectionNavigation = (section: string) => {
    closeMenu();

    if (pathname !== "/") {
      router.push(`/#${section}`);
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Close on scroll
  useEffect(() => {
    if (isMenuOpen) {
      const handleScroll = () => closeMenu();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Public Pulse</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleSectionNavigation("features")}
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                Features
              </button>

              <button
                onClick={() => handleSectionNavigation("how-it-works")}
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                How It Works
              </button>

              <button
                onClick={() => handleSectionNavigation("recent-issues")}
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                Reported Issues
              </button>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex gap-2">
                {!isLoggedIn ? (
                  <>
                    <Button size="lg" onClick={() => router.push("/auth/login")} variant="outline">
                      Login
                    </Button>

                    <Button size="lg" onClick={() => router.push("/auth/signup")} variant="default">
                      Register
                    </Button>
                  </>
                ) : (
                  <Button size="lg" onClick={() => logout()} variant="secondary">
                    Logout
                  </Button>
                )}
              </div>

              <ThemeSwitcher />
              <button
                className="md:hidden p-2 rounded-lg hover:bg-accent transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            <button
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => handleSectionNavigation("features")}
            >
              Features
            </button>

            <button
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => handleSectionNavigation("how-it-works")}
            >
              How It Works
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-br from-primary to-primary/70 text-primary-foreground hover:from-primary/90 hover:to-primary/80"
              onClick={() => handleSectionNavigation("report")}
            >
              <Zap className="w-4 h-4" />
              Report Issue
            </button>

            <div className="flex flex-col space-y-2 mt-2">
              {!isLoggedIn ? (
                <>
                  <Button variant="outline" onClick={() => router.push("/auth/login")}>
                    Login
                  </Button>

                  <Button variant="default" onClick={() => router.push("/auth/signup")}>
                    Register
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={() => logout()}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
