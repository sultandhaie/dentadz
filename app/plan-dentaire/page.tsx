"use client";

import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock,
  ClipboardList,
  Eye,
  FileCheck2,
  Info,
  MoreVertical,
  Pencil,
  Plus,
  PlusCircle,
  Printer,
  Trash2,
  User,
  UserRound,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ToothStatus =
  | "Sain"
  | "À traiter"
  | "En traitement"
  | "Traité"
  | "Absent"
  | "Racine";

type Tooth = {
  number: number;
  status: ToothStatus;
  label?: string;
};

type PlanTreatmentStatus = "À venir" | "En cours" | "Terminé" | "Annulé";

type PlanTreatment = {
  id: string;
  tooth: number;
  treatment: string;
  category: string;
  dentist: string;
  duration: string;
  price: string;
  status: PlanTreatmentStatus;
  appointmentDate: string;
};

const stats = [
  {
    label: "Plans actifs",
    value: "24",
    detail: "Patients",
    icon: ClipboardList,
    accent: "from-[#0F766E] to-[#2DD4BF]",
  },
  {
    label: "Plans terminés",
    value: "18",
    detail: "Ce mois",
    icon: FileCheck2,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    label: "Valeur totale",
    value: "1.250.000 DA",
    detail: "Tous les plans actifs",
    icon: CircleDollarSign,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
  {
    label: "RDV liés",
    value: "56",
    detail: "À venir",
    icon: CalendarDays,
    accent: "from-[#7C3AED] to-[#A78BFA]",
  },
];

const upperTeeth: Tooth[] = [
  { number: 18, status: "Absent" },
  { number: 17, status: "Sain" },
  { number: 16, status: "Sain" },
  { number: 15, status: "Sain" },
  { number: 14, status: "À traiter" },
  { number: 13, status: "En traitement" },
  { number: 12, status: "Absent" },
  { number: 21, status: "Absent" },
  { number: 22, status: "Sain" },
  { number: 23, status: "Sain" },
  { number: 24, status: "Sain" },
  { number: 25, status: "Sain" },
  { number: 26, status: "Traité" },
  { number: 27, status: "Absent" },
  { number: 28, status: "Absent" },
];

const lowerTeeth: Tooth[] = [
  { number: 48, status: "Absent" },
  { number: 47, status: "Sain" },
  { number: 46, status: "Racine" },
  { number: 45, status: "Sain" },
  { number: 44, status: "En traitement" },
  { number: 43, status: "Absent" },
  { number: 42, status: "Absent" },
  { number: 41, status: "Absent" },
  { number: 31, status: "Absent" },
  { number: 32, status: "À traiter" },
  { number: 33, status: "À traiter" },
  { number: 35, status: "À traiter" },
  { number: 36, status: "Traité" },
  { number: 33, status: "À traiter", label: "33 bis" },
  { number: 38, status: "Absent" },
];

const teeth = [...upperTeeth, ...lowerTeeth];

const treatments: PlanTreatment[] = [
  {
    id: "PLAN-T-001",
    tooth: 16,
    treatment: "Plombage",
    category: "Conservateur",
    dentist: "Dr Cherif",
    duration: "45 min",
    price: "4.000 DA",
    status: "À venir",
    appointmentDate: "15 Juin 2026",
  },
  {
    id: "PLAN-T-002",
    tooth: 14,
    treatment: "Traitement canalaire",
    category: "Endodontie",
    dentist: "Dr Benali",
    duration: "60 min",
    price: "12.000 DA",
    status: "En cours",
    appointmentDate: "08 Juin 2026",
  },
  {
    id: "PLAN-T-003",
    tooth: 24,
    treatment: "Couronne céramique",
    category: "Prothèse",
    dentist: "Dr Benali",
    duration: "90 min",
    price: "18.000 DA",
    status: "À venir",
    appointmentDate: "22 Juin 2026",
  },
  {
    id: "PLAN-T-004",
    tooth: 36,
    treatment: "Détartrage",
    category: "Préventif",
    dentist: "Dr Cherif",
    duration: "30 min",
    price: "3.000 DA",
    status: "Terminé",
    appointmentDate: "28 Mai 2026",
  },
  {
    id: "PLAN-T-005",
    tooth: 46,
    treatment: "Extraction",
    category: "Chirurgical",
    dentist: "Dr Cherif",
    duration: "30 min",
    price: "5.000 DA",
    status: "À venir",
    appointmentDate: "18 Juin 2026",
  },
];

const financialSummary = [
  { label: "Sous-total", value: "1.250.000 DA" },
  { label: "Remise", value: "- 50.000 DA" },
  { label: "Total planifié", value: "1.200.000 DA" },
  { label: "Payé", value: "300.000 DA" },
  { label: "Reste à payer", value: "900.000 DA" },
];

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] 2xl:p-5";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getToothStatusClasses(status: ToothStatus) {
  const classes: Record<ToothStatus, { fill: string; shell: string; text: string; badge: string }> = {
    Sain: {
      fill: "fill-emerald-100 stroke-emerald-500",
      shell: "bg-emerald-50",
      text: "text-emerald-700",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    "À traiter": {
      fill: "fill-orange-100 stroke-orange-500",
      shell: "bg-orange-50",
      text: "text-orange-700",
      badge: "border-orange-200 bg-orange-50 text-orange-700",
    },
    "En traitement": {
      fill: "fill-blue-100 stroke-blue-500",
      shell: "bg-blue-50",
      text: "text-blue-700",
      badge: "border-blue-200 bg-blue-50 text-blue-700",
    },
    Traité: {
      fill: "fill-purple-100 stroke-purple-500",
      shell: "bg-purple-50",
      text: "text-purple-700",
      badge: "border-purple-200 bg-purple-50 text-purple-700",
    },
    Absent: {
      fill: "fill-slate-100 stroke-slate-300",
      shell: "bg-slate-50",
      text: "text-slate-500",
      badge: "border-slate-200 bg-slate-100 text-slate-700",
    },
    Racine: {
      fill: "fill-red-100 stroke-red-500",
      shell: "bg-red-50",
      text: "text-red-700",
      badge: "border-red-200 bg-red-50 text-red-700",
    },
  };

  return classes[status];
}

