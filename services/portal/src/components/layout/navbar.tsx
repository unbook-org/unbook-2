"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, NavigationMenu } from "radix-ui";
import { useState } from "react";

import { siteConfig } from "@/lib/site-config";

function NavLink({
  href,
  title,
  active,
  onNavigate,
}: {
  href: string;
  title: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active ? "text-primary" : "text-foreground/70 hover:text-foreground"
      }`}
    >
      {title}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-primary text-lg font-bold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex items-center gap-1">
            {siteConfig.mainNav.map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild active={pathname === item.href}>
                  <NavLink
                    href={item.href}
                    title={item.title}
                    active={pathname === item.href}
                  />
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="text-foreground/70 hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded-md p-2 md:hidden"
              aria-label="Abrir menu de navegação"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 md:hidden" />
            <Dialog.Content
              className="bg-background fixed inset-y-0 right-0 z-50 flex w-64 flex-col gap-2 p-6 shadow-xl md:hidden"
              aria-describedby={undefined}
            >
              <div className="mb-4 flex items-center justify-between">
                <Dialog.Title className="text-base font-semibold">
                  Menu
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Fechar menu"
                    className="text-foreground/70 hover:bg-muted rounded-md p-1"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>

              {siteConfig.mainNav.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  active={pathname === item.href}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
