"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState, useCallback } from "react";
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Power,
  Search,
  Stethoscope,
  X,
} from "lucide-react";
import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type TreatmentStatus = "Actif" | "Inactif";

type TreatmentCategory =
  | "Préventif"
  | "Diagnostic"
  | "Conservateur"
  | "Chirurgical"
  | "Orthodontie"
  | "Esthétique"
  | "Prothèse"
  | "Autre";

type Treatment = {
  id: string;
  code: string;
  name: string;
  description: string;
  category: TreatmentCategory;
  duration: string;
  price: string;
  costPrice: string;
  status: TreatmentStatus;
};

interface TreatmentStats {
  total_treatments: number;
  active_treatments: number;
  used_this_month: number;
  used_change_percent: number;
  revenue: number;
  popular_treatment_name: string;
  popular_treatment_percent: number;
}

interface ApiTreatment {
  id: string | number;
  code: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  price: number | string;
  cost_price: number | string;
  status: string;
}

interface PaginatedResponse {
  data: ApiTreatment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const categories = [
  "Tous",
  "Préventif",
  "Conservateur",
  "Chirurgical",
  "Orthodontie",
  "Esthétique",
  "Prothèse",
  "Autre",
];

const selectedTreatmentInfo = {
  fullDescription:
    "Nettoyage complet des dents pour éliminer le tartre, la plaque et prévenir les caries et maladies des gencives.",
  indications: "Hygiène dentaire, prévention des caries, maladies parodontales.",
  contraindications: "Aucune connue.",
  activeSince: "10 Janv. 2024",
  updatedAt: "02 Juin 2026 par Dr Benali",
};

function formatPrice(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "0 DA";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0 DA";
  return num.toLocaleString("fr-FR") + " DA";
}

function mapApiTreatment(item: ApiTreatment): Treatment {
  return {
    id: String(item.id),
    code: item.code,
    name: item.name,
    description: item.description,
    category: item.category as TreatmentCategory,
    duration: item.duration,
    price: formatPrice(item.price),
    costPrice: formatPrice(item.cost_price),
    status: item.status === "Actif" || item.status === "active" ? "Actif" : "Inactif",
  };
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getCategoryClasses(category: TreatmentCategory) {
  const classes: Record<TreatmentCategory, string> = {
    Préventif: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Diagnostic: "border-blue-200 bg-blue-50 text-blue-700",
    Conservateur: "border-orange-200 bg-orange-50 text-orange-700",
    Chirurgical: "border-purple-200 bg-purple-50 text-purple-700",
    Orthodontie: "border-violet-200 bg-violet-50 text-violet-700",
    Esthétique: "border-pink-200 bg-pink-50 text-pink-700",
    Prothèse: "border-cyan-200 bg-cyan-50 text-cyan-700",
    Autre: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return classes[category];
}

function getStatusClasses(status: TreatmentStatus) {
  return status === "Actif"
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-red-200 bg-red-50 text-red-700";
}

function getIconContainerClasses(index: number) {
  const classes = [
    "bg-teal-50 text-[#0F766E]",
    "bg-blue-50 text-[#2563EB]",
    "bg-orange-50 text-[#F59E0B]",
    "bg-purple-50 text-[#7C3AED]",
    "bg-sky-50 text-sky-700",
    "bg-pink-50 text-pink-700",
    "bg-cyan-50 text-cyan-700",
    "bg-slate-100 text-slate-700",
  ];

  return classes[index % classes.length];
}

function CategoryBadge({ category }: { category: TreatmentCategory }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold",
        getCategoryClasses(category),
      )}
    >
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: TreatmentStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold",
        getStatusClasses(status),
      )}
    >
      {status}
    </span>
  );
}

function TreatmentIcon({ index, className }: { index: number; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        getIconContainerClasses(index),
        className,
      )}
    >
      <Stethoscope className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

