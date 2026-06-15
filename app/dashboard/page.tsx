"use client";

import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CircleAlert,
  ClipboardPlus,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import DashboardCharts from "./dashboard-charts";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const quickActions = [
  { label: "Nouveau patient", icon: UserPlus, accent: "text-[#0F766E] bg-teal-50", href: "/patients/nouveau" },
  {
    label: "Nouveau rendez-vous",
    icon: Calendar,
    accent: "text-[#2563EB] bg-blue-50",
    href: "/rendez-vous/nouveau",
  },
  {
    label: "Nouvelle ordonnance",
    icon: ClipboardPlus,
    accent: "text-[#7C3AED] bg-violet-50",
    href: "/ordonnances/nouvelle",
  },
  { label: "Nouveau paiement", icon: Wallet, accent: "text-[#F59E0B] bg-amber-50", href: "/paiements/nouveau" },
];

const stats = [
  {
    label: "Rendez-vous aujourd’hui",
    value: "18",
    trend: "+4 par rapport à hier",
    icon: Calendar,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    label: "Nouveaux patients",
    value: "7",
    trend: "Cette semaine",
    icon: UserPlus,
    accent: "from-[#22C55E] to-[#86EFAC]",
  },
  {
    label: "Revenus du mois",
    value: "420.000 DA",
    trend: "+12% ce mois",
    icon: Wallet,
    accent: "from-[#0F766E] to-[#2DD4BF]",
  },
  {
    label: "Paiements restants",
    value: "75.000 DA",
    trend: "12 patients",
    icon: CircleAlert,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
];

const appointments = [
  {
    time: "09:00",
    patient: "Ahmed Benali",
    treatment: "Détartrage",
    status: "Confirmé",
    tone: "blue",
  },
  {
    time: "09:30",
    patient: "Sara Khaldi",
    treatment: "Consultation",
    status: "En attente",
    tone: "orange",
  },
  {
    time: "10:00",
    patient: "Mohamed Amrani",
    treatment: "Extraction",
    status: "En consultation",
    tone: "purple",
  },
  {
    time: "11:00",
    patient: "Lina Cherif",
    treatment: "Orthodontie",
    status: "Confirmé",
    tone: "blue",
  },
  {
    time: "12:00",
    patient: "Yacine Saadi",
    treatment: "Plombage",
    status: "Terminé",
    tone: "green",
  },
];

// Removed static waitingRoom constant to be replaced by state inside WaitingRoomPanel

const recentPatients = [
  {
    patient: "Ahmed Benali",
    phone: "0555 22 33 44",
    lastVisit: "08 Juin 2026",
    nextVisit: "12 Juin 2026",
    status: "Actif",
    tone: "green",
  },
  {
    patient: "Sara Khaldi",
    phone: "0661 10 20 30",
    lastVisit: "07 Juin 2026",
    nextVisit: "10 Juin 2026",
    status: "En traitement",
    tone: "blue",
  },
  {
    patient: "Yacine Saadi",
    phone: "0777 44 55 66",
    lastVisit: "06 Juin 2026",
    nextVisit: "—",
    status: "Nouveau",
    tone: "purple",
  },
  {
    patient: "Lina Cherif",
    phone: "0550 33 44 55",
    lastVisit: "05 Juin 2026",
    nextVisit: "11 Juin 2026",
    status: "Actif",
    tone: "green",
  },
];

const recentPayments = [
  {
    patient: "Lina Cherif",
    treatment: "Orthodontie",
    amount: "25.000 DA",
    method: "Cash",
    status: "Payé",
    tone: "green",
  },
  {
    patient: "Mohamed Amrani",
    treatment: "Extraction",
    amount: "8.000 DA",
    method: "BaridiMob",
    status: "Payé",
    tone: "green",
  },
  {
    patient: "Yacine Saadi",
    treatment: "Couronne",
    amount: "15.000 DA",
    method: "Cash",
    status: "Reste 5.000 DA",
    tone: "orange",
  },
  {
    patient: "Sara Khaldi",
    treatment: "Plombage",
    amount: "6.000 DA",
    method: "CCP",
    status: "Payé",
    tone: "green",
  },
];

const badgeStyles: Record<string, string> = {
  blue: "bg-blue-50 text-[#2563EB] ring-blue-100",
  green: "bg-emerald-50 text-[#22C55E] ring-emerald-100",
  orange: "bg-amber-50 text-[#F59E0B] ring-amber-100",
  purple: "bg-violet-50 text-[#7C3AED] ring-violet-100",
  teal: "bg-teal-50 text-[#0F766E] ring-teal-100",
};

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:shadow-[0_28px_70px_rgba(15,23,42,0.10)] 2xl:p-5";

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

function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ring-1",
        badgeStyles[tone] ?? badgeStyles.teal,
      )}
    >
      {label}
    </span>
  );
}

