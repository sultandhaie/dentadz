"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
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

import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type PrescriptionStatus = "Délivrée" | "En attente" | "Annulée";

type ApiPrescription = {
  id: string;
  prescription_code: string;
  patient_id: string;
  dentist_id: string;
  medications: string;
  instructions: string;
  prescribed_date: string;
  validity_date: string;
  status: string;
  patient: { first_name: string; last_name: string; phone: string };
  dentist: { name: string };
};

type Prescription = {
  id: string;
  code: string;
  patient: string;
  phone: string;
  date: string;
  treatment: string;
  dentist: string;
  status: PrescriptionStatus;
  medicationCount: number;
  instructions: string;
  medications: string;
};

type Stat = {
  title: string;
  value: string;
  label: string;
  icon: IconComponent;
  accent: string;
};

type MedicationItem = {
  id: string;
  name: string;
  type: string;
  instructions: string;
  quantity: number;
};

type ApiMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const mapStatus = (status: string): PrescriptionStatus => {
  if (status === "Active") return "Délivrée";
  if (status === "Expirée") return "Annulée";
  if (status === "Annulée") return "Annulée";
  return "En attente";
};

type PrescriptionStats = {
  total: number;
  delivered: number;
  pending: number;
  expired: number;
  cancelled: number;
  total_medications: number;
  top_medications: { name: string; count: number; percent: string; color: string }[];
};

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
      <Link
        href="/ordonnances/nouvelle"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nouvelle ordonnance
      </Link>
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
            Aujourd'hui
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdonnancesTable({
  prescriptions,
  selectedPrescription,
  onSelectPrescription,
}: {
  prescriptions: Prescription[];
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
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]" aria-label={`Plus d'actions ${prescription.code}`}>
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
        <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#64748B]" aria-label={`Plus d'actions ${prescription.code}`}>
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function Pagination({
  meta,
  currentPage,
  onNavigate,
}: {
  meta: ApiMeta;
  currentPage: number;
  onNavigate: (page: number) => void;
}) {
  const pages: number[] = [];
  for (let i = 1; i <= meta.last_page; i++) {
    pages.push(i);
  }

  return (
    <footer className="grid gap-3 border-t border-[#E2E8F0] px-4 py-4 2xl:grid-cols-[1fr_auto_auto] 2xl:items-center 2xl:justify-between">
      <p className="text-sm font-semibold text-[#64748B] 2xl:whitespace-nowrap">
        Affichage {meta.per_page * (meta.current_page - 1) + 1} - {Math.min(meta.per_page * meta.current_page, meta.total)} sur {meta.total} ordonnances
      </p>
      <div className="flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onNavigate(currentPage - 1)}
          className={cx(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition",
            currentPage <= 1
              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
              : "border-slate-200 bg-white text-[#64748B] hover:bg-slate-50",
          )}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onNavigate(page)}
            className={cx(
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition",
              page === currentPage
                ? "border-[#0F766E] bg-[#0F766E] text-white"
                : "border-slate-200 bg-white text-[#64748B] hover:bg-slate-50",
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= meta.last_page}
          onClick={() => onNavigate(currentPage + 1)}
          className={cx(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition",
            currentPage >= meta.last_page
              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
              : "border-slate-200 bg-white text-[#64748B] hover:bg-slate-50",
          )}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <button type="button" className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-[#0F172A]">
        {meta.per_page} par page
        <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </button>
    </footer>
  );
}

function OrdonnancesCard({
  prescriptions,
  selectedPrescription,
  onSelectPrescription,
  meta,
  currentPage,
  onNavigate,
}: {
  prescriptions: Prescription[];
  selectedPrescription: Prescription;
  onSelectPrescription: (prescription: Prescription) => void;
  meta: ApiMeta;
  currentPage: number;
  onNavigate: (page: number) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <FiltersSection />
      <OrdonnancesTable prescriptions={prescriptions} selectedPrescription={selectedPrescription} onSelectPrescription={onSelectPrescription} />
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
      <Pagination meta={meta} currentPage={currentPage} onNavigate={onNavigate} />
    </article>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName,
  wrap,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  valueClassName?: string;
  wrap?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase text-[#64748B]">{label}</p>
        <p className={cx("text-sm font-bold text-[#0F172A]", wrap ? "whitespace-normal break-words" : "truncate", valueClassName)}>{value}</p>
      </div>
    </div>
  );
}

function MedicationList({ medications }: { medications: string }) {
  const items = medications
    ? medications
        .replace(/\\n/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  if (items.length === 0) {
    return (
      <section className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[#0F172A]">Médicaments prescrits</h3>
        </div>
        <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center text-sm font-semibold text-[#64748B]">
          Aucun médicament prescrit
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#0F172A]">Médicaments prescrits</h3>
        <span className="text-xs font-bold uppercase text-[#64748B]">Qté</span>
      </div>
      <div className="mt-3 divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] bg-white">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3">
            <span className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold", getMedicationBadgeClasses(index))}>
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#0F172A]">{item}</p>
            </div>
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
          <p className="text-sm font-bold text-[#64748B]">Détails de l'ordonnance</p>
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
          <p className="truncate text-sm font-semibold text-[#64748B]">{prescription.phone}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <InfoRow icon={Calendar} label="Date" value={prescription.date ? new Date(prescription.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""} />
        <InfoRow icon={Stethoscope} label="Traitement" value={prescription.treatment} wrap />
        <InfoRow icon={UserRound} label="Dentiste" value={prescription.dentist} />
        <InfoRow icon={CheckCircle2} label="Statut" value={prescription.status} valueClassName="text-green-700" />
        <InfoRow icon={Building2} label="Pharmacie" value="Pharmacie Benakli" />
      </div>

      <MedicationList medications={prescription.medications} />

      <section className="mt-5 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
        <h3 className="text-base font-bold text-[#0F172A]">Instructions générales</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
          {prescription.instructions || "Éviter les aliments durs pendant 48h. Consulter en cas de douleur ou gonflement."}
        </p>
      </section>

      <div className="mt-5 grid gap-2">
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Imprimer l'ordonnance
        </button>
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
          <Download className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          Télécharger PDF
        </button>
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition hover:bg-red-50">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Annuler l'ordonnance
        </button>
      </div>
    </aside>
  );
}

function MedicationAnalyticsCard({ topMedications }: { topMedications: PrescriptionStats["top_medications"] }) {
  if (topMedications.length === 0) {
    return (
      <article className={panelClass}>
        <h2 className="text-lg font-semibold text-[#0F172A]">Médicaments les plus prescrits</h2>
        <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center text-sm font-semibold text-[#64748B]">
          Aucune donnée disponible
        </div>
      </article>
    );
  }

  const max = Math.max(...topMedications.map((item) => item.count));

  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Médicaments les plus prescrits</h2>
      <div className="mt-4 space-y-4">
        {topMedications.map((item) => (
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

function PrescriptionStatusCard({ stats }: { stats: PrescriptionStats }) {
  const total = stats.total || 1;
  const deliveredPct = Math.round((stats.delivered / total) * 100);
  const pendingPct = Math.round(((stats.pending + stats.expired) / total) * 100);
  const cancelledPct = 100 - deliveredPct - pendingPct;

  const statusData = [
    { label: "Délivrées", value: String(stats.delivered), percent: `${deliveredPct}%`, dot: "bg-[#22C55E]", text: "text-green-700" },
    { label: "En attente", value: String(stats.pending + stats.expired), percent: `${pendingPct}%`, dot: "bg-[#F59E0B]", text: "text-orange-700" },
    { label: "Annulées", value: String(stats.cancelled), percent: `${cancelledPct}%`, dot: "bg-[#EF4444]", text: "text-red-700" },
  ];

  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Statuts des ordonnances</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
        <div
          className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#22C55E 0 ${deliveredPct}%, #F59E0B ${deliveredPct}% ${deliveredPct + pendingPct}%, #EF4444 ${deliveredPct + pendingPct}% 100%)`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <span className="text-lg font-bold text-[#0F172A]">{stats.total}</span>
            <span className="text-[11px] font-bold text-[#64748B]">Total</span>
          </div>
        </div>
        <dl className="space-y-3">
          {statusData.map((item) => (
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

function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#0F766E]" />
        <p className="text-sm font-semibold text-[#64748B]">Chargement des ordonnances...</p>
      </div>
    </div>
  );
}

export default function OrdonnancesPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionStats, setPrescriptionStats] = useState<PrescriptionStats>({
    total: 0,
    delivered: 0,
    pending: 0,
    expired: 0,
    cancelled: 0,
    total_medications: 0,
    top_medications: [],
  });
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Ordonnances ce mois",
      value: "0",
      label: "Total",
      icon: ClipboardList,
      accent: "from-[#0F766E] to-[#2DD4BF]",
    },
    {
      title: "Médicaments prescrits",
      value: "0",
      label: "Ce mois",
      icon: Pill,
      accent: "from-[#2563EB] to-[#60A5FA]",
    },
    {
      title: "En attente",
      value: "0",
      label: "À délivrer",
      icon: Clock3,
      accent: "from-[#F59E0B] to-[#FDBA74]",
    },
    {
      title: "Délivrées",
      value: "0",
      label: "0% du total",
      icon: CheckCircle2,
      accent: "from-[#22C55E] to-[#86EFAC]",
    },
  ]);
  const [meta, setMeta] = useState<ApiMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPrescriptions(currentPage);
  }, [currentPage]);

  async function fetchPrescriptions(page: number) {
    setLoading(true);
    try {
      const [response, statsResponse] = await Promise.all([
        api<{ data: ApiPrescription[]; meta: ApiMeta }>(`/prescriptions?page=${page}`),
        api<PrescriptionStats>("/prescriptions/stats"),
      ]);

      const mapped: Prescription[] = response.data.map((item) => ({
        id: String(item.id),
        code: item.prescription_code,
        patient: `${item.patient.first_name} ${item.patient.last_name}`,
        phone: item.patient.phone,
        date: item.prescribed_date,
        treatment: item.instructions || "",
        dentist: item.dentist.name,
        status: mapStatus(item.status),
        medicationCount: item.medications
          ? item.medications
              .replace(/\\n/g, "\n")
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean).length
          : 0,
        instructions: item.instructions || "",
        medications: item.medications || "",
      }));

      setPrescriptions(mapped);
      setMeta(response.meta);
      setPrescriptionStats(statsResponse);

      if (mapped.length > 0 && !selectedPrescription) {
        setSelectedPrescription(mapped[0]);
      }

      const deliveredPercent = statsResponse.total > 0 ? Math.round((statsResponse.delivered / statsResponse.total) * 100) : 0;

      setStats([
        {
          title: "Ordonnances ce mois",
          value: String(statsResponse.total),
          label: "Total",
          icon: ClipboardList,
          accent: "from-[#0F766E] to-[#2DD4BF]",
        },
        {
          title: "Médicaments prescrits",
          value: String(statsResponse.total_medications),
          label: "Total prescrits",
          icon: Pill,
          accent: "from-[#2563EB] to-[#60A5FA]",
        },
        {
          title: "En attente",
          value: String(statsResponse.pending + statsResponse.expired),
          label: "À délivrer",
          icon: Clock3,
          accent: "from-[#F59E0B] to-[#FDBA74]",
        },
        {
          title: "Délivrées",
          value: String(statsResponse.delivered),
          label: `${deliveredPercent}% du total`,
          icon: CheckCircle2,
          accent: "from-[#22C55E] to-[#86EFAC]",
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleNavigate(page: number) {
    setCurrentPage(page);
  }

  if (loading && prescriptions.length === 0) {
    return (
      <section className="space-y-5">
        <div className="flex justify-end">
          <PageActions />
        </div>
        <LoadingSpinner />
      </section>
    );
  }

  if (!selectedPrescription) {
    return (
      <section className="space-y-5">
        <div className="flex justify-end">
          <PageActions />
        </div>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm font-semibold text-[#64748B]">Aucune ordonnance trouvée.</p>
        </div>
      </section>
    );
  }

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
            prescriptions={prescriptions}
            selectedPrescription={selectedPrescription}
            onSelectPrescription={setSelectedPrescription}
            meta={meta}
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            <MedicationAnalyticsCard topMedications={prescriptionStats.top_medications} />
            <PrescriptionStatusCard stats={prescriptionStats} />
          </div>
        </section>
        <OrdonnanceDetailsPanel prescription={selectedPrescription} />
      </div>
    </section>
  );
}
