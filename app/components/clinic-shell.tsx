import type { ComponentType, ReactNode, SVGProps } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ShellRoute = "dashboard" | "patients" | "rendez-vous";

const navigationItems: Array<{
  label: string;
  href: string;
  route?: ShellRoute;
  icon: IconComponent;
}> = [
  { label: "Dashboard", href: "/dashboard", route: "dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", route: "patients", icon: Users },
  { label: "Rendez-vous", href: "/rendez-vous", route: "rendez-vous", icon: Calendar },
  { label: "Salle d’attente", href: "#", icon: Users },
  { label: "Traitements", href: "#", icon: Stethoscope },
  { label: "Plan dentaire", href: "#", icon: ClipboardList },
  { label: "Paiements", href: "#", icon: CreditCard },
  { label: "Ordonnances", href: "#", icon: FileText },
  { label: "Rapports", href: "#", icon: ReceiptText },
  { label: "Paramètres", href: "#", icon: Settings },
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

function ToothMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 42 42" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 5.25c2.36-1.3 6.75-2.08 10.31 1.67 3.68 3.87 3.12 10.88.12 15.95-1.58 2.67-2.07 5.77-2.52 8.62-.53 3.35-1.03 6.51-3.5 6.51-1.86 0-2.48-2.47-3.04-4.68-.43-1.73-.83-3.32-1.37-3.32s-.94 1.59-1.37 3.32C19.07 35.53 18.45 38 16.59 38c-2.47 0-2.97-3.16-3.5-6.51-.45-2.85-.94-5.95-2.52-8.62-3-5.07-3.56-12.08.12-15.95C14.25 3.17 18.64 3.95 21 5.25Z"
        fill="currentColor"
      />
      <path
        d="M16.4 10.6c2.1-1.2 4.3.7 4.6.98.3-.28 2.5-2.18 4.6-.98"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#2563EB] text-white shadow-xl shadow-teal-700/25 2xl:h-12 2xl:w-12">
        <ToothMark className="h-6 w-6 2xl:h-7 2xl:w-7" />
      </span>
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

function Sidebar({ activeRoute }: { activeRoute: ShellRoute }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-[#E2E8F0] bg-white/95 px-3.5 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:flex 2xl:w-72 2xl:px-4 2xl:py-5">
      <Logo />
      <div className="mt-5 flex-1 overflow-y-auto pr-1 2xl:mt-8">
        <SidebarNav activeRoute={activeRoute} />
      </div>
      <button
        type="button"
        className="mt-4 flex w-full items-center gap-2.5 rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-2.5 text-left transition hover:border-[#0F766E]/30 hover:shadow-lg 2xl:gap-3 2xl:p-3"
      >
        <Avatar name="Dr Benali" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-[#0F172A]">
            Dr Benali
          </span>
          <span className="block truncate text-xs font-medium text-[#64748B]">
            Administrateur
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </button>
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
  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Sidebar activeRoute={activeRoute} />
      <MobileTopNav activeRoute={activeRoute} />

      <div className="lg:pl-60 2xl:pl-72">
        <div
          className={cx(
            "mx-auto flex flex-col gap-4 px-4 py-4 sm:px-5 lg:px-5 lg:py-5 2xl:gap-6 2xl:px-8 2xl:py-8",
            maxWidth,
          )}
        >
          <Header
            title={title}
            subtitle={subtitle}
            searchPlaceholder={searchPlaceholder}
          />
          {children}
        </div>
      </div>
    </main>
  );
}
