"use client";

import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  ClipboardList,
  Download,
  Eye,
  MoreVertical,
  Pill,
  Plus,
  Printer,
  RefreshCcw,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type PrescriptionStatus = "Délivrée" | "En attente" | "Annulée";

type Prescription = {
  id: string;
  code: string;
  patient: string;
  phone: string;
  age: number;
  date: string;
  treatment: string;
  dentist: string;
  status: PrescriptionStatus;
  medicationCount: number;
};

type Medication = {
  id: string;
  name: string;
  type: string;
  instructions: string;
  quantity: number;
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
    title: "Ordonnances ce mois",
    value: "75",
    label: "+18% vs mois dernier",
    icon: ClipboardList,
    accent: "from-[#0F766E] to-[#2DD4BF]",
  },
  {
    title: "Médicaments prescrits",
    value: "142",
    label: "Ce mois",
    icon: Pill,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    title: "En attente",
    value: "12",
    label: "À délivrer",
    icon: Clock3,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
  {
    title: "Délivrées",
    value: "63",
    label: "84% du total",
    icon: CheckCircle2,
    accent: "from-[#22C55E] to-[#86EFAC]",
  },
];

const prescriptions: Prescription[] = [
  {
    id: "RX-001",
    code: "ORD-2026-001",
    patient: "Sara Khaldi",
    phone: "0661 10 20 30",
    age: 32,
    date: "10 Juin 2026",
    treatment: "Extraction dentaires",
    dentist: "Dr Benali",
    status: "Délivrée",
    medicationCount: 3,
  },
  {
    id: "RX-002",
    code: "ORD-2026-002",
    patient: "Ahmed Benali",
    phone: "0770 20 30 40",
    age: 41,
    date: "09 Juin 2026",
    treatment: "Traitement canalaire",
    dentist: "Dr Benali",
    status: "En attente",
    medicationCount: 4,
  },
  {
    id: "RX-003",
    code: "ORD-2026-003",
    patient: "Lina Cherif",
    phone: "0555 66 77 88",
    age: 19,
    date: "09 Juin 2026",
    treatment: "Orthodontie",
    dentist: "Dr Cherif",
    status: "Délivrée",
    medicationCount: 2,
  },
  {
    id: "RX-004",
    code: "ORD-2026-004",
    patient: "Yacine Saadi",
    phone: "0777 44 55 66",
    age: 36,
    date: "08 Juin 2026",
    treatment: "Détartrage",
    dentist: "Dr Cherif",
    status: "Délivrée",
    medicationCount: 2,
  },
  {
    id: "RX-005",
    code: "ORD-2026-005",
    patient: "Nadia Boudiaf",
    phone: "0560 12 34 56",
    age: 28,
    date: "07 Juin 2026",
    treatment: "Blanchiment",
    dentist: "Dr Benali",
    status: "Annulée",
    medicationCount: 1,
  },
  {
    id: "RX-006",
    code: "ORD-2026-006",
    patient: "Mohamed Amrani",
    phone: "0550 33 44 55",
    age: 47,
    date: "06 Juin 2026",
    treatment: "Couronne céramique",
    dentist: "Dr Cherif",
    status: "En attente",
    medicationCount: 3,
  },
  {
    id: "RX-007",
    code: "ORD-2026-007",
    patient: "Rachid Hassaine",
    phone: "0799 11 22 33",
    age: 52,
    date: "05 Juin 2026",
    treatment: "Implant dentaire",
    dentist: "Dr Benali",
    status: "Délivrée",
    medicationCount: 5,
  },
];

const medications: Medication[] = [
  {
    id: "MED-001",
    name: "Amoxicilline 500mg",
    type: "Capsule",
    instructions: "1 capsule toutes les 8h pendant 7 jours",
    quantity: 21,
  },
  {
    id: "MED-002",
    name: "Ibuprofène 400mg",
    type: "Comprimé",
    instructions: "1 comprimé toutes les 12h après repas",
    quantity: 14,
  },
  {
    id: "MED-003",
    name: "Chlorhexidine 0.12%",
    type: "Bain de bouche",
    instructions: "15 ml, 2 fois par jour après brossage",
    quantity: 1,
  },
];

