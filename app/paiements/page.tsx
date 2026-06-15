"use client";

import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeftRight,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  FilePlus,
  Landmark,
  MessageCircle,
  MoreVertical,
  Plus,
  Printer,
  Search,
  Smartphone,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type PaymentStatus = "Payé" | "Partiel" | "Impayé" | "En retard" | "Annulé";
type PaymentMethod = "Cash" | "BaridiMob" | "CCP" | "Virement" | "Carte bancaire" | "—";

type Payment = {
  id: string;
  invoice: string;
  patient: string;
  phone: string;
  treatment: string;
  total: number;
  paid: number;
  remaining: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  dentist: string;
};

type Stat = {
  title: string;
  value: string;
  label: string;
  icon: IconComponent;
  accent: string;
};

const stats: Stat[] = [
  {
    title: "Revenus du mois",
    value: "420.000 DA",
    label: "+12% vs mois dernier",
    icon: Wallet,
    accent: "from-[#0F766E] to-[#2DD4BF]",
  },
  {
    title: "Paiements reçus",
    value: "156",
    label: "Ce mois",
    icon: CreditCard,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    title: "Soldes impayés",
    value: "175.000 DA",
    label: "23 patients",
    icon: AlertCircle,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
  {
    title: "Factures payées",
    value: "89",
    label: "72% des factures",
    icon: CheckCircle2,
    accent: "from-[#22C55E] to-[#86EFAC]",
  },
];

const payments: Payment[] = [
  {
    id: "PAY-001",
    invoice: "FAC-2026-001",
    patient: "Sara Khaldi",
    phone: "0661 10 20 30",
    treatment: "Consultation + Détartrage",
    total: 6000,
    paid: 6000,
    remaining: 0,
    method: "Cash",
    status: "Payé",
    date: "10 Juin 2026",
    dentist: "Dr Cherif",
  },
  {
    id: "PAY-002",
    invoice: "FAC-2026-002",
    patient: "Ahmed Benali",
    phone: "0770 20 30 40",
    treatment: "Traitement canalaire",
    total: 25000,
    paid: 10000,
    remaining: 15000,
    method: "BaridiMob",
    status: "Partiel",
    date: "09 Juin 2026",
    dentist: "Dr Benali",
  },
  {
    id: "PAY-003",
    invoice: "FAC-2026-003",
    patient: "Mohamed Amrani",
    phone: "0550 33 44 55",
    treatment: "Extraction",
    total: 8000,
    paid: 0,
    remaining: 8000,
    method: "—",
    status: "Impayé",
    date: "08 Juin 2026",
    dentist: "Dr Cherif",
  },
  {
    id: "PAY-004",
    invoice: "FAC-2026-004",
    patient: "Lina Cherif",
    phone: "0555 66 77 88",
    treatment: "Orthodontie",
    total: 80000,
    paid: 30000,
    remaining: 50000,
    method: "CCP",
    status: "Partiel",
    date: "07 Juin 2026",
    dentist: "Dr Benali",
  },
  {
    id: "PAY-005",
    invoice: "FAC-2026-005",
    patient: "Yacine Saadi",
    phone: "0777 44 55 66",
    treatment: "Couronne céramique",
    total: 18000,
    paid: 18000,
    remaining: 0,
    method: "Cash",
    status: "Payé",
    date: "06 Juin 2026",
    dentist: "Dr Benali",
  },
  {
    id: "PAY-006",
    invoice: "FAC-2026-006",
    patient: "Nadia Boudiaf",
    phone: "0560 12 34 56",
    treatment: "Blanchiment",
    total: 8000,
    paid: 0,
    remaining: 8000,
    method: "—",
    status: "En retard",
    date: "05 Juin 2026",
    dentist: "Dr Cherif",
  },
  {
    id: "PAY-007",
    invoice: "FAC-2026-007",
    patient: "Rachid Hassaine",
    phone: "0799 11 22 33",
    treatment: "Implant dentaire",
    total: 60000,
    paid: 20000,
    remaining: 40000,
    method: "Virement",
    status: "Partiel",
    date: "04 Juin 2026",
    dentist: "Dr Benali",
  },
];

const financialSummary = [
  { label: "Total facturé", value: "595.000 DA", color: "text-[#0F766E]", dot: "bg-[#0F766E]" },
  { label: "Total encaissé", value: "420.000 DA", color: "text-[#2563EB]", dot: "bg-[#2563EB]" },
  { label: "Reste à encaisser", value: "175.000 DA", color: "text-[#F59E0B]", dot: "bg-[#F59E0B]" },
  { label: "Remises accordées", value: "35.000 DA", color: "text-[#EF4444]", dot: "bg-[#EF4444]" },
];

const recentTransactions = [
  {
    time: "10:30",
    patient: "Sara Khaldi",
    description: "Paiement complet",
    amount: "6.000 DA",
    method: "Cash",
    status: "Reçu imprimé",
  },
  {
    time: "09:45",
    patient: "Ahmed Benali",
    description: "Acompte",
    amount: "10.000 DA",
    method: "BaridiMob",
    status: "Partiel",
  },
  {
    time: "08:50",
    patient: "Lina Cherif",
    description: "Acompte",
    amount: "30.000 DA",
    method: "CCP",
    status: "Acompte",
  },
];

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.05)] 2xl:p-5";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDA(amount: number) {
  return `${new Intl.NumberFormat("fr-DZ").format(amount).replace(/\s/g, ".")} DA`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProgress(payment: Payment) {
  return Math.round((payment.paid / payment.total) * 100);
}

