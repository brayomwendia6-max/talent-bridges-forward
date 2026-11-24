import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "My Profile" },
  { to: "/portfolio", label: "Skills Portfolio" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-navy-foreground">
      <span className="grid size-9 place-items-center rounded-lg bg-teal font-display text-lg font-bold">
        T
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold">TalentBridge</span>
        <span className="block text-[11px] font-medium tracking-wide text-teal-bright">
          Skills to Opportunities
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-navy-foreground/10 bg-navy-deep/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/75 transition-colors hover:bg-navy-foreground/10 hover:text-navy-foreground data-[status=active]:bg-teal/20 data-[status=active]:text-teal-bright"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-md text-navy-foreground transition-colors hover:bg-navy-foreground/10 lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <nav className="min-h-0" aria-label="Mobile">
          <ul className="space-y-1 border-t border-navy-foreground/10 px-4 py-3">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  tabIndex={open ? 0 : -1}
                  activeOptions={{ exact: item.to === "/" }}
                  className="block rounded-md px-3 py-3 text-base font-medium text-navy-foreground/85 hover:bg-navy-foreground/10 data-[status=active]:bg-teal/20 data-[status=active]:text-teal-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
