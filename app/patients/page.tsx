"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CalendarPlus,
  Cake,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  FileText,
  FolderOpen,
  Loader2,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Stethoscope,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type PatientStatus = "Actif" | "En traitement" | "Nouveau" | "En retard";

interface Patient {
  id: number;
  patient_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  age: number;
  status: PatientStatus;
  balance: number;
  assigned_dentist?: { name: string } | null;
  appointments?: { appointment_date: string }[];
}

interface PatientStats {
  total: number;
  nouveaux: number;
  en_traitement: number;
  actifs: number;
  en_retard: number;
  total_balance: number;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] 2xl:p-5";

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

function formatBalance(balance: number) {
  return `${balance.toLocaleString("fr-DZ")} DA`;
}

function getStatusClass(status: PatientStatus) {
  const statusClasses: Record<PatientStatus, string> = {
    Actif: "bg-emerald-50 text-[#22C55E] ring-emerald-100",
    "En traitement": "bg-amber-50 text-[#F59E0B] ring-amber-100",
    Nouveau: "bg-blue-50 text-[#2563EB] ring-blue-100",
    "En retard": "bg-red-50 text-[#EF4444] ring-red-100",
  };
  return statusClasses[status] || "bg-slate-50 text-[#64748B] ring-slate-100";
}

function getBalanceClass(balance: number) {
  return balance > 0 ? "font-bold text-[#EF4444]" : "font-semibold text-[#0F172A]";
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
      {getInitials(name)}
    </span>
  );
}

function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ring-1",
        getStatusClass(status),
      )}
    >
      {status}
    </span>
  );
}