function getStatusClasses(status: PaymentStatus) {
  const classes: Record<PaymentStatus, string> = {
    Payé: "border-green-200 bg-green-50 text-green-700",
    Partiel: "border-blue-200 bg-blue-50 text-blue-700",
    Impayé: "border-orange-200 bg-orange-50 text-orange-700",
    "En retard": "border-red-200 bg-red-50 text-red-700",
    Annulé: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return classes[status];
}

function getMethodClasses(method: PaymentMethod) {
  const classes: Record<PaymentMethod, string> = {
    Cash: "bg-green-50 text-green-700",
    BaridiMob: "bg-indigo-50 text-indigo-700",
    CCP: "bg-blue-50 text-blue-700",
    Virement: "bg-slate-100 text-slate-700",
    "Carte bancaire": "bg-teal-50 text-teal-700",
    "—": "bg-slate-50 text-slate-400",
  };

  return classes[method];
}

function MethodIcon({ method }: { method: PaymentMethod }) {
  const className = "h-3.5 w-3.5";

  switch (method) {
    case "Cash":
      return <Banknote className={className} aria-hidden="true" />;
    case "BaridiMob":
      return <Smartphone className={className} aria-hidden="true" />;
    case "CCP":
      return <Landmark className={className} aria-hidden="true" />;
    case "Virement":
      return <ArrowLeftRight className={className} aria-hidden="true" />;
    case "Carte bancaire":
      return <CreditCard className={className} aria-hidden="true" />;
    case "—":
      return null;
  }
}

function getPaidAmountClasses(payment: Payment) {
  if (payment.paid === payment.total) return "text-green-700";
  if (payment.paid === 0) return "text-red-600";
  return "text-blue-700";
}

function getRemainingAmountClasses(payment: Payment) {
  if (payment.remaining === 0) return "text-[#0F172A]";
  if (payment.status === "En retard") return "text-red-600";
  return "text-orange-600";
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", getStatusClasses(status))}>
      {status}
    </span>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-md shadow-slate-900/10",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

function MethodBadge({ method }: { method: PaymentMethod }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", getMethodClasses(method))}>
      <MethodIcon method={method} />
      {method}
    </span>
  );
}

function PageActions() {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
      <Link
        href="/paiements/nouveau"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nouveau paiement
      </Link>
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
      >
        <FilePlus className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
        Créer facture
      </button>
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:bg-blue-50"
      >
        <Download className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
        Exporter
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

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="flex h-11 min-w-0 items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-left transition hover:border-[#0F766E]/40 hover:bg-teal-50"
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase text-[#64748B]">{label}</span>
        <span className="block truncate text-xs font-bold text-[#0F172A]">{value}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
    </button>
  );
}

function FiltersSection() {
  return (
    <div className="border-b border-[#E2E8F0] p-4 2xl:p-5">
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-[minmax(260px,1.5fr)_160px_170px_130px_170px]">
        <label className="relative block min-w-0 sm:col-span-2 2xl:col-span-1">
          <span className="sr-only">Rechercher</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher patient, facture, téléphone..."
            className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
          />
        </label>
        <FilterSelect label="Statut" value="Tous les statuts" />
        <FilterSelect label="Méthode" value="Toutes les méthodes" />
        <FilterSelect label="Période" value="Ce mois" />
        <FilterSelect label="Dentiste" value="Tous les dentistes" />
      </div>
      <div className="mt-3 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {["Tous", "Payé", "Partiel", "Impayé", "En retard"].map((chip, index) => (
            <button
              key={chip}
              type="button"
              className={cx(
                "inline-flex h-9 items-center justify-center rounded-lg border px-3 text-sm font-bold transition",
                index === 0
                  ? "border-[#0F766E] bg-[#0F766E] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              {chip}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Calendar className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
            Aujourd’hui
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentsTable({
  selectedPayment,
  onSelectPayment,
}: {
  selectedPayment: Payment;
  onSelectPayment: (payment: Payment) => void;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-xs font-bold text-[#64748B]">
            {["Facture", "Patient", "Traitement", "Montant total", "Payé", "Reste", "Méthode", "Statut", "Date", "Actions"].map((head) => (
              <th key={head} className="border-b border-[#E2E8F0] px-3 py-3">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const selected = payment.id === selectedPayment.id;

            return (
              <tr
                key={payment.id}
                onClick={() => onSelectPayment(payment)}
                className={cx(
                  "cursor-pointer transition hover:bg-slate-50/70",
                  selected && "bg-teal-50/50 shadow-[inset_3px_0_0_#0F766E]",
                )}
              >
                <td className="border-b border-slate-100 px-3 py-3">
                  <button type="button" className="font-bold text-[#2563EB] hover:underline">
                    {payment.invoice}
                  </button>
                </td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={payment.patient} className="h-9 w-9 text-xs" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#0F172A]">{payment.patient}</p>
                      <p className="text-xs font-medium text-[#64748B]">{payment.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[170px] border-b border-slate-100 px-3 py-3 font-semibold text-[#0F172A]">
                  <span className="line-clamp-2">{payment.treatment}</span>
                </td>
                <td className="border-b border-slate-100 px-3 py-3 font-bold text-[#0F172A]">{formatDA(payment.total)}</td>
                <td className={cx("border-b border-slate-100 px-3 py-3 font-bold", getPaidAmountClasses(payment))}>{formatDA(payment.paid)}</td>
                <td className={cx("border-b border-slate-100 px-3 py-3 font-bold", getRemainingAmountClasses(payment))}>{formatDA(payment.remaining)}</td>
                <td className="border-b border-slate-100 px-3 py-3"><MethodBadge method={payment.method} /></td>
                <td className="border-b border-slate-100 px-3 py-3"><StatusBadge status={payment.status} /></td>
                <td className="border-b border-slate-100 px-3 py-3 font-medium text-[#64748B]">{payment.date}</td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]"
                      aria-label={`Voir ${payment.invoice}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]"
                      aria-label={`Plus d’actions ${payment.invoice}`}
                    >
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PaymentMobileCard({
  payment,
  selected,
  onSelect,
}: {
  payment: Payment;
  selected: boolean;
  onSelect: (payment: Payment) => void;
}) {
  return (
    <article
      className={cx(
        "rounded-xl border bg-white p-4 transition hover:border-[#0F766E]/40",
        selected ? "border-[#0F766E] bg-teal-50/30" : "border-[#E2E8F0]",
      )}
      onClick={() => onSelect(payment)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <button type="button" className="text-sm font-bold text-[#2563EB]">{payment.invoice}</button>
          <h3 className="mt-1 font-bold text-[#0F172A]">{payment.patient}</h3>
          <p className="text-xs font-semibold text-[#64748B]">{payment.phone}</p>
        </div>
        <StatusBadge status={payment.status} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[#0F172A]">{payment.treatment}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
        <p className="font-semibold text-[#64748B]">Total<br /><span className="font-bold text-[#0F172A]">{formatDA(payment.total)}</span></p>
        <p className="font-semibold text-[#64748B]">Payé<br /><span className={cx("font-bold", getPaidAmountClasses(payment))}>{formatDA(payment.paid)}</span></p>
        <p className="font-semibold text-[#64748B]">Reste<br /><span className={cx("font-bold", getRemainingAmountClasses(payment))}>{formatDA(payment.remaining)}</span></p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <MethodBadge method={payment.method} />
        <span className="text-xs font-bold text-[#64748B]">{payment.date}</span>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_1fr_40px] gap-2">
        <button type="button" className="h-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0F172A]">Voir</button>
        <button type="button" className="h-10 rounded-xl bg-[#0F766E] text-sm font-bold text-white">Ajouter paiement</button>
        <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#64748B]" aria-label={`Plus d’actions ${payment.invoice}`}>
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function Pagination() {
  const pages: Array<
    | { type: "previous"; icon: typeof ChevronLeft }
    | { type: "next"; icon: typeof ChevronRight }
    | { type: "page"; label: string; active?: boolean }
  > = [
    { type: "previous", icon: ChevronLeft },
    { type: "page", label: "1", active: true },
    { type: "page", label: "2" },
    { type: "page", label: "3" },
    { type: "page", label: "..." },
    { type: "page", label: "8" },
    { type: "next", icon: ChevronRight },
  ];

  return (
    <footer className="grid gap-3 border-t border-[#E2E8F0] px-4 py-4 2xl:grid-cols-[1fr_auto_auto] 2xl:items-center 2xl:justify-between">
      <p className="text-sm font-semibold text-[#64748B] 2xl:whitespace-nowrap">Affichage 1 - 7 sur 56 paiements</p>
      <div className="flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2">
        {pages.map((item, index) => {
          const active = item.type === "page" && item.active;

          return (
            <button
              key={`${item.type}-${index}`}
              type="button"
              className={cx(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition",
                active
                  ? "border-[#0F766E] bg-[#0F766E] text-white"
                  : "border-slate-200 bg-white text-[#64748B] hover:bg-slate-50",
              )}
              aria-label={item.type !== "page" ? (item.type === "previous" ? "Page précédente" : "Page suivante") : undefined}
            >
              {item.type === "page" ? (
                item.label
              ) : (
                <item.icon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
      <button type="button" className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-[#0F172A]">
        10 par page
        <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </button>
    </footer>
  );
}

function PaymentsCard({
  selectedPayment,
  onSelectPayment,
}: {
  selectedPayment: Payment;
  onSelectPayment: (payment: Payment) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <FiltersSection />
      <PaymentsTable selectedPayment={selectedPayment} onSelectPayment={onSelectPayment} />
      <div className="grid gap-3 p-4 md:hidden">
        {payments.map((payment) => (
          <PaymentMobileCard
            key={payment.id}
            payment={payment}
            selected={payment.id === selectedPayment.id}
            onSelect={onSelectPayment}
          />
        ))}
      </div>
      <Pagination />
    </article>
  );
}

function PaymentDetailsPanel({ payment }: { payment: Payment }) {
  const progress = getProgress(payment);

  return (
    <aside className={cx(panelClass, "xl:sticky xl:top-4 xl:self-start")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#64748B]">Détails du paiement</p>
          <h2 className="mt-2 text-xl font-bold text-[#0F172A]">{payment.invoice}</h2>
        </div>
        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50" aria-label="Fermer">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3">
        <StatusBadge status={payment.status} />
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
        <Avatar name={payment.patient} />
        <div className="min-w-0">
          <p className="truncate font-bold text-[#0F172A]">{payment.patient}</p>
          <p className="truncate text-sm font-semibold text-[#64748B]">{payment.treatment}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3">
        {[
          ["Montant total", formatDA(payment.total), "text-[#0F172A]"],
          ["Payé", formatDA(payment.paid), getPaidAmountClasses(payment)],
          ["Reste à payer", formatDA(payment.remaining), getRemainingAmountClasses(payment)],
          ["Statut", payment.status, "text-[#0F172A]"],
          ["Méthode", payment.method, "text-[#0F172A]"],
          ["Date", payment.date, "text-[#0F172A]"],
          ["Dentiste", payment.dentist, "text-[#0F172A]"],
        ].map(([label, value, color]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="font-semibold text-[#64748B]">{label}</dt>
            <dd className={cx("text-right font-bold", color)}>{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-5 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
        <div className="flex items-center justify-between gap-3 text-sm font-bold">
          <span className="text-[#0F172A]">{progress}% payé</span>
          <span className="text-[#64748B]">{formatDA(payment.paid)} / {formatDA(payment.total)}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="mt-5">
        <h3 className="text-base font-bold text-[#0F172A]">Historique des paiements</h3>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#0F172A]">09 Juin 2026</p>
            <p className="text-xs font-semibold text-[#64748B]">{payment.method}</p>
          </div>
          <p className="text-sm font-bold text-[#2563EB]">{formatDA(payment.paid)}</p>
        </div>
      </section>

      <div className="mt-5 grid gap-2">
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter paiement
        </button>
        {[
          ["Imprimer reçu", Printer, "text-[#0F766E]"],
          ["Télécharger facture", Download, "text-[#2563EB]"],
          ["Envoyer rappel WhatsApp", MessageCircle, "text-green-700"],
        ].map(([label, Icon, color]) => {
          const ActionIcon = Icon as IconComponent;
          return (
            <button key={label as string} type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
              <ActionIcon className={cx("h-4 w-4", color as string)} aria-hidden="true" />
              {label as string}
            </button>
          );
        })}
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition hover:bg-red-50">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Annuler facture
        </button>
      </div>
    </aside>
  );
}

function FinancialSummaryCard() {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Résumé financier</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#0F766E_0_45%,#2563EB_45%_75%,#F59E0B_75%_92%,#EF4444_92%_100%)]">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <span className="text-lg font-bold text-[#0F172A]">595k</span>
            <span className="text-[11px] font-bold text-[#64748B]">DA</span>
          </div>
        </div>
        <dl className="space-y-3">
          {financialSummary.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <dt className="flex items-center gap-2 font-semibold text-[#64748B]">
                <span className={cx("h-2.5 w-2.5 rounded-full", item.dot)} />
                {item.label}
              </dt>
              <dd className={cx("font-bold", item.color)}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function RecentTransactionsCard() {
  return (
    <article className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#0F172A]">Dernières transactions</h2>
        <button type="button" className="text-sm font-bold text-[#0F766E]">Voir tout</button>
      </div>
      <div className="mt-4 space-y-3">
        {recentTransactions.map((transaction) => (
          <div key={`${transaction.time}-${transaction.patient}`} className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
            <span className="w-11 shrink-0 text-sm font-bold text-[#64748B]">{transaction.time}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#0F172A]">{transaction.patient}</p>
              <p className="truncate text-xs font-semibold text-[#64748B]">{transaction.description} · {transaction.method} · {transaction.status}</p>
            </div>
            <p className="text-sm font-bold text-[#0F766E]">{transaction.amount}</p>
          </div>
        ))}
      </div>
      <button type="button" className="mt-4 text-sm font-bold text-[#0F766E]">Voir toutes les transactions →</button>
    </article>
  );
}

export default function PaiementsPage() {
  const [selectedPayment, setSelectedPayment] = useState<Payment>(
    payments.find((payment) => payment.invoice === "FAC-2026-002") ?? payments[0],
  );

  return (
    <section className="space-y-5">
      <div className="flex justify-end">
        <PageActions />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques paiements">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-5">
          <PaymentsCard selectedPayment={selectedPayment} onSelectPayment={setSelectedPayment} />
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            <FinancialSummaryCard />
            <RecentTransactionsCard />
          </div>
        </section>
        <PaymentDetailsPanel payment={selectedPayment} />
      </div>
    </section>
  );
}
