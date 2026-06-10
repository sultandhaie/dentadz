import type { ComponentType, SVGProps } from "react";
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

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type PatientStatus = "Actif" | "En traitement" | "Nouveau" | "En retard";

type Patient = {
  name: string;
  id: string;
  phone: string;
  age: number;
  lastVisit: string;
  nextVisit: string;
  dentist: string;
  balance: number;
  status: PatientStatus;
};

const stats = [
  {
    label: "Total patients",
    value: "1,248",
    trend: "+8% vs mois dernier",
    icon: Users,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    label: "Nouveaux ce mois",
    value: "32",
    trend: "+12% vs mois dernier",
    icon: UserPlus,
    accent: "from-[#22C55E] to-[#86EFAC]",
  },
  {
    label: "En traitement",
    value: "186",
    trend: "+5% vs mois dernier",
    icon: Stethoscope,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
  {
    label: "Rendez-vous aujourd’hui",
    value: "18",
    trend: "+4 vs hier",
    icon: Calendar,
    accent: "from-[#7C3AED] to-[#A78BFA]",
  },
];

const filterChips = [
  { label: "Tous", active: true },
  { label: "Actifs", count: "1,012" },
  { label: "En traitement", count: "186" },
  { label: "Nouveaux", count: "32" },
];

const patients: Patient[] = [
  {
    name: "Ahmed Benali",
    id: "#P-000125",
    phone: "0555 22 33 44",
    age: 34,
    lastVisit: "08 Juin 2026",
    nextVisit: "12 Juin 2026",
    dentist: "Dr Benali",
    balance: 25000,
    status: "En traitement",
  },
  {
    name: "Sara Khaldi",
    id: "#P-000126",
    phone: "0661 10 20 30",
    age: 29,
    lastVisit: "07 Juin 2026",
    nextVisit: "10 Juin 2026",
    dentist: "Dr Amrani",
    balance: 0,
    status: "Actif",
  },
  {
    name: "Mohamed Amrani",
    id: "#P-000127",
    phone: "0770 55 44 66",
    age: 42,
    lastVisit: "06 Juin 2026",
    nextVisit: "—",
    dentist: "Dr Amrani",
    balance: 8000,
    status: "En traitement",
  },
  {
    name: "Lina Cherif",
    id: "#P-000128",
    phone: "0550 33 44 55",
    age: 26,
    lastVisit: "05 Juin 2026",
    nextVisit: "11 Juin 2026",
    dentist: "Dr Benali",
    balance: 0,
    status: "Actif",
  },
  {
    name: "Yacine Saadi",
    id: "#P-000129",
    phone: "0777 44 55 66",
    age: 31,
    lastVisit: "06 Juin 2026",
    nextVisit: "—",
    dentist: "Dr Benali",
    balance: 5000,
    status: "En retard",
  },
  {
    name: "Nadia Boudiaf",
    id: "#P-000130",
    phone: "0560 12 34 56",
    age: 38,
    lastVisit: "04 Juin 2026",
    nextVisit: "—",
    dentist: "Dr Amrani",
    balance: 0,
    status: "Actif",
  },
  {
    name: "Rachid Hassaine",
    id: "#P-000131",
    phone: "0654 56 78 90",
    age: 45,
    lastVisit: "03 Juin 2026",
    nextVisit: "15 Juin 2026",
    dentist: "Dr Cherif",
    balance: 12000,
    status: "En traitement",
  },
  {
    name: "Imane Ferhat",
    id: "#P-000132",
    phone: "0541 98 76 54",
    age: 27,
    lastVisit: "02 Juin 2026",
    nextVisit: "09 Juin 2026",
    dentist: "Dr Cherif",
    balance: 0,
    status: "Nouveau",
  },
];

const selectedPatient = patients[0];

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

  return statusClasses[status];
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
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau patient
        </button>
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

function FiltersCard() {
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
            className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
          />
        </label>
        <FilterButton label="Tous" />
        <FilterButton label="Tous les dentistes" />
        <FilterButton label="Toutes les dates" icon={Calendar} />
        <button
          type="button"
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
            className={cx(
              "inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition",
              chip.active
                ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                : "bg-slate-100 text-[#0F172A] hover:bg-slate-200",
            )}
          >
            {chip.label}
            {chip.count ? <span className="text-xs opacity-75">{chip.count}</span> : null}
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

function PatientsTable() {
  return (
    <article className={panelClass}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Liste des patients</h2>
          <p className="text-sm text-[#64748B]">Dossiers récents et suivi financier.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:bg-blue-50"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          Colonnes
        </button>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs font-bold text-[#64748B]">
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">
                <span className="sr-only">Sélection</span>
              </th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Patient</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Téléphone</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Âge</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Dernière visite</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Prochain RDV</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Dentiste</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Solde</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-3">Statut</th>
              <th className="border-b border-[#E2E8F0] pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient.id}
                className={cx(
                  "group transition hover:bg-slate-50",
                  index === 0 && "bg-teal-50/65",
                )}
              >
                <td
                  className={cx(
                    "border-b border-slate-100 py-3 pr-3",
                    index === 0 && "border-l-4 border-l-[#0F766E] pl-2",
                  )}
                >
                  <input
                    type="checkbox"
                    defaultChecked={index === 0}
                    aria-label={`Sélectionner ${patient.name}`}
                    className="h-4 w-4 rounded border-[#CBD5E1] accent-[#0F766E]"
                  />
                </td>
                <td className="border-b border-slate-100 py-3 pr-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={patient.name} className="h-9 w-9 text-xs" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#0F172A]">{patient.name}</p>
                      <p className="text-xs font-semibold text-[#64748B]">ID {patient.id}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-medium text-[#64748B]">
                  {patient.phone}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-semibold text-[#0F172A]">
                  {patient.age}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-medium text-[#64748B]">
                  {patient.lastVisit}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-medium text-[#64748B]">
                  {patient.nextVisit}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3 font-semibold text-[#0F172A]">
                  {patient.dentist}
                </td>
                <td className={cx("border-b border-slate-100 py-3 pr-3", getBalanceClass(patient.balance))}>
                  {formatBalance(patient.balance)}
                </td>
                <td className="border-b border-slate-100 py-3 pr-3">
                  <StatusBadge status={patient.status} />
                </td>
                <td className="border-b border-slate-100 py-3">
                  <div className="flex items-center gap-1">
                    <IconButton label={`Voir ${patient.name}`} icon={Eye} />
                    <IconButton label={`Modifier ${patient.name}`} icon={Pencil} />
                    <IconButton label={`Ajouter un rendez-vous pour ${patient.name}`} icon={CalendarPlus} />
                    <IconButton label={`Plus d’actions pour ${patient.name}`} icon={MoreVertical} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {patients.map((patient) => (
          <PatientMobileCard key={patient.id} patient={patient} />
        ))}
      </div>

      <Pagination />
    </article>
  );
}

function IconButton({ label, icon: Icon }: { label: string; icon: IconComponent }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-white hover:text-[#0F766E] hover:shadow-sm"
      aria-label={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function PatientMobileCard({ patient }: { patient: Patient }) {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar name={patient.name} className="h-11 w-11" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-bold text-[#0F172A]">{patient.name}</h3>
              <p className="text-xs font-semibold text-[#64748B]">ID {patient.id}</p>
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
              Prochain RDV: <span className="font-bold text-[#0F172A]">{patient.nextVisit}</span>
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
        <IconButton label={`Voir ${patient.name}`} icon={Eye} />
        <IconButton label={`Modifier ${patient.name}`} icon={Pencil} />
        <IconButton label={`Ajouter un rendez-vous pour ${patient.name}`} icon={CalendarPlus} />
        <IconButton label={`Plus d’actions pour ${patient.name}`} icon={MoreVertical} />
      </div>
    </article>
  );
}

function Pagination() {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[#E2E8F0] pt-4 xl:flex-row xl:items-center xl:justify-between">
      <p className="text-sm font-semibold text-[#64748B]">
        Affichage 1–8 sur 128 patients
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#64748B] transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Précédent
        </button>
        {["1", "2", "3", "…", "16"].map((page) => (
          <button
            type="button"
            key={page}
            className={cx(
              "h-9 min-w-9 rounded-xl px-3 text-sm font-bold transition",
              page === "1"
                ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                : "border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50",
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"
        >
          Suivant
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"
      >
        8 par page
        <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </button>
    </div>
  );
}

function QuickProfilePanel() {
  return (
    <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] 2xl:p-5 xl:sticky xl:top-5 xl:self-start 2xl:top-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Profil rapide</h2>
          <span className="mt-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E] ring-1 ring-teal-100">
            Dossier sélectionné
          </span>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-slate-50"
          aria-label="Fermer le profil rapide"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-br from-teal-50 via-white to-blue-50 p-3.5 2xl:mt-6 2xl:p-4">
        <div className="flex items-center gap-3">
          <Avatar name={selectedPatient.name} className="h-14 w-14 text-base 2xl:h-16 2xl:w-16 2xl:text-lg" />
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] 2xl:text-xl">{selectedPatient.name}</h3>
            <p className="text-sm font-semibold text-[#64748B]">
              ID {selectedPatient.id} · {selectedPatient.age} ans
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0F766E]">
              {selectedPatient.phone}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-3 2xl:mt-5 2xl:space-y-4">
        <InfoItem
          label="Prochain RDV"
          value="12 Juin 2026, 10:00"
          detail="Consultation"
        />
        <InfoItem
          label="Solde impayé"
          value={formatBalance(selectedPatient.balance)}
          danger
        />
        <InfoItem label="Groupe sanguin" value="O+" />
        <InfoItem label="Allergies" value="Aucune connue" />
        <InfoItem label="Notes médicales" value="Aucune note" />
      </dl>

      <div className="mt-4 grid gap-3 2xl:mt-6">
        <ProfileAction label="Voir dossier" icon={FolderOpen} tone="teal" />
        <ProfileAction label="Ajouter paiement" icon={CreditCard} tone="blue" />
        <ProfileAction label="Nouvelle ordonnance" icon={FileText} tone="purple" />
      </div>
    </aside>
  );
}

function InfoItem({
  label,
  value,
  detail,
  danger = false,
}: {
  label: string;
  value: string;
  detail?: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</dt>
      <dd className={cx("mt-1 text-sm font-bold", danger ? "text-[#EF4444]" : "text-[#0F172A]")}>
        {value}
      </dd>
      {detail ? <dd className="mt-0.5 text-xs font-semibold text-[#64748B]">{detail}</dd> : null}
    </div>
  );
}

function ProfileAction({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon: IconComponent;
  tone: "teal" | "blue" | "purple";
}) {
  const tones = {
    teal: "bg-teal-50 text-[#0F766E] hover:border-[#0F766E]/30",
    blue: "bg-blue-50 text-[#2563EB] hover:border-[#2563EB]/30",
    purple: "bg-violet-50 text-[#7C3AED] hover:border-violet-400/40",
  };

  return (
    <button
      type="button"
      className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className={cx("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-bold text-[#0F172A]">{label}</span>
    </button>
  );
}

export default function PatientsPage() {
  return (
    <>
      <PageActions />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs patients">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <FiltersCard />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-6">
        <PatientsTable />
        <QuickProfilePanel />
      </section>
    </>
  );
}
