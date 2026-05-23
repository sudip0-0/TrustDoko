"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

type MobileNavProps = {
  items: NavItem[];
  userLinks?: NavItem[] | undefined;
  showAuth?: boolean;
  isLoggedIn?: boolean;
};

export function MobileNav({
  items,
  userLinks = [],
  showAuth = true,
  isLoggedIn = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-8 w-8 items-center justify-center sm:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <div className="relative h-3.5 w-4">
          <motion.span
            className="absolute top-0 left-0 h-[1.5px] w-full rounded-full bg-foreground"
            animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          />
          <motion.span
            className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-foreground"
            animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          />
          <motion.span
            className="absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-foreground"
            animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-white/90 backdrop-blur-3xl sm:hidden"
          >
            <nav
              className="flex flex-col items-center gap-6"
              aria-label="Mobile"
            >
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={
                      pathname === item.href ? "page" : undefined
                    }
                    className={cn(
                      "text-2xl font-semibold no-underline transition-colors duration-300",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {userLinks.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.5,
                    delay: (items.length + i) * 0.1,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={
                      pathname.startsWith(item.href) ? "page" : undefined
                    }
                    className={cn(
                      "text-2xl font-semibold no-underline transition-colors duration-300",
                      pathname.startsWith(item.href)
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {showAuth && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.5,
                  delay: (items.length + userLinks.length) * 0.1 + 0.1,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="flex flex-col items-center gap-4"
              >
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="text-muted text-lg font-medium no-underline hover:text-foreground transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline shadow-[0_1px_2px_rgba(15,118,110,0.15)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                    >
                      Register
                    </Link>
                  </>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