function getTreatmentStatusClasses(status: PlanTreatmentStatus) {
  const classes: Record<PlanTreatmentStatus, string> = {
    "À venir": "border-orange-200 bg-orange-50 text-orange-700",
    "En cours": "border-blue-200 bg-blue-50 text-blue-700",
    Terminé: "border-green-200 bg-green-50 text-green-700",
    Annulé: "border-red-200 bg-red-50 text-red-700",
  };

  return classes[status];
}

function getFinancialColor(label: string) {
  const colors: Record<string, string> = {
    "Sous-total": "text-[#0F172A]",
    Remise: "text-[#EF4444]",
    "Total planifié": "text-[#0F766E]",
    Payé: "text-[#2563EB]",
    "Reste à payer": "text-[#F59E0B]",
  };

  return colors[label] ?? "text-[#0F172A]";
}

function getToothName(number: number) {
  const names: Record<number, string> = {
    36: "Molaire inférieure gauche",
    14: "Prémolaire supérieure droite",
    16: "Molaire supérieure droite",
    24: "Prémolaire supérieure gauche",
    46: "Molaire inférieure droite",
  };

  return names[number] ?? "Dent sélectionnée";
}

function StatusBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", className)}>
      {children}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-md shadow-slate-900/10">
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </span>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconComponent;
  accent: string;
}) {
  return (
    <article className="group min-h-32 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
          <p className="mt-2 truncate text-xl font-bold text-[#0F172A] 2xl:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs font-bold text-[#64748B]">{detail}</p>
        </div>
        <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg 2xl:h-11 2xl:w-11", accent)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function PatientPlanSelector() {
  return (
    <article className={panelClass}>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-[minmax(220px,1.2fr)_minmax(200px,1fr)_120px_minmax(240px,0.95fr)] 2xl:items-end">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase text-[#64748B]">Sélectionner un patient</p>
          <button
            type="button"
            className="flex min-h-16 w-full min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 text-left transition hover:border-[#0F766E]/40 hover:bg-teal-50"
          >
            <Avatar name="Sara Khaldi" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#0F172A]">Sara Khaldi</span>
              <span className="block text-xs font-semibold text-[#64748B]">0661 10 20 30</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase text-[#64748B]">Plan dentaire</p>
          <button
            type="button"
            className="flex min-h-16 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3 text-left text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
          >
            <span className="truncate">Plan #PLN-2026-045</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-16 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center md:flex md:flex-col md:justify-center">
          <p className="text-xs font-bold uppercase text-green-700">Statut</p>
          <p className="text-sm font-bold text-green-700">Actif</p>
        </div>
        <div className="min-h-16 min-w-0 rounded-xl border border-[#E2E8F0] bg-slate-50/70 px-4 py-3 md:flex md:flex-col md:justify-center">
          <p className="text-xs font-bold leading-5 text-[#64748B]">Date de création: <span className="text-[#0F172A]">12 Mai 2026</span></p>
          <p className="mt-1 text-xs font-bold leading-5 text-[#64748B]">Dernière mise à jour: <span className="text-[#0F172A]">02 Juin 2026 par Dr Benali</span></p>
        </div>
      </div>
    </article>
  );
}

function PlanActionsCard() {
  return (
    <article className={cx(panelClass, "self-start")}>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
        >
          <Printer className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Imprimer
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau plan
        </button>
      </div>
    </article>
  );
}

function ToothSvg({ status }: { status: ToothStatus }) {
  const classes = getToothStatusClasses(status);

  return (
    <svg viewBox="0 0 42 42" className={cx("h-7 w-7 stroke-2 sm:h-8 sm:w-8 xl:h-7 xl:w-7 2xl:h-10 2xl:w-10", classes.fill)} aria-hidden="true">
      <path
        d="M21 5.25c2.36-1.3 6.75-2.08 10.31 1.67 3.68 3.87 3.12 10.88.12 15.95-1.58 2.67-2.07 5.77-2.52 8.62-.53 3.35-1.03 6.51-3.5 6.51-1.86 0-2.48-2.47-3.04-4.68-.43-1.73-.83-3.32-1.37-3.32s-.94 1.59-1.37 3.32C19.07 35.53 18.45 38 16.59 38c-2.47 0-2.97-3.16-3.5-6.51-.45-2.85-.94-5.95-2.52-8.62-3-5.07-3.56-12.08.12-15.95C14.25 3.17 18.64 3.95 21 5.25Z"
      />
    </svg>
  );
}

function ToothItem({
  tooth,
  selected,
  onSelect,
}: {
  tooth: Tooth;
  selected: boolean;
  onSelect: (tooth: Tooth) => void;
}) {
  const classes = getToothStatusClasses(tooth.status);

  return (
    <button
      type="button"
      onClick={() => onSelect(tooth)}
      aria-label={`Dent ${tooth.number}, statut ${tooth.status}`}
      className={cx(
        "flex min-w-0 flex-col items-center gap-1 rounded-xl p-1 transition hover:scale-105 hover:shadow-sm 2xl:p-1.5",
        classes.shell,
        selected && "ring-2 ring-[#0F766E]",
      )}
    >
      <ToothSvg status={tooth.status} />
      <span className={cx("text-[11px] font-bold", classes.text)}>{tooth.number}</span>
    </button>
  );
}

function Legend() {
  const statuses: ToothStatus[] = ["Sain", "À traiter", "En traitement", "Traité", "Absent", "Racine"];

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {statuses.map((status) => {
        const classes = getToothStatusClasses(status);
        return (
          <span
            key={status}
            className={cx(
              "inline-flex min-w-0 items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:text-xs",
              classes.badge,
            )}
          >
            <span className={cx("h-2.5 w-2.5 shrink-0 rounded-full bg-current", classes.text)} />
            <span className="truncate">{status}</span>
          </span>
        );
      })}
    </div>
  );
}

function ToothDetailsCard({ tooth }: { tooth: Tooth }) {
  const classes = getToothStatusClasses(tooth.status);
  const description = tooth.status === "Sain" || tooth.number === 36 ? "Aucun traitement requis." : "Traitement à planifier selon diagnostic.";

  return (
    <aside className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Dent {tooth.number}</h3>
          <p className="mt-1 text-sm font-semibold text-[#64748B]">{getToothName(tooth.number)}</p>
        </div>
        <StatusBadge className={classes.badge}>{tooth.status}</StatusBadge>
      </div>
      <div className="my-5 flex justify-center">
        <span className={cx("flex h-24 w-24 items-center justify-center rounded-2xl", classes.shell)}>
          <ToothSvg status={tooth.status} />
        </span>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-xs font-bold uppercase text-[#64748B]">Statut actuel</dt>
          <dd className="mt-1 text-sm font-bold text-[#0F172A]">{tooth.status}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-[#64748B]">Description</dt>
          <dd className="mt-1 text-sm font-medium leading-6 text-[#64748B]">{description}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
      >
        <PlusCircle className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
        Ajouter traitement
      </button>
    </aside>
  );
}

function DentalSchemaCard({
  selectedTooth,
  onSelectTooth,
}: {
  selectedTooth: Tooth;
  onSelectTooth: (tooth: Tooth) => void;
}) {
  return (
    <article className={panelClass}>
      <div className="mb-4 space-y-3">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-[#0F172A]">Schéma dentaire</h2>
          <p className="text-sm font-medium text-[#64748B]">Visualisez les dents et leurs statuts.</p>
        </div>
        <Legend />
      </div>
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3 2xl:p-4">
          <div className="space-y-5 2xl:space-y-6">
            <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] justify-items-center gap-1 sm:gap-1.5 xl:gap-1 2xl:gap-2">
              {upperTeeth.map((tooth, index) => (
                <ToothItem
                  key={`upper-${tooth.number}-${index}`}
                  tooth={tooth}
                  selected={selectedTooth.number === tooth.number && selectedTooth.status === tooth.status}
                  onSelect={onSelectTooth}
                />
              ))}
            </div>
            <div className="mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
            <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] justify-items-center gap-1 sm:gap-1.5 xl:gap-1 2xl:gap-2">
              {lowerTeeth.map((tooth, index) => (
                <ToothItem
                  key={`lower-${tooth.number}-${index}`}
                  tooth={tooth}
                  selected={selectedTooth.number === tooth.number && selectedTooth.status === tooth.status}
                  onSelect={onSelectTooth}
                />
              ))}
            </div>
            <p className="flex items-center justify-center gap-2 text-sm font-bold text-[#64748B]">
              <Info className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
              Cliquer sur une dent pour ajouter un traitement
            </p>
          </div>
        </div>
        <ToothDetailsCard tooth={selectedTooth} />
      </div>
    </article>
  );
}

function PlanTreatmentStatusBadge({ status }: { status: PlanTreatmentStatus }) {
  return <StatusBadge className={getTreatmentStatusClasses(status)}>{status}</StatusBadge>;
}

function PlanTreatmentsTable({ onSelectTooth }: { onSelectTooth: (tooth: Tooth) => void }) {
  const findTooth = (toothNumber: number) =>
    teeth.find((tooth) => tooth.number === toothNumber) ?? teeth[0];

  return (
    <article className={panelClass}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#0F172A]">Traitements du plan</h2>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]" type="button">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter un traitement
        </button>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-xs font-bold text-[#64748B]">
              {["Dent", "Traitement", "Catégorie", "Dentiste", "Durée", "Prix (DA)", "Statut", "RDV", "Actions"].map((head) => (
                <th key={head} className="border-b border-[#E2E8F0] px-3 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => {
              const tooth = findTooth(treatment.tooth);
              const toothClasses = getToothStatusClasses(tooth.status);
              return (
                <tr
                  key={treatment.id}
                  className="cursor-pointer transition hover:bg-slate-50/70"
                  onClick={() => onSelectTooth(tooth)}
                >
                  <td className="border-b border-slate-100 px-3 py-3">
                    <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", toothClasses.badge)}>
                      {treatment.tooth}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-3 py-3 font-bold text-[#0F172A]">{treatment.treatment}</td>
                  <td className="border-b border-slate-100 px-3 py-3 font-medium text-[#64748B]">{treatment.category}</td>
                  <td className="border-b border-slate-100 px-3 py-3 font-semibold text-[#0F172A]">{treatment.dentist}</td>
                  <td className="border-b border-slate-100 px-3 py-3 font-medium text-[#64748B]">{treatment.duration}</td>
                  <td className="border-b border-slate-100 px-3 py-3 font-bold text-[#0F172A]">{treatment.price}</td>
                  <td className="border-b border-slate-100 px-3 py-3"><PlanTreatmentStatusBadge status={treatment.status} /></td>
                  <td className="border-b border-slate-100 px-3 py-3 font-medium text-[#64748B]">{treatment.appointmentDate}</td>
                  <td className="border-b border-slate-100 px-3 py-3">
                    <div className="flex items-center gap-1">
                      {[Eye, Pencil, MoreVertical].map((Icon, index) => (
                        <button
                          key={index}
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]"
                          aria-label={`${index === 0 ? "Voir" : index === 1 ? "Modifier" : "Plus d’actions"} ${treatment.treatment}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {treatments.map((treatment) => {
          const tooth = findTooth(treatment.tooth);
          const toothClasses = getToothStatusClasses(tooth.status);
          return (
            <article key={treatment.id} className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", toothClasses.badge)}>
                    Dent {treatment.tooth}
                  </span>
                  <h3 className="mt-2 font-bold text-[#0F172A]">{treatment.treatment}</h3>
                  <p className="text-sm font-medium text-[#64748B]">{treatment.category} · {treatment.dentist}</p>
                </div>
                <PlanTreatmentStatusBadge status={treatment.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <p className="font-medium text-[#64748B]">Durée: <span className="font-bold text-[#0F172A]">{treatment.duration}</span></p>
                <p className="font-medium text-[#64748B]">Prix: <span className="font-bold text-[#0F172A]">{treatment.price}</span></p>
                <p className="col-span-2 font-medium text-[#64748B]">RDV: <span className="font-bold text-[#0F172A]">{treatment.appointmentDate}</span></p>
              </div>
            </article>
          );
        })}
      </div>
      <footer className="mt-4 flex flex-col gap-3 border-t border-[#E2E8F0] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:bg-teal-50">
          <Plus className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Ajouter un traitement
        </button>
        <div className="flex flex-wrap gap-3 text-sm font-bold">
          <span className="text-[#64748B]">Sous-total: <span className="text-[#0F172A]">42.000 DA</span></span>
          <span className="text-[#64748B]">Total planifié: <span className="text-[#0F766E]">1.200.000 DA</span></span>
        </div>
      </footer>
    </article>
  );
}

function PlanDetailsPanel() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] xl:sticky xl:top-5 xl:self-start 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusBadge className="border-green-200 bg-green-50 text-green-700">Actif</StatusBadge>
          <h2 className="mt-3 text-lg font-bold text-[#0F172A]">Plan #PLN-2026-045</h2>
        </div>
      </div>
      <dl className="mt-5 space-y-3">
        {[
          ["Patient", "Sara Khaldi", User],
          ["Âge", "32 ans", UserRound],
          ["Créé le", "12 Mai 2026", Calendar],
          ["Dernière mise à jour", "02 Juin 2026", Clock],
          ["Créé par", "Dr Benali", UserRound],
        ].map(([label, value, Icon]) => {
          const DetailIcon = Icon as IconComponent;
          return (
            <div key={label as string} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0F766E]">
                <DetailIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-bold uppercase text-[#64748B]">{label as string}</dt>
                <dd className="text-sm font-bold text-[#0F172A]">{value as string}</dd>
              </div>
            </div>
          );
        })}
      </dl>
      <section className="mt-5 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
        <h3 className="text-base font-bold text-[#0F172A]">Résumé financier</h3>
        <dl className="mt-3 space-y-2">
          {financialSummary.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm font-bold">
              <dt className="text-[#64748B]">{item.label}</dt>
              <dd className={getFinancialColor(item.label)}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-5 rounded-2xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-base font-bold text-[#0F172A]">Notes</h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">
          Traitement complet pour améliorer la santé bucco-dentaire et l’esthétique du sourire.
        </p>
      </section>
      <div className="mt-5 grid gap-2">
        <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]" type="button">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Modifier le plan
        </button>
        <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition hover:bg-red-50" type="button">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Archiver le plan
        </button>
      </div>
    </aside>
  );
}

export default function PlanDentairePage() {
  const [selectedTooth, setSelectedTooth] = useState<Tooth>(
    teeth.find((tooth) => tooth.number === 36) ?? teeth[0],
  );

  return (
    <section className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques plan dentaire">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-5">
        <PatientPlanSelector />
        <PlanActionsCard />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-5">
        <section className="space-y-4 2xl:space-y-5">
          <DentalSchemaCard selectedTooth={selectedTooth} onSelectTooth={setSelectedTooth} />
          <PlanTreatmentsTable onSelectTooth={setSelectedTooth} />
        </section>
        <PlanDetailsPanel />
      </div>
    </section>
  );
}
