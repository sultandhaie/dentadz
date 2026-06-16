"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCw,
  Stethoscope,
  UserCheck,
  Users,
  Volume2,
} from "lucide-react";
import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type QueueStatus =
  | "En attente"
  | "En consultation"
  | "Prochain"
  | "Terminé"
  | "Absent";

type QueuePatient = {
  id: string;
  order: number;
  name: string;
  phone: string;
  patientCode: string;
  appointmentTime: string;
  appointmentLabel: string;
  treatment: string;
  waitingTime: string;
  status: QueueStatus;
};

type RecentCall = {
  id: string;
  time: string;
  patient: string;
  treatment: string;
  status: "Terminé" | "Absent";
  calledBy: string;
};

type DailyStat = {
  label: string;
  value: string;
  tone: "teal" | "blue" | "green" | "red" | "orange";
};

type WaitingRoomEntry = {
  id: number;
  queue_number: number;
  patient_id: number;
  appointment_id: number;
  appointment_time: string;
  appointment_label: string;
  treatment: string;
  waiting_time: string;
  status: string;
  estimated_price: number;
  patient: { first_name: string; last_name: string; phone: string; patient_code: string };
  appointment?: Record<string, unknown>;
};

type StatsResponse = {
  waiting?: number;
  in_consultation?: number;
  next?: number;
  completed?: number;
  waiting_count?: number;
  in_consultation_count?: number;
  next_count?: number;
  completed_count?: number;
};

function mapApiStatus(raw: string): QueueStatus {
  const map: Record<string, QueueStatus> = {
    waiting: "En attente",
    "En attente": "En attente",
    in_consultation: "En consultation",
    "En consultation": "En consultation",
    next: "Prochain",
    Prochain: "Prochain",
    completed: "Terminé",
    Terminé: "Terminé",
    absent: "Absent",
    Absent: "Absent",
  };
  return map[raw] ?? "En attente";
}

function mapApiEntry(entry: WaitingRoomEntry, index: number): QueuePatient {
  return {
    id: String(entry.id),
    order: entry.queue_number ?? index + 1,
    name: `${entry.patient.first_name} ${entry.patient.last_name}`,
    phone: entry.patient.phone,
    patientCode: entry.patient.patient_code,
    appointmentTime: entry.appointment_time,
    appointmentLabel: entry.appointment_label,
    treatment: entry.treatment,
    waitingTime: entry.waiting_time ?? "—",
    status: mapApiStatus(entry.status),
  };
}

const statsTemplate = [
  {
    title: "En attente",
    label: "patients",
    icon: Users,
    accent: "from-[#0F766E] to-[#2DD4BF]",
  },
  {
    title: "En consultation",
    label: "patients",
    icon: Stethoscope,
    accent: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    title: "Prochains",
    label: "patients",
    icon: Clock3,
    accent: "from-[#F59E0B] to-[#FDBA74]",
  },
  {
    title: "Terminés aujourd\u2019hui",
    label: "patients",
    icon: CheckCircle2,
    accent: "from-[#7C3AED] to-[#A78BFA]",
  },
];

const recentCalls: RecentCall[] = [
  {
    id: "CALL-001",
    time: "09:00",
    patient: "Ahmed Benali",
    treatment: "Détartrage",
    status: "Terminé",
    calledBy: "Réceptionniste",
  },
  {
    id: "CALL-002",
    time: "08:30",
    patient: "Imane Ferhat",
    treatment: "Consultation",
    status: "Terminé",
    calledBy: "Réceptionniste",
  },
  {
    id: "CALL-003",
    time: "08:00",
    patient: "Rachid Hassaine",
    treatment: "Plombage",
    status: "Absent",
    calledBy: "Réceptionniste",
  },
];

const dailyStats: DailyStat[] = [
  { label: "Total rendez-vous", value: "18", tone: "teal" },
  { label: "Arrivés", value: "15", tone: "blue" },
  { label: "En consultation", value: "2", tone: "orange" },
  { label: "Terminés", value: "12", tone: "green" },
  { label: "Annulés / Absents", value: "1", tone: "red" },
];

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