function QuickActions() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Actions rapides">
      {quickActions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex min-h-14 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0F766E]/30 hover:shadow-xl hover:shadow-slate-900/10 2xl:min-h-16"
        >
          <span
            className={cx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 2xl:h-11 2xl:w-11",
              action.accent,
            )}
          >
            <action.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-[#0F172A]">
            <Plus className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
            <span className="truncate">{action.label}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  trend: string;
  icon: IconComponent;
  accent: string;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.10)] 2xl:p-5">
      <div className="flex items-start justify-between gap-3 2xl:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#64748B]">{label}</p>
          <p className="mt-2 text-xl font-bold text-[#0F172A] 2xl:mt-3 2xl:text-3xl">
            {value}
          </p>
        </div>
        <span
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105 2xl:h-12 2xl:w-12",
            accent,
          )}
        >
          <Icon className="h-5 w-5 2xl:h-6 2xl:w-6" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-[#64748B] 2xl:mt-4">
        {trend}
      </p>
    </article>
  );
}

function AppointmentPanel() {
  const [activeFilter, setActiveFilter] = useState<string>("Tous");

  const filteredAppointments = appointments.filter((app) => {
    if (activeFilter === "Tous") return true;
    return app.status === activeFilter;
  });

  return (
    <article className={panelClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Planning d’aujourd’hui
            </h2>
            <p className="text-sm text-[#64748B]">
              {filteredAppointments.length} rendez-vous à suivre
            </p>
          </div>
        </div>
        <Link
          href="/rendez-vous/nouveau"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau rendez-vous
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-[#E2E8F0] pb-3 text-xs">
        {["Tous", "Confirmé", "En attente", "En consultation", "Terminé"].map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={cx(
                "rounded-lg px-2.5 py-1 font-bold transition duration-200 cursor-pointer",
                isActive
                  ? "bg-blue-50 text-[#2563EB] ring-1 ring-blue-100"
                  : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 space-y-3 before:absolute before:bottom-8 before:left-[4.28rem] before:top-8 before:w-px before:bg-gradient-to-b before:from-blue-100 before:via-teal-100 before:to-transparent max-sm:before:hidden 2xl:mt-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div
              key={`${appointment.time}-${appointment.patient}`}
              className="relative flex flex-wrap items-center gap-3 rounded-2xl border border-transparent bg-slate-50/80 p-3 transition hover:border-[#E2E8F0] hover:bg-white hover:shadow-md"
            >
              <time className="w-12 shrink-0 text-sm font-bold text-[#0F172A]">
                {appointment.time}
              </time>
              <span
                className={cx(
                  "z-10 h-3 w-3 shrink-0 rounded-full ring-4 ring-white",
                  appointment.tone === "blue" && "bg-[#2563EB]",
                  appointment.tone === "orange" && "bg-[#F59E0B]",
                  appointment.tone === "purple" && "bg-[#7C3AED]",
                  appointment.tone === "green" && "bg-[#22C55E]",
                )}
                aria-hidden="true"
              />
              <Avatar name={appointment.patient} className="h-9 w-9 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0F172A]">
                  {appointment.patient}
                </p>
                <p className="truncate text-sm font-medium text-[#64748B]">
                  {appointment.treatment}
                </p>
              </div>
              <Badge label={appointment.status} tone={appointment.tone} />
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm font-semibold text-[#64748B]">
            Aucun rendez-vous trouvé.
          </div>
        )}
      </div>

      <Link
        href="/rendez-vous"
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] transition hover:text-[#115E59]"
      >
        Voir tout le planning
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function WaitingRoomPanel() {
  const router = useRouter();
  const [roomList, setRoomList] = useState([
    {
      number: 1,
      patientId: "P-000126",
      patient: "Sara Khaldi",
      time: "09:30",
      treatment: "Consultation",
      status: "En attente",
      tone: "orange",
      timer: "00:15",
      action: "Appeler",
      price: 2000,
    },
    {
      number: 2,
      patientId: "P-000127",
      patient: "Mohamed Amrani",
      time: "10:00",
      treatment: "Extraction",
      status: "Prochain",
      tone: "teal",
      timer: "00:00",
      action: "Commencer",
      price: 8000,
    },
    {
      number: 3,
      patientId: "P-000128",
      patient: "Lina Cherif",
      time: "11:00",
      treatment: "Orthodontie",
      status: "En attente",
      tone: "orange",
      timer: "00:00",
      action: "Appeler",
      price: 80000,
    },
  ]);

  const handleAction = (item: typeof roomList[0]) => {
    if (item.action === "Appeler") {
      setRoomList((prev) =>
        prev.map((p) =>
          p.patientId === item.patientId
            ? { ...p, status: "Prochain", tone: "teal", action: "Commencer" }
            : p
        )
      );
    } else if (item.action === "Commencer") {
      setRoomList((prev) =>
        prev.map((p) =>
          p.patientId === item.patientId
            ? { ...p, status: "En consultation", tone: "purple", action: "Terminer" }
            : p
        )
      );
    } else if (item.action === "Terminer") {
      router.push(
        `/paiements/nouveau?patientId=${item.patientId}&patientName=${encodeURIComponent(
          item.patient
        )}&treatment=${encodeURIComponent(item.treatment)}&price=${item.price}`
      );
    }
  };

  const handleResetList = () => {
    setRoomList([
      {
        number: 1,
        patientId: "P-000126",
        patient: "Sara Khaldi",
        time: "09:30",
        treatment: "Consultation",
        status: "En attente",
        tone: "orange",
        timer: "00:15",
        action: "Appeler",
        price: 2000,
      },
      {
        number: 2,
        patientId: "P-000127",
        patient: "Mohamed Amrani",
        time: "10:00",
        treatment: "Extraction",
        status: "Prochain",
        tone: "teal",
        timer: "00:00",
        action: "Commencer",
        price: 8000,
      },
      {
        number: 3,
        patientId: "P-000128",
        patient: "Lina Cherif",
        time: "11:00",
        treatment: "Orthodontie",
        status: "En attente",
        tone: "orange",
        timer: "00:00",
        action: "Appeler",
        price: 80000,
      },
    ]);
  };

  return (
    <article className={panelClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Salle d’attente
            </h2>
            <p className="text-sm text-[#64748B]">Patients présents au cabinet</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleResetList}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
        >
          <RefreshCw className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Actualiser
        </button>
      </div>

      <div className="mt-4 space-y-3 2xl:mt-6">
        {roomList.map((item) => (
          <div
            key={item.patient}
            className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/10 2xl:p-4"
          >
            <div className="flex flex-wrap items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-sm font-bold text-white">
                {item.number}
              </span>
              <Avatar name={item.patient} className="h-10 w-10 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0F172A]">
                  {item.patient}
                </p>
                <p className="mt-1 text-sm font-medium text-[#64748B]">
                  {item.time} · {item.treatment}
                </p>
              </div>
              <Badge label={item.status} tone={item.tone} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#64748B]">Temps d’attente</p>
                <p className="text-lg font-bold text-[#0F172A]">{item.timer}</p>
              </div>
              <button
                type="button"
                onClick={() => handleAction(item)}
                className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold text-white shadow-lg transition duration-200 cursor-pointer ${
                  item.action === "Appeler"
                    ? "bg-[#0F766E] shadow-teal-700/20 hover:bg-[#115E59]"
                    : item.action === "Commencer"
                      ? "bg-[#2563EB] shadow-blue-700/20 hover:bg-blue-700"
                      : "bg-[#7C3AED] shadow-violet-700/20 hover:bg-[#6D28D9]"
                }`}
              >
                {item.action === "Terminer" ? "Terminer (Payer)" : item.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] transition hover:text-[#115E59]"
      >
        Voir tous les patients en attente
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}

function DataTable({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: IconComponent;
  children: React.ReactNode;
}) {
  return (
    <article className={panelClass}>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#0F172A]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </article>
  );
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = recentPatients.filter((p) =>
    p.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = recentPayments.filter((p) =>
    p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.treatment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <QuickActions />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)] 2xl:gap-6 2xl:grid-cols-[minmax(0,1.16fr)_minmax(380px,0.84fr)]">
        <AppointmentPanel />
        <WaitingRoomPanel />
      </section>

      <DashboardCharts />

      {/* Local search bar for tables */}
      <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E]">
              <Search className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-[#0F172A]">Filtrer les listes récentes</span>
          </div>
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Rechercher</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Rechercher patient ou acte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-4 text-xs font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E]"
            />
          </label>
        </div>
      </article>

      <section className="grid gap-4 2xl:grid-cols-2 2xl:gap-6" aria-label="Tables récentes">
        <DataTable title="Patients récents" icon={Users}>
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs font-bold text-[#64748B]">
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Patient</th>
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Téléphone</th>
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">
                  Dernière visite
                </th>
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Prochain RDV</th>
                <th className="border-b border-[#E2E8F0] pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((row) => (
                  <tr key={row.patient} className="group">
                    <td className="border-b border-slate-100 py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.patient} className="h-9 w-9 text-xs" />
                        <span className="font-bold text-[#0F172A]">{row.patient}</span>
                      </div>
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">
                      {row.phone}
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">
                      {row.lastVisit}
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">
                      {row.nextVisit}
                    </td>
                    <td className="border-b border-slate-100 py-4">
                      <Badge label={row.status} tone={row.tone} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm font-semibold text-[#64748B]">
                    Aucun patient trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DataTable>

        <DataTable title="Paiements récents" icon={ReceiptText}>
          <table className="w-full min-w-[650px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs font-bold text-[#64748B]">
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Patient</th>
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Traitement</th>
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Montant</th>
                <th className="border-b border-[#E2E8F0] pb-3 pr-4">Méthode</th>
                <th className="border-b border-[#E2E8F0] pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((row) => (
                  <tr key={`${row.patient}-${row.treatment}`}>
                    <td className="border-b border-slate-100 py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.patient} className="h-9 w-9 text-xs" />
                        <span className="font-bold text-[#0F172A]">{row.patient}</span>
                      </div>
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">
                      {row.treatment}
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-bold text-[#0F172A]">
                      {row.amount}
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">
                      {row.method}
                    </td>
                    <td className="border-b border-slate-100 py-4">
                      <Badge label={row.status} tone={row.tone} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm font-semibold text-[#64748B]">
                    Aucun paiement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DataTable>
      </section>
    </>
  );
}