function PageActions() {
  return (
    <section className="flex sm:justify-end">
      <div className="grid gap-2 sm:flex sm:justify-end">
        <Link
          href="/patients/nouveau"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau patient
        </Link>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
        >
          <Upload className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Exporter
        </button>
      </div>
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
      <div className="flex items-start justify-between gap-3">
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

function FiltersCard({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  stats,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  stats: PatientStats | null;
}) {
  const filterChips = [
    { label: "Tous", active: activeFilter === "Tous" },
    { label: "Actifs", count: stats?.actifs, active: activeFilter === "Actif" },
    { label: "En traitement", count: stats?.en_traitement, active: activeFilter === "En traitement" },
    { label: "Nouveaux", count: stats?.nouveaux, active: activeFilter === "Nouveau" },
  ];

  return (
    <section className={panelClass} aria-label="Recherche et filtres">
      <div className="grid gap-3 xl:grid-cols-[minmax(220px,1fr)_170px_180px_160px_auto] 2xl:grid-cols-[minmax(220px,1fr)_180px_190px_170px_auto]">
        <label className="relative block">
          <span className="sr-only">Rechercher un patient</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
          />
        </label>
        <FilterButton label="Tous" />
        <FilterButton label="Tous les dentistes" />
        <FilterButton label="Toutes les dates" icon={Calendar} />
        <button
          type="button"
          onClick={() => { setSearchQuery(""); setActiveFilter("Tous"); }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
        >
          <RefreshCw className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Réinitialiser
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#64748B]">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filtres rapides
        </span>
        {filterChips.map((chip) => (
          <button
            type="button"
            key={chip.label}
            onClick={() => {
              if (chip.label === "Tous") setActiveFilter("Tous");
              else if (chip.label === "Actifs") setActiveFilter("Actif");
              else if (chip.label === "En traitement") setActiveFilter("En traitement");
              else if (chip.label === "Nouveaux") setActiveFilter("Nouveau");
            }}
            className={cx(
              "inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition",
              chip.active
                ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                : "bg-slate-100 text-[#0F172A] hover:bg-slate-200",
            )}
          >
            {chip.label}
            {chip.count != null ? <span className="text-xs opacity-75">{chip.count}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function FilterButton({ label, icon: Icon }: { label: string; icon?: IconComponent }) {
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
    >
      <span className="inline-flex min-w-0 items-center gap-2 truncate">
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" /> : null}
        <span className="truncate">{label}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
    </button>
  );
}

function IconButton({ label, icon: Icon, onClick }: { label: string; icon: IconComponent; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition cursor-pointer hover:bg-white hover:text-[#0F766E] hover:shadow-sm"
      aria-label={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function PatientMobileCard({ patient }: { patient: Patient }) {
  const router = useRouter();
  const fullName = `${patient.first_name} ${patient.last_name}`;
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar name={fullName} className="h-11 w-11" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-bold text-[#0F172A]">{fullName}</h3>
              <p className="text-xs font-semibold text-[#64748B]">ID {patient.patient_code}</p>
            </div>
            <StatusBadge status={patient.status} />
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <p className="flex items-center gap-2 font-medium text-[#64748B]">
              <Phone className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
              {patient.phone}
            </p>
            <p className="flex items-center gap-2 font-medium text-[#64748B]">
              <Cake className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              {patient.age} ans
            </p>
            <p className="font-medium text-[#64748B]">
              Solde:{" "}
              <span className={getBalanceClass(patient.balance)}>
                {formatBalance(patient.balance)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        <IconButton label={`Voir ${fullName}`} icon={Eye} onClick={() => router.push(`/patients/${patient.patient_code}`)} />
        <IconButton label={`Modifier ${fullName}`} icon={Pencil} onClick={() => router.push(`/patients/${patient.patient_code}/modifier`)} />
        <IconButton label={`Ajouter un rendez-vous pour ${fullName}`} icon={CalendarPlus} onClick={() => router.push(`/rendez-vous/nouveau?patient_id=${patient.patient_code}`)} />
        <IconButton label={`Plus d'actions pour ${fullName}`} icon={MoreVertical} />
      </div>
    </article>
  );
}

function Pagination({
  meta,
  setPage,
}: {
  meta: PaginationMeta;
  setPage: (p: number) => void;
}) {
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= meta.last_page; i++) {
    if (i === 1 || i === meta.last_page || (i >= meta.current_page - 1 && i <= meta.current_page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const from = (meta.current_page - 1) * meta.per_page + 1;
  const to = Math.min(meta.current_page * meta.per_page, meta.total);

  return (
    <div className="mt-5 grid gap-3 border-t border-[#E2E8F0] pt-4 2xl:grid-cols-[1fr_auto_auto] 2xl:items-center 2xl:justify-between">
      <p className="text-sm font-semibold text-[#64748B] 2xl:whitespace-nowrap">
        Affichage {from}–{to} sur {meta.total} patients
      </p>
      <div className="flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          disabled={meta.current_page <= 1}
          onClick={() => setPage(meta.current_page - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white px-2.5 text-sm font-bold text-[#64748B] transition hover:bg-slate-50 sm:px-3 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Précédent
        </button>
        {pages.map((page, i) => (
          <button
            type="button"
            key={`${page}-${i}`}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && setPage(page)}
            className={cx(
              "h-9 min-w-9 rounded-xl px-2.5 text-sm font-bold transition sm:px-3",
              page === meta.current_page
                ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                : "border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50",
              page === "..." && "pointer-events-none border-0 bg-transparent text-[#64748B]",
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => setPage(meta.current_page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white px-2.5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50 sm:px-3 disabled:opacity-40"
        >
          Suivant
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function QuickProfilePanel({ patient }: { patient: Patient | null }) {
  const router = useRouter();
  if (!patient) return null;
  const fullName = `${patient.first_name} ${patient.last_name}`;
  const nextAppt = patient.appointments?.[0]?.appointment_date;

  return (
    <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] 2xl:p-5 xl:sticky xl:top-5 xl:self-start 2xl:top-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Profil rapide</h2>
          <span className="mt-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E] ring-1 ring-teal-100">
            Dossier sélectionné
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-br from-teal-50 via-white to-blue-50 p-3.5 2xl:mt-6 2xl:p-4">
        <div className="flex items-center gap-3">
          <Avatar name={fullName} className="h-14 w-14 text-base 2xl:h-16 2xl:w-16 2xl:text-lg" />
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] 2xl:text-xl">{fullName}</h3>
            <p className="text-sm font-semibold text-[#64748B]">
              ID {patient.patient_code} · {patient.age} ans
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0F766E]">
              {patient.phone}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-3 2xl:mt-5 2xl:space-y-4">
        <InfoItem
          label="Dentiste"
          value={patient.assigned_dentist?.name || "Non assigné"}
        />
        <InfoItem
          label="Solde impayé"
          value={formatBalance(patient.balance)}
          danger={patient.balance > 0}
        />
        <InfoItem label="Statut" value={patient.status} />
      </dl>

      <div className="mt-4 grid gap-3 2xl:mt-6">
        <ProfileAction label="Voir dossier" icon={FolderOpen} tone="teal" onClick={() => router.push(`/patients/${patient.patient_code}`)} />
        <ProfileAction label="Ajouter paiement" icon={CreditCard} tone="blue" onClick={() => router.push(`/paiements/nouveau?patientId=${patient.patient_code}&patientName=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`)} />
        <ProfileAction label="Nouvelle ordonnance" icon={FileText} tone="purple" onClick={() => router.push(`/ordonnances/nouvelle?patientId=${patient.patient_code}&patientName=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`)} />
      </div>
    </aside>
  );
}

function InfoItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</dt>
      <dd className={cx("mt-1 text-sm font-bold", danger ? "text-[#EF4444]" : "text-[#0F172A]")}>
        {value}
      </dd>
    </div>
  );
}

function ProfileAction({
  label,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;
  icon: IconComponent;
  tone: "teal" | "blue" | "purple";
  onClick?: () => void;
}) {
  const tones = {
    teal: "bg-teal-50 text-[#0F766E] hover:border-[#0F766E]/30",
    blue: "bg-blue-50 text-[#2563EB] hover:border-[#2563EB]/30",
    purple: "bg-violet-50 text-[#7C3AED] hover:border-violet-400/40",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3 text-left transition cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className={cx("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-bold text-[#0F172A]">{label}</span>
    </button>
  );
}

export default function PatientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token") || "";
    try {
      const params = new URLSearchParams({ per_page: "15", page: String(page) });
      if (searchQuery) params.set("search", searchQuery);
      if (activeFilter !== "Tous") params.set("status", activeFilter);

      const [patientsRes, statsRes] = await Promise.all([
        api<{ data: Patient[]; meta: PaginationMeta }>(`/patients?${params}`, { token }),
        api<PatientStats>("/patients/stats", { token }),
      ]);

      setPatients(patientsRes.data);
      setMeta(patientsRes.meta);
      setStats(statsRes);
      if (patientsRes.data.length > 0 && !selectedPatient) {
        setSelectedPatient(patientsRes.data[0]);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery, activeFilter]);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  return (
    <>
      <PageActions />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs patients">
        {loading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 animate-pulse h-28" />
          ))
        ) : (
          <>
            <StatCard
              label="Total patients"
              value={stats.total.toLocaleString()}
              trend={`${stats.actifs} actifs`}
              icon={Users}
              accent="from-[#2563EB] to-[#60A5FA]"
            />
            <StatCard
              label="Nouveaux ce mois"
              value={String(stats.nouveaux)}
              trend={`${stats.total} total`}
              icon={UserPlus}
              accent="from-[#22C55E] to-[#86EFAC]"
            />
            <StatCard
              label="En traitement"
              value={String(stats.en_traitement)}
              trend={`${stats.en_retard} en retard`}
              icon={Stethoscope}
              accent="from-[#F59E0B] to-[#FDBA74]"
            />
            <StatCard
              label="Solde total"
              value={formatBalance(stats.total_balance)}
              trend={`${stats.total} patients`}
              icon={Calendar}
              accent="from-[#7C3AED] to-[#A78BFA]"
            />
          </>
        )}
      </section>

      <FiltersCard
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={(v) => { setActiveFilter(v); setPage(1); }}
        stats={stats}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-6">
        <article className={panelClass}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">Liste des patients</h2>
              <p className="text-sm text-[#64748B]">Dossiers récents et suivi financier.</p>
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-[#64748B]">
                  <th className="border-b border-[#E2E8F0] pb-3 pr-3">Patient</th>
                  <th className="border-b border-[#E2E8F0] pb-3 pr-3">Téléphone</th>
                  <th className="border-b border-[#E2E8F0] pb-3 pr-3">Âge</th>
                  <th className="border-b border-[#E2E8F0] pb-3 pr-3">Dentiste</th>
                  <th className="border-b border-[#E2E8F0] pb-3 pr-3">Solde</th>
                  <th className="border-b border-[#E2E8F0] pb-3 pr-3">Statut</th>
                  <th className="border-b border-[#E2E8F0] pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#0F766E]" />
                    </td>
                  </tr>
                ) : patients.length > 0 ? (
                  patients.map((patient, index) => {
                    const fullName = `${patient.first_name} ${patient.last_name}`;
                    const isSelected = selectedPatient?.id === patient.id;
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={cx(
                          "group cursor-pointer transition hover:bg-slate-50",
                          isSelected && "bg-teal-50/65",
                        )}
                      >
                        <td
                          className={cx(
                            "border-b border-slate-100 py-3 pr-3",
                            isSelected && "border-l-4 border-l-[#0F766E] pl-2",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar name={fullName} className="h-9 w-9 text-xs" />
                            <div className="min-w-0">
                              <p className="truncate font-bold text-[#0F172A]">{fullName}</p>
                              <p className="text-xs font-semibold text-[#64748B]">ID {patient.patient_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-slate-100 py-3 pr-3 font-medium text-[#64748B]">
                          {patient.phone}
                        </td>
                        <td className="border-b border-slate-100 py-3 pr-3 font-semibold text-[#0F172A]">
                          {patient.age}
                        </td>
                        <td className="border-b border-slate-100 py-3 pr-3 font-semibold text-[#0F172A]">
                          {patient.assigned_dentist?.name || "—"}
                        </td>
                        <td className={cx("border-b border-slate-100 py-3 pr-3", getBalanceClass(patient.balance))}>
                          {formatBalance(patient.balance)}
                        </td>
                        <td className="border-b border-slate-100 py-3 pr-3">
                          <StatusBadge status={patient.status} />
                        </td>
                        <td className="border-b border-slate-100 py-3">
                          <div className="flex items-center gap-1">
                            <IconButton label={`Voir ${fullName}`} icon={Eye} onClick={() => router.push(`/patients/${patient.patient_code}`)} />
                            <IconButton label={`Modifier ${fullName}`} icon={Pencil} onClick={() => router.push(`/patients/${patient.patient_code}/modifier`)} />
                            <IconButton label={`Ajouter un rendez-vous pour ${fullName}`} icon={CalendarPlus} onClick={() => router.push(`/rendez-vous/nouveau?patient_id=${patient.patient_code}`)} />
                            <IconButton label={`Plus d'actions pour ${fullName}`} icon={MoreVertical} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm font-semibold text-[#64748B]">
                      Aucun patient trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#0F766E]" />
              </div>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <PatientMobileCard key={patient.id} patient={patient} />
              ))
            ) : (
              <div className="py-12 text-center text-sm font-semibold text-[#64748B]">
                Aucun patient trouvé.
              </div>
            )}
          </div>

          {!loading && meta.total > 0 && <Pagination meta={meta} setPage={setPage} />}
        </article>

        <QuickProfilePanel patient={selectedPatient} />
      </section>
    </>
  );
}