function getStatusClasses(status: QueueStatus | RecentCall["status"]) {
  const classes: Record<QueueStatus, string> = {
    "En attente": "border-orange-200 bg-orange-50 text-orange-700",
    "En consultation": "border-purple-200 bg-purple-50 text-purple-700",
    Prochain: "border-blue-200 bg-blue-50 text-blue-700",
    Terminé: "border-green-200 bg-green-50 text-green-700",
    Absent: "border-red-200 bg-red-50 text-red-700",
  };

  return classes[status];
}

function getOrderBadgeClasses(order: number) {
  const classes: Record<number, string> = {
    1: "bg-orange-50 text-orange-700 ring-orange-100",
    2: "bg-purple-50 text-purple-700 ring-purple-100",
    3: "bg-blue-50 text-blue-700 ring-blue-100",
    4: "bg-green-50 text-green-700 ring-green-100",
    5: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return classes[order] ?? classes[5];
}

function getActionButtonLabel(status: QueueStatus) {
  return status === "En consultation" ? "En consultation" : "Appeler";
}

function getStatDotClass(tone: DailyStat["tone"]) {
  const classes: Record<DailyStat["tone"], string> = {
    teal: "bg-[#0F766E]",
    blue: "bg-[#2563EB]",
    green: "bg-[#22C55E]",
    red: "bg-[#EF4444]",
    orange: "bg-[#F59E0B]",
  };

  return classes[tone];
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

function StatusBadge({ status }: { status: QueueStatus | RecentCall["status"] }) {
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
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-xl font-bold text-[#0F172A] 2xl:text-3xl">{value}</p>
            <p className="text-xs font-bold text-[#64748B]">{label}</p>
          </div>
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

function QueueActionButton({
  patient,
  onCallNext,
  onComplete,
}: {
  patient: QueuePatient;
  onCallNext: () => void;
  onComplete: (id: string) => void;
}) {
  const inConsultation = patient.status === "En consultation";
  const Icon = inConsultation ? UserCheck : Volume2;

  const handleClick = () => {
    if (inConsultation) {
      onComplete(patient.id);
    } else {
      onCallNext();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cx(
        "inline-flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition-all duration-200",
        inConsultation
          ? "border border-teal-200 bg-teal-50 text-[#0F766E] hover:border-[#0F766E]/50 hover:bg-teal-100"
          : "bg-[#0F766E] text-white shadow-lg shadow-teal-700/20 hover:bg-[#115E59]",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {getActionButtonLabel(patient.status)}
    </button>
  );
}

function WaitingQueueCard({
  queuePatients,
  onRefresh,
  onCallNext,
  onComplete,
}: {
  queuePatients: QueuePatient[];
  onRefresh: () => void;
  onCallNext: () => void;
  onComplete: (id: string) => void;
}) {
  return (
    <article className={panelClass}>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">File d\u2019attente</h2>
          <p className="text-sm font-medium text-[#64748B]">
            Patients arrivés et ordre de passage.
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition-all duration-200 hover:bg-[#115E59]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter patient sans RDV
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition-all duration-200 hover:border-[#0F766E]/40 hover:bg-teal-50"
          >
            <RefreshCw className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
            Actualiser
          </button>
        </div>
      </div>

      <QueueDesktopTable
        queuePatients={queuePatients}
        onCallNext={onCallNext}
        onComplete={onComplete}
      />
      <QueueMobileCards
        queuePatients={queuePatients}
        onCallNext={onCallNext}
        onComplete={onComplete}
      />

      <a
        href="#"
        className="mx-auto mt-4 inline-flex w-full items-center justify-center text-sm font-bold text-[#0F766E] transition hover:text-[#115E59]"
      >
        Voir toute la file d\u2019attente →
      </a>
    </article>
  );
}

function QueueDesktopTable({
  queuePatients,
  onCallNext,
  onComplete,
}: {
  queuePatients: QueuePatient[];
  onCallNext: () => void;
  onComplete: (id: string) => void;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-xs font-bold text-[#64748B]">
            <th className="border-b border-[#E2E8F0] pb-3 pr-3">Ordre</th>
            <th className="border-b border-[#E2E8F0] pb-3 pr-3">Patient</th>
            <th className="border-b border-[#E2E8F0] pb-3 pr-3">Rendez-vous</th>
            <th className="border-b border-[#E2E8F0] pb-3 pr-3">Traitement</th>
            <th className="border-b border-[#E2E8F0] pb-3 pr-3">Arrivé depuis</th>
            <th className="border-b border-[#E2E8F0] pb-3 pr-3">Statut</th>
            <th className="border-b border-[#E2E8F0] pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {queuePatients.map((patient) => (
            <tr key={patient.id} className="transition-all duration-200 hover:bg-slate-50">
              <td className="border-b border-slate-100 py-3 pr-3">
                <span
                  className={cx(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1",
                    getOrderBadgeClasses(patient.order),
                  )}
                >
                  {patient.order}
                </span>
              </td>
              <td className="border-b border-slate-100 py-3 pr-3">
                <div className="flex items-center gap-3">
                  <Avatar name={patient.name} className="h-9 w-9 text-xs" />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#0F172A]">{patient.name}</p>
                    <p className="text-xs font-semibold text-[#64748B]">{patient.phone}</p>
                  </div>
                </div>
              </td>
              <td className="border-b border-slate-100 py-3 pr-3 font-medium text-[#64748B]">
                {patient.appointmentLabel}
              </td>
              <td className="border-b border-slate-100 py-3 pr-3 font-semibold text-[#0F172A]">
                {patient.treatment}
              </td>
              <td className="border-b border-slate-100 py-3 pr-3 font-bold text-[#0F172A]">
                {patient.waitingTime}
              </td>
              <td className="border-b border-slate-100 py-3 pr-3">
                <StatusBadge status={patient.status} />
              </td>
              <td className="border-b border-slate-100 py-3">
                <div className="flex items-center gap-2">
                  <QueueActionButton
                    patient={patient}
                    onCallNext={onCallNext}
                    onComplete={onComplete}
                  />
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-all duration-200 hover:border-[#0F766E]/40 hover:bg-teal-50 hover:text-[#0F766E]"
                    aria-label={`Plus d\u2019actions pour ${patient.name}`}
                  >
                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QueueMobileCards({
  queuePatients,
  onCallNext,
  onComplete,
}: {
  queuePatients: QueuePatient[];
  onCallNext: () => void;
  onComplete: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 md:hidden">
      {queuePatients.map((patient) => (
        <article
          key={patient.id}
          className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span
              className={cx(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1",
                getOrderBadgeClasses(patient.order),
              )}
            >
              {patient.order}
            </span>
            <Avatar name={patient.name} className="h-11 w-11" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-[#0F172A]">{patient.name}</h3>
                  <p className="text-xs font-semibold text-[#64748B]">{patient.phone}</p>
                </div>
                <StatusBadge status={patient.status} />
              </div>
              <div className="mt-3 grid gap-1.5 text-sm font-medium text-[#64748B]">
                <p>
                  RDV: <span className="font-bold text-[#0F172A]">{patient.appointmentLabel}</span>
                </p>
                <p>
                  Traitement: <span className="font-bold text-[#0F172A]">{patient.treatment}</span>
                </p>
                <p>
                  Attente: <span className="font-bold text-[#0F172A]">{patient.waitingTime}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_44px] gap-2">
            <QueueActionButton
              patient={patient}
              onCallNext={onCallNext}
              onComplete={onComplete}
            />
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B]"
              aria-label={`Plus d\u2019actions pour ${patient.name}`}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function CurrentConsultationCard({
  patient,
  onComplete,
}: {
  patient: QueuePatient | undefined;
  onComplete: (id: string) => void;
}) {
  if (!patient) return null;

  return (
    <article className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0F172A]">Patient en consultation</h2>
        <span className="h-3 w-3 rounded-full bg-[#22C55E] ring-4 ring-green-50" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-green-50 via-white to-teal-50 p-3.5">
        <Avatar name={patient.name} className="h-12 w-12 text-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[#0F172A]">{patient.name}</h3>
          <p className="text-sm font-semibold text-[#64748B]">{patient.treatment}</p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100">
          {patient.waitingTime}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onComplete(patient.id)}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition-all duration-200 hover:bg-red-50"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Terminer la consultation
      </button>
    </article>
  );
}

function NextPatientCard({
  patient,
  onStart,
}: {
  patient: QueuePatient | undefined;
  onStart: (id: string, patientCode: string) => void;
}) {
  if (!patient) return null;

  return (
    <article className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0F172A]">Prochain patient</h2>
        <span className="h-3 w-3 rounded-full bg-[#2563EB] ring-4 ring-blue-50" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-3.5">
        <Avatar name={patient.name} className="h-12 w-12 text-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[#0F172A]">{patient.name}</h3>
          <p className="text-sm font-semibold text-[#64748B]">{patient.treatment}</p>
        </div>
        <span className="text-xs font-bold text-[#2563EB]">RDV à {patient.appointmentTime}</span>
      </div>
      <button
        type="button"
        onClick={() => onStart(patient.id, patient.patientCode)}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white text-sm font-bold text-[#2563EB] transition-all duration-200 hover:bg-blue-50"
      >
        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
        Préparer
      </button>
    </article>
  );
}

function DailyStatsCard() {
  return (
    <article className={panelClass}>
      <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">Statistiques du jour</h2>
      <dl className="space-y-3">
        {dailyStats.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3"
          >
            <dt className="flex min-w-0 items-center gap-2 text-sm font-bold text-[#64748B]">
              <span className={cx("h-2.5 w-2.5 rounded-full", getStatDotClass(item.tone))} />
              <span className="truncate">{item.label}</span>
            </dt>
            <dd className="text-sm font-bold text-[#0F172A]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function TipCard() {
  return (
    <aside className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-[#0F172A]">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold">Astuce</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#0F766E]">
            Utilisez le bouton \u201CAppeler\u201D pour notifier le patient via l\u2019écran d\u2019appel en salle d\u2019attente.
          </p>
        </div>
      </div>
    </aside>
  );
}

function ToothWatermark() {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      className="absolute -right-3 top-4 h-28 w-28 text-white/20"
      aria-hidden="true"
    >
      <path
        d="M21 5.25c2.36-1.3 6.75-2.08 10.31 1.67 3.68 3.87 3.12 10.88.12 15.95-1.58 2.67-2.07 5.77-2.52 8.62-.53 3.35-1.03 6.51-3.5 6.51-1.86 0-2.48-2.47-3.04-4.68-.43-1.73-.83-3.32-1.37-3.32s-.94 1.59-1.37 3.32C19.07 35.53 18.45 38 16.59 38c-2.47 0-2.97-3.16-3.5-6.51-.45-2.85-.94-5.95-2.52-8.62-3-5.07-3.56-12.08.12-15.95C14.25 3.17 18.64 3.95 21 5.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CallScreenCard({
  patient,
  onCall,
}: {
  patient: QueuePatient | undefined;
  onCall: () => void;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-[#0F766E] to-[#2563EB] p-4 text-white shadow-[0_20px_45px_rgba(15,118,110,0.18)] 2xl:p-5">
      <ToothWatermark />
      <div className="relative">
        <h2 className="text-lg font-semibold">Écran d\u2019appel</h2>
        <p className="mt-4 text-xs font-bold uppercase text-white/70">Patient à appeler</p>
        <h3 className="mt-1 text-2xl font-bold">{patient?.name ?? "Aucun patient"}</h3>
        <p className="mt-1 text-sm font-semibold text-white/80">{patient?.treatment ?? ""}</p>
        <button
          type="button"
          onClick={onCall}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#0F766E] shadow-lg transition-all duration-200 hover:bg-teal-50"
        >
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          APPELER MAINTENANT
        </button>
      </div>
    </article>
  );
}

function RecentCallsCard() {
  return (
    <article className={panelClass}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#0F172A]">Derniers appels</h2>
        <p className="text-sm font-medium text-[#64748B]">Historique récent de la salle.</p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs font-bold text-[#64748B]">
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Heure</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Patient</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Rendez-vous</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Statut</th>
              <th className="border-b border-[#E2E8F0] pb-3">Appelé par</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call) => (
              <tr key={call.id} className="transition-all duration-200 hover:bg-slate-50">
                <td className="border-b border-slate-100 py-3 pr-4 font-bold text-[#0F172A]">
                  {call.time}
                </td>
                <td className="border-b border-slate-100 py-3 pr-4 font-bold text-[#0F172A]">
                  {call.patient}
                </td>
                <td className="border-b border-slate-100 py-3 pr-4 font-medium text-[#64748B]">
                  {call.treatment}
                </td>
                <td className="border-b border-slate-100 py-3 pr-4">
                  <StatusBadge status={call.status} />
                </td>
                <td className="border-b border-slate-100 py-3 font-medium text-[#64748B]">
                  {call.calledBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {recentCalls.map((call) => (
          <article key={call.id} className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-[#0F172A]">{call.time}</p>
                <h3 className="mt-1 font-bold text-[#0F172A]">{call.patient}</h3>
                <p className="text-sm font-medium text-[#64748B]">{call.treatment}</p>
                <p className="mt-1 text-xs font-bold text-[#64748B]">{call.calledBy}</p>
              </div>
              <StatusBadge status={call.status} />
            </div>
          </article>
        ))}
      </div>

      <a
        href="#"
        className="mx-auto mt-4 inline-flex w-full items-center justify-center text-sm font-bold text-[#0F766E] transition hover:text-[#115E59]"
      >
        Voir tout l\u2019historique →
      </a>
    </article>
  );
}

export default function SalleAttentePage() {
  const router = useRouter();
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([]);
  const [statsValues, setStatsValues] = useState<Record<string, string>>({
    "En attente": "0",
    "En consultation": "0",
    Prochains: "0",
    "Terminés aujourd\u2019hui": "0",
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [roomData, statsData] = await Promise.all([
        api<{ data: WaitingRoomEntry[]; meta?: Record<string, unknown> }>("/waiting-room"),
        api<StatsResponse>("/waiting-room/stats"),
      ]);

      const mapped = roomData.data.map((entry, index) => mapApiEntry(entry, index));
      setQueuePatients(mapped);

      setStatsValues({
        "En attente": String(
          statsData.waiting ?? statsData.waiting_count ?? 0,
        ),
        "En consultation": String(
          statsData.in_consultation ?? statsData.in_consultation_count ?? 0,
        ),
        Prochains: String(statsData.next ?? statsData.next_count ?? 0),
        "Terminés aujourd\u2019hui": String(
          statsData.completed ?? statsData.completed_count ?? 0,
        ),
      });
    } catch (err) {
      console.error("Failed to fetch waiting room data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCallNext = async () => {
    try {
      await api("/waiting-room/call-next", { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Failed to call next patient:", err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api(`/waiting-room/${id}/complete`, { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Failed to complete consultation:", err);
    }
  };

  const handleStart = async (id: string, patientCode: string) => {
    try {
      await api(`/waiting-room/${id}/start`, { method: "POST" });
      router.push(`/patients/${patientCode}?consultation=active`);
    } catch (err) {
      console.error("Failed to start preparation:", err);
    }
  };

  const currentConsultation = queuePatients.find(
    (p) => p.status === "En consultation",
  );
  const nextPatient = queuePatients.find((p) => p.status === "Prochain");
  const firstWaiting = queuePatients.find((p) => p.status === "En attente");

  if (loading) {
    return (
      <section className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F766E]" />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Statistiques salle d\u2019attente"
      >
        {statsTemplate.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            value={statsValues[stat.title] ?? "0"}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-5">
        <section className="space-y-4 2xl:space-y-5">
          <WaitingQueueCard
            queuePatients={queuePatients}
            onRefresh={fetchData}
            onCallNext={handleCallNext}
            onComplete={handleComplete}
          />
          <RecentCallsCard />
        </section>
        <aside className="space-y-4 2xl:space-y-5">
          <CurrentConsultationCard
            patient={currentConsultation}
            onComplete={handleComplete}
          />
          <NextPatientCard patient={nextPatient} onStart={handleStart} />
          <DailyStatsCard />
          <TipCard />
          <CallScreenCard patient={firstWaiting} onCall={handleCallNext} />
        </aside>
      </div>
    </section>
  );
}
