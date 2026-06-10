"use client";

import type { ComponentType, SVGProps } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  CreditCard,
  Download,
  LineChart,
  PieChart,
  Printer,
  ReceiptText,
  Stethoscope,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Stat = {
  title: string;
  value: string;
  label: string;
  icon: IconComponent;
  accent: string;
};

const stats: Stat[] = [
  {
    title: "Chiffre d'affaires",
    value: "1.24M DA",
    label: "+14% vs mois dernier",
    icon: Wallet,
    accent: "from-[#0F766E] to-[#2DD4BF]",
  },
  {
    title: "Rendez-vous",
    value: "342",
    label: "89% confirmés",
    icon: CalendarDays,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    title: "Nouveaux patients",
    value: "58",
    label: "+9 cette semaine",
    icon: Users,
    accent: "from-[#7C3AED] to-[#A78BFA]",
  },
  {
    title: "Paiements reçus",
    value: "420k DA",
    label: "156 transactions",
    icon: CreditCard,
    accent: "from-[#06B6D4] to-[#67E8F9]",
  },
];

const revenueMonths = [
  { label: "Jan", value: 42 },
  { label: "Fév", value: 55 },
  { label: "Mar", value: 48 },
  { label: "Avr", value: 64 },
  { label: "Mai", value: 72 },
  { label: "Juin", value: 86 },
];

const appointmentStats = [
  { label: "Confirmés", value: 214, color: "bg-[#22C55E]", text: "text-green-700" },
  { label: "En attente", value: 76, color: "bg-[#F59E0B]", text: "text-orange-700" },
  { label: "Annulés", value: 31, color: "bg-[#EF4444]", text: "text-red-700" },
  { label: "Terminés", value: 21, color: "bg-[#2563EB]", text: "text-blue-700" },
];

const treatmentBreakdown = [
  { name: "Détartrage", count: 48, percent: "28%", color: "bg-[#0F766E]" },
  { name: "Consultation", count: 42, percent: "24%", color: "bg-[#2563EB]" },
  { name: "Extraction", count: 31, percent: "18%", color: "bg-[#F59E0B]" },
  { name: "Couronne", count: 26, percent: "15%", color: "bg-[#7C3AED]" },
  { name: "Implant", count: 18, percent: "10%", color: "bg-[#06B6D4]" },
];

const dentistPerformance = [
  { name: "Dr Benali", role: "Chirurgie & prothèse", patients: 124, revenue: "680.000 DA", rate: "96%", score: 92 },
  { name: "Dr Cherif", role: "Soins conservateurs", patients: 108, revenue: "510.000 DA", rate: "91%", score: 84 },
  { name: "Dr Amrani", role: "Orthodontie", patients: 72, revenue: "345.000 DA", rate: "88%", score: 76 },
];

const reportDownloads = [
  { title: "Rapport financier mensuel", detail: "Revenus, paiements et restes à encaisser", icon: ReceiptText },
  { title: "Activité rendez-vous", detail: "Taux de confirmation et annulations", icon: CalendarDays },
  { title: "Performance praticiens", detail: "Patients, actes et chiffre d'affaires", icon: UserRound },
  { title: "Traitements populaires", detail: "Volume, prix moyen et fréquence", icon: Stethoscope },
];

const recentInsights = [
  { time: "10:30", title: "Paiements", detail: "Encaissement Cash de 18.000 DA", icon: CreditCard, color: "text-[#0F766E]", bg: "bg-teal-50" },
  { time: "09:45", title: "Rendez-vous", detail: "12 confirmations envoyées", icon: CalendarDays, color: "text-[#2563EB]", bg: "bg-blue-50" },
  { time: "08:50", title: "Traitements", detail: "Détartrage reste l'acte le plus fréquent", icon: Stethoscope, color: "text-[#F59E0B]", bg: "bg-orange-50" },
];

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.05)] 2xl:p-5";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PageActions() {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Exporter rapport
      </button>
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
      >
        <Printer className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
        Imprimer
      </button>
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:bg-blue-50"
      >
        Ce mois
        <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </button>
    </div>
  );
}

