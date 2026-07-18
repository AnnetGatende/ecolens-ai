"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report" },
  { href: "/map", label: "Map" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assistant", label: "Assistant" },
  { href: "/about", label: "About" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavLinkProps = {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
  className?: string;
};

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
  className,
}: NavLinkProps) {
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        className
      )}
    >
      {label}
    </Link>
  );
}

type ReportIncidentButtonProps = {
  className?: string;
  onNavigate?: () => void;
};

function ReportIncidentButton({
  className,
  onNavigate,
}: ReportIncidentButtonProps) {
  return (
    <Link
      href="/report"
      onClick={onNavigate}
      className={cn(
        buttonVariants({ size: "default" }),
        "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
        className
      )}
    >
      Report Incident
    </Link>
  );
}

type DesktopNavProps = {
  pathname: string;
};

function DesktopNav({ pathname }: DesktopNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 md:flex"
    >
      {NAV_LINKS.map((link) => (
        <NavLink key={link.href} {...link} pathname={pathname} />
      ))}
    </nav>
  );
}

type MobileNavProps = {
  pathname: string;
};

function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          />
        }
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="border-slate-200 bg-white">
        <SheetHeader className="border-b border-slate-100 pb-4">
          <SheetTitle className="text-left text-lg font-semibold text-slate-900">
            🌿 EcoLens AI
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 px-4"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              pathname={pathname}
              onNavigate={closeSheet}
              className="w-full"
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-100 p-4">
          <ReportIncidentButton
            className="w-full"
            onNavigate={closeSheet}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-emerald-700"
        >
          <span aria-hidden="true">🌿</span>
          <span>EcoLens AI</span>
        </Link>

        <DesktopNav pathname={pathname} />

        <div className="flex items-center gap-2">
          <ReportIncidentButton className="hidden sm:inline-flex" />
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
