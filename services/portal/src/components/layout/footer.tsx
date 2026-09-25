import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-muted/40 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-primary text-lg font-bold">{siteConfig.name}</p>
          <p className="text-foreground/70 mt-2 max-w-xs text-sm">
            {siteConfig.description}
          </p>
        </div>

        {siteConfig.footerNav.map((section) => (
          <div key={section.title}>
            <h3 className="text-foreground text-sm font-semibold">
              {section.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-border text-foreground/60 border-t px-4 py-4 text-center text-xs sm:px-6 lg:px-8">
        © {year} {siteConfig.name} — Projeto comunitário e independente da
        Universidade de Brasília (UnB).
      </div>
    </footer>
  );
}
