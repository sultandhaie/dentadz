"use client";

import type { ComponentType, SVGProps } from "react";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  DoorOpen,
  Eye,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  Stethoscope,
  Upload,
  User,
  UserRound,
  X,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type AppointmentStatus =
  | "Confirmé"
  | "En attente"
  | "En consultation"
  | "Terminé"
  | "Annulé"
  | "Absent"
  | "Reporté";

type Stat = {
  label: string;
  value: string;
  trend: string;
  icon: IconComponent;
  accent: string;
};

type Appointment = {
  id: string;
  day: "Lun" | "Mar" | "Mer" | "Jeu" | "Ven" | "Sam";
  time: string;
  patient: string;
  treatment: string;
  dentist: string;
  status: AppointmentStatus;
  color: "blue" | "orange" | "purple" | "green" | "red";
};

type PlanningRow = {
  time: string;
  patient: string;
  treatment: string;
  dentist: string;
  status: AppointmentStatus;
};

const stats: Stat[] = [
  {
    label: "Rendez-vous aujourd’hui",
    value: "18",
    trend: "+4 vs hier",
    icon: CalendarDays,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    label: "Confirmés",
    value: "12",
    trend: "67% des rendez-vous",
    icon: CheckCircle2,
    accent: "from-[#22C55E] to-[#86EFAC]",
  },
  {
    label: "En attente",
    value: "4",
    trend: "À confirmer",
    icon: Clock3,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
  {
    label: "Annulés / Absents",
    value: "2",
    trend: "Aujourd’hui",
    icon: AlertTriangle,
    accent: "from-[#EF4444] to-[#FB7185]",
  },
];

const days = [
  { key: "Lun", label: "Lun 08", today: false },
  { key: "Mar", label: "Mar 09", today: false },
  { key: "Mer", label: "Mer 10", today: false },
  { key: "Jeu", label: "Jeu 11", today: false },
  { key: "Ven", label: "Ven 12", today: true },
  { key: "Sam", label: "Sam 13", today: false },
] as const;

const timeRows = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

const appointments: Appointment[] = [
  {
    id: "RDV-000245",
    day: "Lun",
    time: "09:00",
    patient: "Ahmed Benali",
    treatment: "Détartrage",
    dentist: "Dr Benali",
    status: "Confirmé",
    color: "blue",
  },
  {
    id: "RDV-000246",
    day: "Mar",
    time: "10:30",
    patient: "Sara Khaldi",
    treatment: "Consultation",
    dentist: "Dr Amrani",
    status: "En attente",
    color: "orange",
  },
  {
    id: "RDV-000247",
    day: "Mer",
    time: "14:00",
    patient: "Mohamed Amrani",
    treatment: "Extraction",
    dentist: "Dr Amrani",
    status: "En consultation",
    color: "purple",
  },
  {
    id: "RDV-000248",
    day: "Jeu",
    time: "11:00",
    patient: "Lina Cherif",
    treatment: "Orthodontie",
    dentist: "Dr Benali",
    status: "Confirmé",
    color: "blue",
  },
  {
    id: "RDV-000249",
    day: "Ven",
    time: "12:00",
    patient: "Yacine Saadi",
    treatment: "Plombage",
    dentist: "Dr Cherif",
    status: "Terminé",
    color: "green",
  },
];

const planningRows: PlanningRow[] = [
  {
    time: "09:00",
    patient: "Ahmed Benali",
    treatment: "Détartrage",
    dentist: "Dr Benali",
    status: "Confirmé",
  },
  {
    time: "09:30",
    patient: "Sara Khaldi",
    treatment: "Consultation",
    dentist: "Dr Amrani",
    status: "En attente",
  },
  {
    time: "10:00",
    patient: "Mohamed Amrani",
    treatment: "Extraction",
    dentist: "Dr Amrani",
    status: "En consultation",
  },
  {
    time: "11:00",
    patient: "Lina Cherif",
    treatment: "Orthodontie",
    dentist: "Dr Benali",
    status: "Confirmé",
  },
  {
    time: "12:00",
    patient: "Yacine Saadi",
    treatment: "Plombage",
    dentist: "Dr Cherif",
    status: "Terminé",
  },
];

const miniCalendarDays = Array.from({ length: 35 }, (_, index) => {
  const date = index + 1;
  return {
    label: date <= 30 ? String(date) : String(date - 30),
    muted: date > 30,
    selected: date === 12,
    hasAppointment: [9, 10, 12, 13].includes(date),
  };
});

const selectedAppointment = appointments[0];

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

function getStatusClasses(status: AppointmentStatus) {
  const classes: Record<AppointmentStatus, string> = {
    Confirmé: "bg-blue-50 text-blue-700 border-blue-200",
    "En attente": "bg-orange-50 text-orange-700 border-orange-200",
    "En consultation": "bg-purple-50 text-purple-700 border-purple-200",
    Terminé: "bg-green-50 text-green-700 border-green-200",
    Annulé: "bg-red-50 text-red-700 border-red-200",
    Absent: "bg-rose-50 text-rose-700 border-rose-200",
    Reporté: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return classes[status];
}

function getAppointmentCardClasses(color: Appointment["color"]) {
  const classes = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    orange: "border-orange-200 bg-orange-50 text-orange-800",
    purple: "border-purple-200 bg-purple-50 text-purple-800",
    green: "border-green-200 bg-green-50 text-green-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return classes[color];
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

function StatusBadge({ status }: { status: AppointmentStatus }) {
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

function PageActions() {
  return (
    <section className="flex sm:justify-end">
      <div className="grid gap-2 sm:flex sm:justify-end">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau rendez-vous
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

function StatCard({ stat }: { stat: Stat }) {
  return (
    <article className="group rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.10)] 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#64748B]">{stat.label}</p>
          <p className="mt-2 text-xl font-bold text-[#0F172A] 2xl:mt-3 2xl:text-3xl">
            {stat.value}
          </p>
        </div>
        <span
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105 2xl:h-11 2xl:w-11",
            stat.accent,
          )}
        >
          <stat.icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs font-bold text-[#64748B] 2xl:mt-4">{stat.trend}</p>
    </article>
  );
}

function CalendarToolbar() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl bg-[#0F766E] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20"
          >
            Aujourd’hui
          </button>
          <IconButton label="Semaine précédente" icon={ChevronLeft} />
          <IconButton label="Semaine suivante" icon={ChevronRight} />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"
          >
            Juin 2026
            <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-3 rounded-xl border border-[#E2E8F0] bg-slate-50 p-1 text-sm font-bold">
          {["Jour", "Semaine", "Mois"].map((view) => (
            <button
              type="button"
              key={view}
              className={cx(
                "rounded-lg px-3 py-2 transition",
                view === "Semaine"
                  ? "bg-white text-[#0F766E] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <FilterButton label="Tous les dentistes" />
        <FilterButton label="Tous" />
        <FilterButton label="Tous les traitements" />
      </div>
    </div>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
    >
      <span className="truncate">{label}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
    </button>
  );
}

function WeeklyCalendar() {
  return (
    <article className={panelClass}>
      <CalendarToolbar />

      <div className="mt-4 overflow-x-auto 2xl:mt-5">
        <div className="min-w-[820px] overflow-hidden rounded-2xl border border-[#E2E8F0]">
          <div className="grid grid-cols-[70px_repeat(6,minmax(125px,1fr))] bg-slate-50">
            <div className="border-b border-r border-[#E2E8F0] px-3 py-3 text-xs font-bold uppercase text-[#64748B]">
              Heure
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className="border-b border-r border-[#E2E8F0] px-3 py-3 text-center text-sm font-bold text-[#0F172A] last:border-r-0"
              >
                {day.today ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[#0F766E] ring-1 ring-teal-100">
                    Ven
                    <span className="rounded-full bg-[#0F766E] px-2 py-0.5 text-xs text-white">
                      12
                    </span>
                  </span>
                ) : (
                  day.label
                )}
              </div>
            ))}
          </div>

          {timeRows.map((time) => (
            <div
              key={time}
              className="grid min-h-16 grid-cols-[70px_repeat(6,minmax(125px,1fr))] border-b border-[#E2E8F0] last:border-b-0"
            >
              <div className="border-r border-[#E2E8F0] bg-slate-50/60 px-3 py-3 text-xs font-bold text-[#64748B]">
                {time}
              </div>
              {days.map((day) => {
                const cellAppointment = appointments.find(
                  (appointment) =>
                    appointment.day === day.key &&
                    appointment.time.slice(0, 2) === time.slice(0, 2),
                );

                return (
                  <div
                    key={`${day.key}-${time}`}
                    className="group min-h-16 border-r border-[#E2E8F0] p-2 transition hover:bg-teal-50/40 last:border-r-0"
                  >
                    {cellAppointment ? (
                      <AppointmentCalendarCard appointment={cellAppointment} />
                    ) : (
                      <span className="hidden text-xs font-bold text-[#0F766E] opacity-0 transition group-hover:inline group-hover:opacity-100">
                        + Ajouter RDV
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function AppointmentCalendarCard({ appointment }: { appointment: Appointment }) {
  return (
    <button
      type="button"
      className={cx(
        "w-full rounded-xl border p-2 text-left text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        getAppointmentCardClasses(appointment.color),
      )}
    >
      <p className="font-bold">{appointment.time}</p>
      <p className="mt-1 truncate font-bold">{appointment.patient}</p>
      <p className="truncate text-[11px] opacity-75">{appointment.treatment}</p>
      <span className="mt-2 inline-flex rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-bold">
        {appointment.status}
      </span>
    </button>
  );
}

function AppointmentDetails() {
  return (
    <article className={panelClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Détails du rendez-vous
          </h2>
          <p className="mt-1 text-sm font-medium text-[#64748B]">
            {selectedAppointment.id}
          </p>
        </div>
        <span className="h-3 w-3 rounded-full bg-[#2563EB] ring-4 ring-blue-50" />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-teal-50 p-3.5 2xl:mt-5 2xl:p-4">
        <Avatar name={selectedAppointment.patient} className="h-12 w-12 text-sm 2xl:h-14 2xl:w-14 2xl:text-base" />
        <div>
          <h3 className="text-base font-bold text-[#0F172A] 2xl:text-lg">
            {selectedAppointment.patient}
          </h3>
          <p className="text-sm font-semibold text-[#64748B]">
            #{selectedAppointment.id}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 2xl:mt-5 2xl:gap-3">
        <DetailItem icon={Calendar} label="Date" value="12 Juin 2026" />
        <DetailItem icon={Clock} label="Heure" value="09:00 - 09:30" />
        <DetailItem icon={UserRound} label="Dentiste" value="Dr Benali" />
        <DetailItem icon={Stethoscope} label="Traitement" value="Détartrage" />
        <DetailItem icon={CheckCircle} label="Statut" value="Confirmé" />
        <DetailItem icon={Phone} label="Téléphone" value="0555 22 33 44" />
        <DetailItem icon={DoorOpen} label="Salle" value="Cabinet 01" />
      </div>

      <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3.5 2xl:mt-5 2xl:p-4">
        <h3 className="text-sm font-bold text-[#0F172A]">Notes</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
          Douleur légère côté molaire droite.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 2xl:mt-5">
        <ActionButton label="Confirmer" icon={Check} tone="teal" />
        <ActionButton label="Déplacer" icon={CalendarClock} tone="blue" />
        <ActionButton label="Annuler" icon={X} tone="red" />
        <ActionButton label="Voir dossier patient" icon={User} tone="slate" />
      </div>
    </article>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#0F766E]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</p>
        <p className="text-sm font-bold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon: IconComponent;
  tone: "teal" | "blue" | "red" | "slate";
}) {
  const tones = {
    teal: "bg-[#0F766E] text-white shadow-lg shadow-teal-700/20",
    blue: "border border-blue-200 bg-blue-50 text-[#2563EB]",
    red: "border border-red-200 bg-red-50 text-[#EF4444]",
    slate: "border border-slate-200 bg-slate-50 text-[#0F172A]",
  };

  return (
    <button
      type="button"
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md",
        tones[tone],
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

function MiniCalendar() {
  return (
    <article className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <IconButton label="Mois précédent" icon={ChevronLeft} />
        <h2 className="text-base font-bold text-[#0F172A]">Juin 2026</h2>
        <IconButton label="Mois suivant" icon={ChevronRight} />
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#64748B]">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <span key={day} className="py-2">
            {day}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {miniCalendarDays.map((day, index) => (
          <button
            type="button"
            key={`${day.label}-${index}`}
            className={cx(
              "relative flex h-9 items-center justify-center rounded-xl text-sm font-bold transition",
              day.selected
                ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20"
                : day.muted
                  ? "text-slate-300 hover:bg-slate-50"
                  : "text-[#0F172A] hover:bg-teal-50",
            )}
          >
            {day.label}
            {day.hasAppointment ? (
              <span
                className={cx(
                  "absolute bottom-1 h-1 w-1 rounded-full",
                  day.selected ? "bg-white" : "bg-[#2563EB]",
                )}
              />
            ) : null}
          </button>
        ))}
      </div>
    </article>
  );
}

function PlanningTable() {
  return (
    <article className={panelClass}>
      <div className="mb-3 flex items-center justify-between gap-3 2xl:mb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold text-[#0F172A]">Planning du jour</h2>
        </div>
        <a href="#" className="text-sm font-bold text-[#0F766E] hover:text-[#115E59]">
          Voir tout le planning →
        </a>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs font-bold text-[#64748B]">
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Heure</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Patient</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Traitement</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Dentiste</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Statut</th>
              <th className="border-b border-[#E2E8F0] pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {planningRows.map((row) => (
              <tr key={`${row.time}-${row.patient}`} className="transition hover:bg-slate-50">
                <td className="border-b border-slate-100 py-4 pr-4 font-bold text-[#0F172A]">
                  {row.time}
                </td>
                <td className="border-b border-slate-100 py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={row.patient} className="h-9 w-9 text-xs" />
                    <span className="font-bold text-[#0F172A]">{row.patient}</span>
                  </div>
                </td>
                <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">
                  {row.treatment}
                </td>
                <td className="border-b border-slate-100 py-4 pr-4 font-semibold text-[#0F172A]">
                  {row.dentist}
                </td>
                <td className="border-b border-slate-100 py-4 pr-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="border-b border-slate-100 py-4">
                  <div className="flex items-center gap-1">
                    <IconButton label={`Voir ${row.patient}`} icon={Eye} />
                    <IconButton label={`Modifier ${row.patient}`} icon={Pencil} />
                    <IconButton label={`Confirmer ${row.patient}`} icon={CheckCircle} />
                    <IconButton label={`Plus d’actions pour ${row.patient}`} icon={MoreVertical} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MobileAppointmentCards />
    </article>
  );
}

function MobileAppointmentCards() {
  return (
    <div className="grid gap-3 md:hidden">
      {planningRows.map((row) => (
        <article
          key={`${row.time}-${row.patient}`}
          className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{row.time}</p>
              <h3 className="mt-1 font-bold text-[#0F172A]">{row.patient}</h3>
              <p className="text-sm font-medium text-[#64748B]">{row.treatment}</p>
              <p className="mt-1 text-sm font-semibold text-[#0F766E]">{row.dentist}</p>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
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
          </div>
        </article>
      ))}
    </div>
  );
}

function IconButton({ label, icon: Icon }: { label: string; icon: IconComponent }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#0F766E]/40 hover:bg-teal-50 hover:text-[#0F766E]"
      aria-label={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export default function RendezVousPage() {
  return (
    <section className="space-y-5">
      <PageActions />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques rendez-vous">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-5">
        <section className="space-y-4 2xl:space-y-5">
          <WeeklyCalendar />
          <PlanningTable />
        </section>
        <aside className="space-y-4 2xl:space-y-5">
          <AppointmentDetails />
          <MiniCalendar />
        </aside>
      </div>
    </section>
  );
}