function StatCard({
  title,
  value,
  label,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  label: string;
  icon: IconComponent;
  accent: string;
}) {
  return (
    <article className="group min-h-32 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
          <p className="mt-2 truncate text-xl font-bold text-[#0F172A] 2xl:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs font-bold text-[#64748B]">{label}</p>
        </div>
        <span
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-slate-900/10 2xl:h-11 2xl:w-11",
            accent,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function FilterButton({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-left text-sm transition hover:border-[#0F766E]/40 hover:bg-teal-50"
    >
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase text-[#64748B]">{label}</span>
        <span className="block truncate font-bold text-[#0F172A]">{value}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
    </button>
  );
}

function CategoryChips({ activeCategory, onCategoryChange }: { activeCategory: string; onCategoryChange: (cat: string) => void }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat === "Tous" ? "" : cat)}
            className={cx(
              "h-9 rounded-lg border px-3 text-sm font-bold transition-all duration-200",
              cat === "Tous"
                ? activeCategory === ""
                  ? "border-[#0F766E] bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : activeCategory === cat
                  ? "border-[#0F766E] bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

function FiltersCard({
  treatments,
  selectedTreatment,
  onSelectTreatment,
  meta,
  currentPage,
  onPageChange,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: {
  treatments: Treatment[];
  selectedTreatment: Treatment;
  onSelectTreatment: (treatment: Treatment) => void;
  meta: { current_page: number; last_page: number; per_page: number; total: number } | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-[#E2E8F0] p-4 2xl:p-5">
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-[minmax(260px,1fr)_190px_170px_auto]">
          <label className="relative block sm:col-span-2 2xl:col-span-1">
            <span className="sr-only">Rechercher un traitement</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un traitement..."
              className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
            />
          </label>
          <FilterButton
            label="Catégorie"
            value={category || "Toutes les catégories"}
            onClick={() => onCategoryChange("")}
          />
          <FilterButton
            label="Statut"
            value={status || "Tous les statuts"}
            onClick={() => onStatusChange("")}
          />
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Nouveau traitement
                  </button>
        </div>
        <CategoryChips activeCategory={category} onCategoryChange={onCategoryChange} />
      </div>

      <TreatmentsTable
        treatments={treatments}
        selectedTreatment={selectedTreatment}
        onSelectTreatment={onSelectTreatment}
      />
      <TreatmentMobileCards
        treatments={treatments}
        selectedTreatment={selectedTreatment}
        onSelectTreatment={onSelectTreatment}
      />
      <Pagination meta={meta} currentPage={currentPage} onPageChange={onPageChange} />
    </article>
  );
}

function ActionIconButton({
  label,
  icon: Icon,
}: {
  label: string;
  icon: IconComponent;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition-all duration-200 hover:bg-slate-50 hover:text-[#0F766E]"
      aria-label={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function TreatmentsTable({
  treatments,
  selectedTreatment,
  onSelectTreatment,
}: {
  treatments: Treatment[];
  selectedTreatment: Treatment;
  onSelectTreatment: (treatment: Treatment) => void;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-xs font-bold text-[#64748B]">
            <th className="border-b border-[#E2E8F0] px-3 py-3">Icon</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Code</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Traitement</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Catégorie</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Durée</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Prix (DA)</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Statut</th>
            <th className="border-b border-[#E2E8F0] py-3 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((treatment, index) => {
            const active = selectedTreatment.id === treatment.id;

            return (
              <tr
                key={treatment.id}
                className={cx(
                  "cursor-pointer transition-all duration-200 hover:bg-slate-50/70",
                  active && "bg-teal-50/50",
                )}
                onClick={() => onSelectTreatment(treatment)}
              >
                <td className="border-b border-slate-100 px-3 py-3">
                  <TreatmentIcon index={index} className="h-9 w-9" />
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-bold text-[#64748B]">
                  {treatment.code}
                </td>
                <td className="max-w-[180px] border-b border-slate-100 py-3 pr-3">
                  <p className="font-bold text-[#0F172A]">{treatment.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs font-medium text-[#64748B]">
                    {treatment.description}
                  </p>
                </td>
                <td className="border-b border-slate-100 py-3 pr-3">
                  <CategoryBadge category={treatment.category} />
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-medium text-[#64748B]">
                  {treatment.duration}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-bold text-[#0F172A]">
                  {treatment.price}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3">
                  <StatusBadge status={treatment.status} />
                </td>
                <td className="border-b border-slate-100 py-3 pr-3">
                  <div className="flex items-center gap-1">
                    <ActionIconButton label={`Voir ${treatment.name}`} icon={Eye} />
                    <ActionIconButton label={`Modifier ${treatment.name}`} icon={Pencil} />
                    <ActionIconButton label={`Plus d'actions pour ${treatment.name}`} icon={MoreVertical} />
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

function TreatmentMobileCards({
  treatments,
  selectedTreatment,
  onSelectTreatment,
}: {
  treatments: Treatment[];
  selectedTreatment: Treatment;
  onSelectTreatment: (treatment: Treatment) => void;
}) {
  return (
    <div className="grid gap-3 p-4 md:hidden">
      {treatments.map((treatment, index) => {
        const active = selectedTreatment.id === treatment.id;

        return (
          <article
            key={treatment.id}
            className={cx(
              "space-y-3 rounded-xl border bg-white p-4 transition-all duration-200",
              active ? "border-[#0F766E] bg-teal-50/40" : "border-[#E2E8F0]",
            )}
            onClick={() => onSelectTreatment(treatment)}
          >
            <div className="flex items-start gap-3">
              <TreatmentIcon index={index} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#0F172A]">{treatment.name}</h3>
                    <p className="text-xs font-bold text-[#64748B]">{treatment.code}</p>
                  </div>
                  <StatusBadge status={treatment.status} />
                </div>
                <p className="mt-2 text-sm font-medium text-[#64748B]">
                  {treatment.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={treatment.category} />
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-[#64748B]">
                {treatment.duration}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-[#0F172A]">
                {treatment.price}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_1fr_40px] gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A]"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Voir
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Modifier
              </button>
              <ActionIconButton label={`Plus d'actions pour ${treatment.name}`} icon={MoreVertical} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Pagination({
  meta,
  currentPage,
  onPageChange,
}: {
  meta: { current_page: number; last_page: number; per_page: number; total: number } | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const perPage = meta?.per_page ?? 8;
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  const pageNumbers: (number | "...")[] = [];
  if (lastPage <= 5) {
    for (let i = 1; i <= lastPage; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(lastPage - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pageNumbers.push(i);
    if (currentPage < lastPage - 2) pageNumbers.push("...");
    pageNumbers.push(lastPage);
  }

  return (
    <footer className="grid gap-3 border-t border-[#E2E8F0] p-4 2xl:grid-cols-[1fr_auto_auto] 2xl:items-center 2xl:justify-between">
      <p className="text-sm font-semibold text-[#64748B] 2xl:whitespace-nowrap">
        Affichage {total > 0 ? start : 0} - {end} sur {total} traitements
      </p>
      <div className="flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-sm font-bold text-[#64748B] transition hover:bg-slate-50 sm:px-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        {pageNumbers.map((page, idx) => (
          <button
            key={`${page}-${idx}`}
            type="button"
            disabled={page === "..."}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={cx(
              "h-9 min-w-9 rounded-lg px-2.5 text-sm font-bold transition sm:px-3",
              page === currentPage
                ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                : page === "..."
                  ? "pointer-events-none text-[#64748B]"
                  : "border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50",
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50 sm:px-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"
      >
        {perPage} par page
        <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </button>
    </footer>
  );
}

function InfoItem({
  label,
  value,
  long = false,
}: {
  label: string;
  value: string;
  long?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
      <dt className="text-sm font-bold text-[#0F172A]">{label}</dt>
      <dd
        className={cx(
          "mt-1 text-sm text-[#64748B]",
          long && "leading-relaxed",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function TreatmentDetailsPanel({ treatment }: { treatment: Treatment }) {
  const details =
    treatment.id === "TRT-001" || treatment.code === "TRT-001"
      ? selectedTreatmentInfo
      : {
          fullDescription: treatment.description,
          indications: "Selon diagnostic clinique et besoin du patient.",
          contraindications: "À confirmer selon le dossier médical du patient.",
          activeSince: "10 Janv. 2024",
          updatedAt: "02 Juin 2026 par Dr Benali",
        };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] xl:sticky xl:top-5 xl:self-start 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#0F172A]">{treatment.name}</h2>
            <p className="text-sm font-bold text-[#64748B]">{treatment.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={treatment.status} />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-slate-50"
            aria-label="Fermer les détails du traitement"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex border-b border-[#E2E8F0] text-sm font-bold">
        <button
          type="button"
          className="border-b-2 border-[#2563EB] px-3 pb-3 text-[#2563EB]"
        >
          Informations
        </button>
        <button
          type="button"
          className="px-3 pb-3 text-[#64748B] transition hover:text-[#0F172A]"
        >
          Historique
        </button>
      </div>

      <dl className="mt-5 space-y-3">
        <InfoItem label="Catégorie" value={treatment.category} />
        <InfoItem label="Durée moyenne" value={treatment.duration.replace("min", "minutes")} />
        <InfoItem label="Prix" value={treatment.price} />
        <InfoItem label="Prix coûtant" value={treatment.costPrice} />
        <InfoItem label="Description" value={details.fullDescription} long />
        <InfoItem label="Indications" value={details.indications} long />
        <InfoItem label="Contre-indications" value={details.contraindications} long />
        <InfoItem label="Actif depuis" value={details.activeSince} />
        <InfoItem label="Dernière mise à jour" value={details.updatedAt} long />
      </dl>

      <div className="mt-5 grid gap-2">
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Modifier
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition hover:bg-red-50"
        >
          <Power className="h-4 w-4" aria-hidden="true" />
          Désactiver
        </button>
      </div>
    </aside>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F766E]" />
    </div>
  );
}

export default function TraitementsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; per_page: number; total: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statsData, setStatsData] = useState<TreatmentStats | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  // Debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api<TreatmentStats>("/treatments/stats");
        setStatsData(data);
      } catch {
        setStatsData(null);
      }
    }
    fetchStats();
  }, []);

  const buildQuery = (page = 1) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    return params.toString();
  };

  const fetchTreatments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const query = buildQuery(page);
      const data = await api<PaginatedResponse>(`/treatments?${query}`);
      const mapped = data.data.map(mapApiTreatment);
      setTreatments(mapped);
      setMeta(data.meta);
      if (!selectedTreatment && mapped.length > 0) {
        setSelectedTreatment(mapped[0]);
      }
    } catch {
      setTreatments([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [search, category, status, selectedTreatment]);

  useEffect(() => {
    fetchTreatments(1);
    setCurrentPage(1);
  }, [search, category, status]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    try {
      const query = buildQuery(page);
      const data = await api<PaginatedResponse>(`/treatments?${query}`);
      const mapped = data.data.map(mapApiTreatment);
      setTreatments(mapped);
      setMeta(data.meta);
      if (mapped.length > 0) {
        setSelectedTreatment(mapped[0]);
      }
    } catch {
      setTreatments([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total traitements",
      value: statsData ? String(statsData.total_treatments) : "0",
      label: "Actifs",
      icon: Stethoscope,
      accent: "from-[#0F766E] to-[#2DD4BF]",
    },
    {
      title: "Utilisés ce mois",
      value: statsData ? String(statsData.used_this_month) : "0",
      label: statsData ? `+${statsData.used_change_percent}% vs mois dernier` : "0% vs mois dernier",
      icon: ClipboardList,
      accent: "from-[#2563EB] to-[#60A5FA]",
    },
    {
      title: "Chiffre d'affaires",
      value: statsData?.revenue != null
        ? statsData.revenue.toLocaleString("fr-FR") + " DA"
        : "0 DA",
      label: "Ce mois",
      icon: CircleDollarSign,
      accent: "from-[#F59E0B] to-[#FDBA74]",
    },
    {
      title: "Traitements populaires",
      value: statsData?.popular_treatment_name ?? "Aucun",
      label: statsData ? `${statsData.popular_treatment_percent}% des traitements` : "0% des traitements",
      icon: BarChart3,
      accent: "from-[#7C3AED] to-[#A78BFA]",
    },
  ];

  return (
    <section className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques traitements">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-5">
        <section className="min-w-0 space-y-4 2xl:space-y-5">
          {loading ? (
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-[#E2E8F0] p-4 2xl:p-5">
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-[minmax(260px,1fr)_190px_170px_auto]">
                  <label className="relative block sm:col-span-2 2xl:col-span-1">
                    <span className="sr-only">Rechercher un traitement</span>
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      placeholder="Rechercher un traitement..."
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    />
                  </label>
                  <FilterButton label="Statut" value="Tous les statuts" onClick={() => {}} />
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Nouveau traitement
                  </button>
                </div>
                <CategoryChips activeCategory="" onCategoryChange={() => {}} />
              </div>
              <LoadingSpinner />
            </article>
          ) : (
            <FiltersCard
              treatments={treatments}
              selectedTreatment={selectedTreatment ?? treatments[0]}
              onSelectTreatment={setSelectedTreatment}
              meta={meta}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              status={status}
              onStatusChange={setStatus}
            />
          )}
        </section>
        {selectedTreatment && (
          <TreatmentDetailsPanel treatment={selectedTreatment} />
        )}
      </div>
    </section>
  );
}