const mostPrescribedMedications = [
  { name: "Amoxicilline 500mg", count: 28, percent: "19.7%", color: "bg-[#0F766E]" },
  { name: "Ibuprofène 400mg", count: 24, percent: "16.9%", color: "bg-[#2563EB]" },
  { name: "Paracétamol 1g", count: 20, percent: "14.1%", color: "bg-[#F59E0B]" },
  { name: "Métronidazole 500mg", count: 15, percent: "10.6%", color: "bg-[#7C3AED]" },
  { name: "Chlorhexidine 0.12%", count: 12, percent: "8.5%", color: "bg-[#22C55E]" },
];

const statusAnalytics = [
  { label: "Délivrées", value: "63", percent: "84%", dot: "bg-[#22C55E]", text: "text-green-700" },
  { label: "En attente", value: "12", percent: "16%", dot: "bg-[#F59E0B]", text: "text-orange-700" },
  { label: "Annulées", value: "0", percent: "0%", dot: "bg-[#EF4444]", text: "text-red-700" },
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

function getStatusClasses(status: PrescriptionStatus) {
  const classes: Record<PrescriptionStatus, string> = {
    Délivrée: "border-green-200 bg-green-50 text-green-700",
    "En attente": "border-orange-200 bg-orange-50 text-orange-700",
    Annulée: "border-red-200 bg-red-50 text-red-700",
  };

  return classes[status];
}

function getMedicationBadgeClasses(index: number) {
  const classes = [
    "bg-green-50 text-green-700",
    "bg-blue-50 text-blue-700",
    "bg-rose-50 text-rose-700",
  ];

  return classes[index] ?? "bg-slate-100 text-slate-700";
}

function getProgressWidth(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

function StatusBadge({ status }: { status: PrescriptionStatus }) {
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

function PageActions() {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nouvelle ordonnance
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
          <p className="mt-2 truncate text-2xl font-bold text-[#0F172A] 2xl:text-3xl">{value}</p>
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
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-[minmax(260px,1.4fr)_170px_150px_180px_auto]">
        <label className="relative block min-w-0 sm:col-span-2 2xl:col-span-1">
          <span className="sr-only">Rechercher une ordonnance</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher une ordonnance..."
            className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
          />
        </label>
        <FilterSelect label="Statut" value="Tous les statuts" />
        <FilterSelect label="Date" value="Ce mois" />
        <FilterSelect label="Dentiste" value="Tous les dentistes" />
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
        >
          <RefreshCcw className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Réinitialiser
        </button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {["Tous", "En attente", "Délivrée", "Annulée"].map((chip, index) => (
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

function OrdonnancesTable({
  selectedPrescription,
  onSelectPrescription,
}: {
  selectedPrescription: Prescription;
  onSelectPrescription: (prescription: Prescription) => void;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[840px] border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-xs font-bold text-[#64748B]">
            {["Ordonnance", "Patient", "Date", "Traitement", "Statut", "Médicaments", "Actions"].map((head) => (
              <th key={head} className="border-b border-[#E2E8F0] px-3 py-3">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => {
            const selected = prescription.id === selectedPrescription.id;

            return (
              <tr
                key={prescription.id}
                onClick={() => onSelectPrescription(prescription)}
                className={cx(
                  "cursor-pointer transition hover:bg-slate-50/70",
                  selected && "bg-teal-50/50 shadow-[inset_3px_0_0_#0F766E]",
                )}
              >
                <td className="border-b border-slate-100 px-3 py-3">
                  <button type="button" className="font-bold text-[#2563EB] hover:underline">
                    {prescription.code}
                  </button>
                </td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={prescription.patient} className="h-9 w-9 text-xs" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#0F172A]">{prescription.patient}</p>
                      <p className="text-xs font-medium text-[#64748B]">{prescription.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-3 py-3 font-semibold text-[#64748B]">{prescription.date}</td>
                <td className="max-w-[190px] border-b border-slate-100 px-3 py-3 font-semibold text-[#0F172A]">
                  <span className="line-clamp-2">{prescription.treatment}</span>
                </td>
                <td className="border-b border-slate-100 px-3 py-3"><StatusBadge status={prescription.status} /></td>
                <td className="border-b border-slate-100 px-3 py-3 font-bold text-[#0F172A]">
                  {prescription.medicationCount} médicament{prescription.medicationCount > 1 ? "s" : ""}
                </td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]" aria-label={`Voir ${prescription.code}`}>
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]" aria-label={`Imprimer ${prescription.code}`}>
                      <Printer className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]" aria-label={`Plus d’actions ${prescription.code}`}>
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

function OrdonnanceMobileCard({
  prescription,
  selected,
  onSelect,
}: {
  prescription: Prescription;
  selected: boolean;
  onSelect: (prescription: Prescription) => void;
}) {
  return (
    <article
      className={cx(
        "rounded-xl border bg-white p-4 transition hover:border-[#0F766E]/40",
        selected ? "border-[#0F766E] bg-teal-50/30" : "border-[#E2E8F0]",
      )}
      onClick={() => onSelect(prescription)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <button type="button" className="text-sm font-bold text-[#2563EB]">{prescription.code}</button>
          <h3 className="mt-1 font-bold text-[#0F172A]">{prescription.patient}</h3>
          <p className="text-xs font-semibold text-[#64748B]">{prescription.phone}</p>
        </div>
        <StatusBadge status={prescription.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
        <p className="font-semibold text-[#64748B]">Traitement<br /><span className="font-bold text-[#0F172A]">{prescription.treatment}</span></p>
        <p className="font-semibold text-[#64748B]">Date<br /><span className="font-bold text-[#0F172A]">{prescription.date}</span></p>
        <p className="col-span-2 font-semibold text-[#64748B]">Médicaments<br /><span className="font-bold text-[#0F172A]">{prescription.medicationCount} médicament{prescription.medicationCount > 1 ? "s" : ""}</span></p>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_1fr_40px] gap-2">
        <button type="button" className="h-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0F172A]">Voir</button>
        <button type="button" className="h-10 rounded-xl bg-[#0F766E] text-sm font-bold text-white">Imprimer</button>
        <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#64748B]" aria-label={`Plus d’actions ${prescription.code}`}>
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
      <p className="text-sm font-semibold text-[#64748B] 2xl:whitespace-nowrap">Affichage 1 - 7 sur 75 ordonnances</p>
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
              {item.type === "page" ? item.label : <item.icon className="h-4 w-4" aria-hidden="true" />}
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

function OrdonnancesCard({
  selectedPrescription,
  onSelectPrescription,
}: {
  selectedPrescription: Prescription;
  onSelectPrescription: (prescription: Prescription) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <FiltersSection />
      <OrdonnancesTable selectedPrescription={selectedPrescription} onSelectPrescription={onSelectPrescription} />
      <div className="grid gap-3 p-4 md:hidden">
        {prescriptions.map((prescription) => (
          <OrdonnanceMobileCard
            key={prescription.id}
            prescription={prescription}
            selected={prescription.id === selectedPrescription.id}
            onSelect={onSelectPrescription}
          />
        ))}
      </div>
      <Pagination />
    </article>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase text-[#64748B]">{label}</p>
        <p className={cx("truncate text-sm font-bold text-[#0F172A]", valueClassName)}>{value}</p>
      </div>
    </div>
  );
}

function MedicationList() {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#0F172A]">Médicaments prescrits</h3>
        <span className="text-xs font-bold uppercase text-[#64748B]">Qté</span>
      </div>
      <div className="mt-3 divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] bg-white">
        {medications.map((medication, index) => (
          <div key={medication.id} className="flex items-start gap-3 p-3">
            <span className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold", getMedicationBadgeClasses(index))}>
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#0F172A]">{medication.name}</p>
              <p className="text-xs font-semibold text-[#64748B]">{medication.type}</p>
              <p className="mt-1 text-xs font-medium leading-5 text-[#64748B]">{medication.instructions}</p>
            </div>
            <p className="text-sm font-bold text-[#0F172A]">{medication.quantity}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OrdonnanceDetailsPanel({ prescription }: { prescription: Prescription }) {
  return (
    <aside className={cx(panelClass, "xl:sticky xl:top-4 xl:self-start")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#64748B]">Détails de l’ordonnance</p>
          <h2 className="mt-2 text-xl font-bold text-[#0F172A]">{prescription.code}</h2>
        </div>
        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50" aria-label="Fermer">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3">
        <StatusBadge status={prescription.status} />
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
        <Avatar name={prescription.patient} />
        <div className="min-w-0">
          <p className="truncate font-bold text-[#0F172A]">{prescription.patient}</p>
          <p className="truncate text-sm font-semibold text-[#64748B]">{prescription.age} ans • {prescription.phone}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <InfoRow icon={Calendar} label="Date" value={prescription.date} />
        <InfoRow icon={Stethoscope} label="Traitement" value={prescription.treatment} />
        <InfoRow icon={UserRound} label="Dentiste" value={prescription.dentist} />
        <InfoRow icon={CheckCircle2} label="Statut" value={prescription.status} valueClassName="text-green-700" />
        <InfoRow icon={Clock} label="Délivrée le" value="10 Juin 2026 à 15:30" />
        <InfoRow icon={Building2} label="Pharmacie" value="Pharmacie Benakli" />
      </div>

      <MedicationList />

      <section className="mt-5 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
        <h3 className="text-base font-bold text-[#0F172A]">Instructions générales</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
          Éviter les aliments durs pendant 48h. Consulter en cas de douleur ou gonflement.
        </p>
      </section>

      <div className="mt-5 grid gap-2">
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Imprimer l’ordonnance
        </button>
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
          <Download className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          Télécharger PDF
        </button>
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition hover:bg-red-50">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Annuler l’ordonnance
        </button>
      </div>
    </aside>
  );
}

function MedicationAnalyticsCard() {
  const max = Math.max(...mostPrescribedMedications.map((item) => item.count));

  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Médicaments les plus prescrits</h2>
      <div className="mt-4 space-y-4">
        {mostPrescribedMedications.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="truncate font-bold text-[#0F172A]">{item.name}</p>
              <p className="shrink-0 font-bold text-[#64748B]">{item.count} ({item.percent})</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={cx("h-full rounded-full", item.color)} style={{ width: getProgressWidth(item.count, max) }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function PrescriptionStatusCard() {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Statuts des ordonnances</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#22C55E_0_84%,#F59E0B_84%_100%,#EF4444_100%_100%)]">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <span className="text-lg font-bold text-[#0F172A]">75</span>
            <span className="text-[11px] font-bold text-[#64748B]">Total</span>
          </div>
        </div>
        <dl className="space-y-3">
          {statusAnalytics.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <dt className="flex items-center gap-2 font-semibold text-[#64748B]">
                <span className={cx("h-2.5 w-2.5 rounded-full", item.dot)} />
                {item.label}
              </dt>
              <dd className={cx("font-bold", item.text)}>{item.value} ({item.percent})</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export default function OrdonnancesPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription>(
    prescriptions.find((prescription) => prescription.code === "ORD-2026-001") ?? prescriptions[0],
  );

  return (
    <section className="space-y-5">
      <div className="flex justify-end">
        <PageActions />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques ordonnances">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-5">
          <OrdonnancesCard
            selectedPrescription={selectedPrescription}
            onSelectPrescription={setSelectedPrescription}
          />
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            <MedicationAnalyticsCard />
            <PrescriptionStatusCard />
          </div>
        </section>
        <OrdonnanceDetailsPanel prescription={selectedPrescription} />
      </div>
    </section>
  );
}
