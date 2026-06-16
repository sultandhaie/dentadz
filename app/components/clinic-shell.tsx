"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ShellRoute =
  | "dashboard"
  | "patients"
  | "rendez-vous"
  | "salle-attente"
  | "traitements"
  | "plan-dentaire"
  | "paiements"
  | "ordonnances"
  | "rapports"
  | "parametres";

const navigationItems: Array<{
  label: string;
  href: string;
  route?: ShellRoute;
  icon: IconComponent;
}> = [
  { label: "Dashboard", href: "/dashboard", route: "dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", route: "patients", icon: Users },
  { label: "Rendez-vous", href: "/rendez-vous", route: "rendez-vous", icon: Calendar },
  { label: "Salle d’attente", href: "/salle-attente", route: "salle-attente", icon: Users },
  { label: "Traitements", href: "/traitements", route: "traitements", icon: Stethoscope },
  { label: "Plan dentaire", href: "/plan-dentaire", route: "plan-dentaire", icon: ClipboardList },
  { label: "Paiements", href: "/paiements", route: "paiements", icon: CreditCard },
  { label: "Ordonnances", href: "/ordonnances", route: "ordonnances", icon: FileText },
  { label: "Rapports", href: "/rapports", route: "rapports", icon: ReceiptText },
  { label: "Paramètres", href: "/parametres", route: "parametres", icon: Settings },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="DentaDZ Logo"
        width={48}
        height={48}
        className="h-11 w-11 2xl:h-12 2xl:w-12"
      />
      <div>
        <p className="text-lg font-bold text-[#0F172A] 2xl:text-xl">DentaDZ</p>
        <p className="text-xs font-medium text-[#64748B] 2xl:text-sm">Cabinet Dentaire</p>
      </div>
    </div>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-md shadow-slate-900/10",
        className,
      )}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}

function SidebarNav({
  activeRoute,
  mobile = false,
}: {
  activeRoute: ShellRoute;
  mobile?: boolean;
}) {
  return (
    <nav className={cx("space-y-1", mobile && "grid gap-1 sm:grid-cols-2")}>
      {navigationItems.map((item) => {
        const active = item.route === activeRoute;

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.92rem] font-semibold transition duration-200 2xl:gap-3 2xl:py-3 2xl:text-sm",
              active
                ? "bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-white shadow-lg shadow-teal-700/20"
                : "text-[#0F172A] hover:bg-slate-100",
            )}
          >
            <item.icon
              className={cx(
                "h-5 w-5 shrink-0",
                active ? "text-white" : "text-[#64748B] group-hover:text-[#0F766E]",
              )}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({ activeRoute, userName, userRole, onLogout }: { activeRoute: ShellRoute; userName: string; userRole: string; onLogout: () => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-[#E2E8F0] bg-white/95 px-3.5 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:flex 2xl:w-72 2xl:px-4 2xl:py-5">
      <Logo />
      <div className="mt-5 flex-1 overflow-y-auto pr-1 2xl:mt-8">
        <SidebarNav activeRoute={activeRoute} />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-2.5 2xl:gap-3 2xl:p-3">
          <Avatar name={userName} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#0F172A]">
              {userName}
            </span>
            <span className="block truncate text-xs font-medium text-[#64748B]">
              {userRole}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-2.5 text-left text-sm font-bold text-[#EF4444] transition cursor-pointer hover:bg-red-100 hover:shadow-md 2xl:gap-3 2xl:p-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <LogOut className="h-4 w-4" />
          </span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function MobileTopNav({ activeRoute }: { activeRoute: ShellRoute }) {
  return (
    <div className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
      <details>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <Logo />
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </span>
        </summary>
        <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-xl shadow-slate-900/10">
          <SidebarNav activeRoute={activeRoute} mobile />
        </div>
      </details>
    </div>
  );
}

function Header({
  title,
  subtitle,
  searchPlaceholder,
}: {
  title?: string;
  subtitle?: string;
  searchPlaceholder: string;
}) {
  return (
    <header className="rounded-2xl border border-[#E2E8F0] bg-white/85 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.04)] backdrop-blur 2xl:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {title ? (
          <div>
            <h1 className="text-[1.45rem] font-bold text-[#0F172A] sm:text-2xl 2xl:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm font-medium text-[#64748B] 2xl:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 xl:min-w-0 xl:items-end">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
            <label className="relative block w-full sm:w-80 xl:w-72 2xl:w-96">
              <span className="sr-only">Rechercher</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10 2xl:h-12"
              />
            </label>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-[#E2E8F0] bg-white p-1">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-[#0F766E] px-3 text-sm font-bold text-white"
                >
                  FR
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-lg px-3 text-sm font-bold text-[#64748B] transition hover:bg-slate-100"
                >
                  AR
                </button>
              </div>
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] transition hover:border-[#EF4444]/40 hover:bg-red-50"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1 text-xs font-bold text-white ring-2 ring-white">
                  3
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  dentist: "Dentiste",
  receptionist: "Réceptionniste",
  assistant: "Assistant(e)",
};

export default function ClinicShell({
  activeRoute,
  title,
  subtitle,
  searchPlaceholder,
  children,
  maxWidth = "max-w-[1600px]",
}: {
  activeRoute: ShellRoute;
  title?: string;
  subtitle?: string;
  searchPlaceholder: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        const user = JSON.parse(raw);
        setUserName(user.name || "Utilisateur");
        setUserRole(roleLabels[user.role] || user.role || "");
      }
    } catch {
      // fallback defaults
    }
  }, []);

  const greetingTitle = title || `Bonjour, ${userName} 👋`;
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Sidebar activeRoute={activeRoute} userName={userName} userRole={userRole} onLogout={handleLogout} />
      <MobileTopNav activeRoute={activeRoute} />

      <div className="lg:pl-60 2xl:pl-72">
        <div
          className={cx(
            "mx-auto flex flex-col gap-4 px-4 py-4 sm:px-5 lg:px-5 lg:py-5 2xl:gap-6 2xl:px-8 2xl:py-8",
            maxWidth,
          )}
        >
          <Header
            title={greetingTitle}
            subtitle={subtitle}
            searchPlaceholder={searchPlaceholder}
          />
          {children}
        </div>
      </div>
    </main>
  );
}