function StatCard({ title, value, label, icon: Icon, accent }: Stat) {
  return (
    <article className="group min-h-32 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
          <p className="mt-2 truncate text-xl font-bold text-[#0F172A] 2xl:text-3xl">{value}</p>
          <p className="mt-1 text-xs font-bold text-[#64748B]">{label}</p>
        </div>
        <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg 2xl:h-11 2xl:w-11", accent)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function RevenueChartCard() {
  return (
    <article className={panelClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Évolution du chiffre d&apos;affaires</h2>
          <p className="text-sm font-medium text-[#64748B]">Revenus encaissés sur les 6 derniers mois.</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          +14%
        </span>
      </div>
      <div className="mt-5 flex h-64 items-end gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
        {revenueMonths.map((month) => (
          <div key={month.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-48 w-full items-end rounded-xl bg-white px-1.5 py-2 shadow-inner">
              <div
                className="w-full rounded-lg bg-gradient-to-t from-[#0F766E] to-[#2DD4BF] shadow-lg shadow-teal-700/10"
                style={{ height: `${month.value}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#64748B]">{month.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function AppointmentStatusCard() {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Statuts des rendez-vous</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#22C55E_0_63%,#F59E0B_63%_85%,#EF4444_85%_94%,#2563EB_94%_100%)]">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <span className="text-lg font-bold text-[#0F172A]">342</span>
            <span className="text-[11px] font-bold text-[#64748B]">RDV</span>
          </div>
        </div>
        <dl className="space-y-3">
          {appointmentStats.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <dt className="flex items-center gap-2 font-semibold text-[#64748B]">
                <span className={cx("h-2.5 w-2.5 rounded-full", item.color)} />
                {item.label}
              </dt>
              <dd className={cx("font-bold", item.text)}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function TreatmentBreakdownCard() {
  const max = Math.max(...treatmentBreakdown.map((item) => item.count));

  return (
    <article className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#0F172A]">Traitements les plus réalisés</h2>
        <PieChart className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />
      </div>
      <div className="mt-4 space-y-4">
        {treatmentBreakdown.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="truncate font-bold text-[#0F172A]">{item.name}</p>
              <p className="shrink-0 font-bold text-[#64748B]">{item.count} ({item.percent})</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={cx("h-full rounded-full", item.color)} style={{ width: `${Math.round((item.count / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function DentistPerformanceCard() {
  return (
    <article className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Performance des praticiens</h2>
          <p className="text-sm font-medium text-[#64748B]">Patients, revenus et taux de présence.</p>
        </div>
        <LineChart className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
      </div>
      <div className="mt-4 space-y-3">
        {dentistPerformance.map((dentist) => (
          <div key={dentist.name} className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                {getInitials(dentist.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#0F172A]">{dentist.name}</p>
                <p className="truncate text-xs font-semibold text-[#64748B]">{dentist.role}</p>
              </div>
              <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                {dentist.rate}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p className="font-semibold text-[#64748B]">Patients<br /><span className="font-bold text-[#0F172A]">{dentist.patients}</span></p>
              <p className="font-semibold text-[#64748B]">Revenus<br /><span className="font-bold text-[#0F766E]">{dentist.revenue}</span></p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${dentist.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function DownloadsCard() {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Rapports téléchargeables</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {reportDownloads.map((report) => (
          <button
            key={report.title}
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#0F766E]/40 hover:bg-teal-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
              <report.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#0F172A]">{report.title}</span>
              <span className="block truncate text-xs font-semibold text-[#64748B]">{report.detail}</span>
            </span>
            <Download className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
          </button>
        ))}
      </div>
    </article>
  );
}

function InsightsCard() {
  return (
    <article className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#0F172A]">Activité récente</h2>
        <Activity className="h-5 w-5 text-[#06B6D4]" aria-hidden="true" />
      </div>
      <div className="mt-4 space-y-3">
        {recentInsights.map((item) => (
          <div key={`${item.time}-${item.title}`} className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
            <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", item.bg, item.color)}>
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#0F172A]">{item.title}</p>
              <p className="truncate text-xs font-semibold text-[#64748B]">{item.detail}</p>
            </div>
            <span className="text-xs font-bold text-[#64748B]">{item.time}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function SummaryStrip() {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Taux d'occupation", "82%", Clock3, "text-[#0F766E]", "bg-teal-50"],
          ["Panier moyen", "12.800 DA", ReceiptText, "text-[#2563EB]", "bg-blue-50"],
          ["Croissance patients", "+11%", ArrowUpRight, "text-[#22C55E]", "bg-green-50"],
        ].map(([label, value, Icon, color, bg]) => {
          const ItemIcon = Icon as IconComponent;
          return (
            <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
              <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", color as string, bg as string)}>
                <ItemIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-[#64748B]">{label as string}</p>
                <p className="text-lg font-bold text-[#0F172A]">{value as string}</p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function RapportsPage() {
  return (
    <section className="space-y-5">
      <div className="flex justify-end">
        <PageActions />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques rapports">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <SummaryStrip />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-5">
          <RevenueChartCard />
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            <TreatmentBreakdownCard />
            <DentistPerformanceCard />
          </div>
        </section>
        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          <AppointmentStatusCard />
          <DownloadsCard />
          <InsightsCard />
        </aside>
      </div>
    </section>
  );
}
