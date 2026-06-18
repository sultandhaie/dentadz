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
  Search,
  Stethoscope,
  UserCheck,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { api } from "../../lib/api";

type PatientOption = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
};

type TreatmentOption = {
  id: number;
  name: string;
  price: number;
  category?: string;
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type QueueStatus =
  | "En attente"
  | "En consultation"
  | "Prochain"
  | "Arrivé"
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
  appointmentId?: number;
  patientId?: number;
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
  en_attente?: number;
  en_consultation?: number;
  prochain?: number;
  termine?: number;
  absent?: number;
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
    "Arrivé": "Arrivé",
    arrived: "Arrivé",
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
    patientId: entry.patient_id,
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
    title: "Terminés aujourd'hui",
    label: "patients",
    icon: CheckCircle2,
    accent: "from-[#7C3AED] to-[#A78BFA]",
  },
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

function getStatusClasses(status: QueueStatus) {
  const classes: Record<QueueStatus, string> = {
    "En attente": "border-orange-200 bg-orange-50 text-orange-700",
    "En consultation": "border-purple-200 bg-purple-50 text-purple-700",
    Prochain: "border-blue-200 bg-blue-50 text-blue-700",
    Arrivé: "border-teal-200 bg-teal-50 text-teal-700",
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
  if (status === "En attente") return "Appeler";
  if (status === "Arrivé") return "Appeler";
  if (status === "Prochain") return "Commencer";
  if (status === "En consultation") return "Terminer";
  return "";
}

function getStatDotClass(tone: "teal" | "blue" | "green" | "red" | "orange") {
  const classes: Record<string, string> = {
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

function StatusBadge({ status }: { status: QueueStatus }) {
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
  onStart,
}: {
  patient: QueuePatient;
  onCallNext: (patient?: QueuePatient) => void;
  onComplete: (id: string) => void;
  onStart: (id: string, patientCode: string) => void;
}) {
  const status = patient.status;
  if (status === "Terminé" || status === "Absent") return null;

  let label: string;
  let Icon: typeof Volume2;
  let className: string;

  if (status === "En attente") {
    label = "Appeler";
    Icon = Volume2;
    className = "bg-[#0F766E] text-white shadow-lg shadow-teal-700/20 hover:bg-[#115E59]";
  } else if (status === "Arrivé") {
    label = "Appeler";
    Icon = Volume2;
    className = "bg-[#0F766E] text-white shadow-lg shadow-teal-700/20 hover:bg-[#115E59]";
  } else if (status === "Prochain") {
    label = "Commencer";
    Icon = UserCheck;
    className = "border border-blue-200 bg-blue-50 text-[#2563EB] hover:border-[#2563EB]/50 hover:bg-blue-100";
  } else {
    label = "Terminer";
    Icon = CheckCircle2;
    className = "border border-teal-200 bg-teal-50 text-[#0F766E] hover:border-[#0F766E]/50 hover:bg-teal-100";
  }

  const handleClick = () => {
    if (status === "En attente" || status === "Arrivé") {
      onCallNext(patient);
    } else if (status === "Prochain") {
      onStart(patient.id, patient.patientCode);
    } else {
      onComplete(patient.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cx(
        "inline-flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition-all duration-200",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function AddPatientModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [treatments, setTreatments] = useState<TreatmentOption[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentOption | null>(null);
  const [appointmentTime, setAppointmentTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [appointmentLabel, setAppointmentLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || "";
    Promise.all([
      api<{ data: PatientOption[] }>("/patients?per_page=100", { token }),
      api<{ data: TreatmentOption[] }>("/treatments?per_page=200", { token }),
    ])
      .then(([patientsRes, treatmentsRes]) => {
        setPatients(patientsRes.data || []);
        setTreatments(treatmentsRes.data || []);
      })
      .catch(() => {});
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone.includes(patientSearch),
  );

  const filteredTreatments = treatments.filter((t) =>
    t.name.toLowerCase().includes(treatmentSearch.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!selectedId || !selectedTreatment) {
      setError("Veuillez sélectionner un patient et un traitement.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("auth_token") || "";
      await api("/waiting-room", {
        method: "POST",
        token,
        body: JSON.stringify({
          patient_id: selectedId,
          appointment_time: appointmentTime,
          appointment_label: appointmentLabel || selectedTreatment.name,
          treatment: selectedTreatment.name,
          estimated_price: selectedTreatment.price,
        }),
      });
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">Ajouter un patient sans RDV</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-[#EF4444]">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Patient</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-10 pr-3 text-sm font-medium text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
              />
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-[#E2E8F0] p-1">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setSelectedId(p.id); setPatientSearch(""); }}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                    selectedId === p.id
                      ? "bg-[#0F766E] text-white"
                      : "text-[#0F172A] hover:bg-slate-50",
                  )}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#64748B]">
                    {p.first_name[0]}{p.last_name[0]}
                  </span>
                  {p.first_name} {p.last_name}
                </button>
              ))}
              {filteredPatients.length === 0 && (
                <p className="py-2 text-center text-xs font-semibold text-[#64748B]">Aucun patient trouvé</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Traitement</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher un traitement..."
                value={treatmentSearch}
                onChange={(e) => setTreatmentSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-10 pr-3 text-sm font-medium text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
              />
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-[#E2E8F0] p-1">
              {filteredTreatments.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setSelectedTreatment(t); setTreatmentSearch(""); }}
                  className={cx(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                    selectedTreatment?.id === t.id
                      ? "bg-[#0F766E] text-white"
                      : "text-[#0F172A] hover:bg-slate-50",
                  )}
                >
                  <span>{t.name}</span>
                  <span className={cx(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    selectedTreatment?.id === t.id ? "bg-white/20 text-white" : "bg-teal-50 text-[#0F766E]",
                  )}>
                    {t.price.toLocaleString("fr-DZ")} DA
                  </span>
                </button>
              ))}
              {filteredTreatments.length === 0 && (
                <p className="py-2 text-center text-xs font-semibold text-[#64748B]">Aucun traitement trouvé</p>
              )}
            </div>
            {selectedTreatment && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-[#0F766E]">
                <span>Sélectionné : {selectedTreatment.name}</span>
                <span className="ml-auto font-bold">{selectedTreatment.price.toLocaleString("fr-DZ")} DA</span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Heure d'arrivée</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] py-2.5 px-3 text-sm font-medium text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Motif / Libellé (optionnel)</label>
            <input
              type="text"
              value={appointmentLabel}
              onChange={(e) => setAppointmentLabel(e.target.value)}
              placeholder={selectedTreatment?.name || "Saisir un libellé..."}
              className="w-full rounded-xl border border-[#E2E8F0] py-2.5 px-3 text-sm font-medium text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#E2E8F0] bg-white py-2.5 text-sm font-bold text-[#64748B] transition hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-xl bg-[#0F766E] py-2.5 text-sm font-bold text-white transition hover:bg-[#115E59] disabled:opacity-50"
          >
            {submitting ? "Ajout en cours..." : "Ajouter à la file"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WaitingQueueCard({
  queuePatients,
  onRefresh,
  onCallNext,
  onComplete,
  onStart,
}: {
  queuePatients: QueuePatient[];
  onRefresh: () => void;
  onCallNext: (patient?: QueuePatient) => void;
  onComplete: (id: string) => void;
  onStart: (id: string, patientCode: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <article className={panelClass}>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">File d'attente</h2>
          <p className="text-sm font-medium text-[#64748B]">
            Patients arrivés et ordre de passage.
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:justify-end">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
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

      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onAdded={() => {
            setShowAdd(false);
            onRefresh();
          }}
        />
      )}

      {queuePatients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-[#64748B]">
            <Users className="h-7 w-7" />
          </span>
          <p className="text-sm font-bold text-[#0F172A]">Aucun patient dans la file d'attente</p>
          <p className="text-xs font-semibold text-[#64748B]">Les patients arrivés apparaîtront ici.</p>
        </div>
      ) : (
        <>
          <QueueDesktopTable
            queuePatients={queuePatients}
            onCallNext={onCallNext}
            onComplete={onComplete}
            onStart={onStart}
          />
          <QueueMobileCards
            queuePatients={queuePatients}
            onCallNext={onCallNext}
            onComplete={onComplete}
            onStart={onStart}
          />
        </>
      )}
    </article>
  );
}

function QueueDesktopTable({
  queuePatients,
  onCallNext,
  onComplete,
  onStart,
}: {
  queuePatients: QueuePatient[];
  onCallNext: (patient?: QueuePatient) => void;
  onComplete: (id: string) => void;
  onStart: (id: string, patientCode: string) => void;
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
                    onStart={onStart}
                  />
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-all duration-200 hover:border-[#0F766E]/40 hover:bg-teal-50 hover:text-[#0F766E]"
                    aria-label={`Plus d'actions pour ${patient.name}`}
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
  onStart,
}: {
  queuePatients: QueuePatient[];
  onCallNext: (patient?: QueuePatient) => void;
  onComplete: (id: string) => void;
  onStart: (id: string, patientCode: string) => void;
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
              onStart={onStart}
            />
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B]"
              aria-label={`Plus d'actions pour ${patient.name}`}
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

function DailyStatsCard({ stats }: { stats: { label: string; value: string; tone: "teal" | "blue" | "green" | "red" | "orange" }[] }) {
  if (stats.length === 0) return null;

  return (
    <article className={panelClass}>
      <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">Statistiques du jour</h2>
      <dl className="space-y-3">
        {stats.map((item) => (
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
            Utilisez le bouton "Appeler" pour notifier le patient via l'écran d'appel en salle d'attente.
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
        <h2 className="text-lg font-semibold">Écran d'appel</h2>
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

function RecentCallsCard({ calls }: { calls: QueuePatient[] }) {
  if (calls.length === 0) {
    return (
      <article className={panelClass}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Derniers appels</h2>
          <p className="text-sm font-medium text-[#64748B]">Aucun appel récent.</p>
        </div>
      </article>
    );
  }

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
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Patient</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Traitement</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Statut</th>
              <th className="border-b border-[#E2E8F0] pb-3 pr-4">Heure</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="transition-all duration-200 hover:bg-slate-50">
                <td className="border-b border-slate-100 py-3 pr-4 font-bold text-[#0F172A]">
                  {call.name}
                </td>
                <td className="border-b border-slate-100 py-3 pr-4 font-medium text-[#64748B]">
                  {call.treatment}
                </td>
                <td className="border-b border-slate-100 py-3 pr-4">
                  <StatusBadge status={call.status} />
                </td>
                <td className="border-b border-slate-100 py-3 font-bold text-[#0F172A]">
                  {call.appointmentTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {calls.map((call) => (
          <article key={call.id} className="rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-[#0F172A]">{call.appointmentTime}</p>
                <h3 className="mt-1 font-bold text-[#0F172A]">{call.name}</h3>
                <p className="text-sm font-medium text-[#64748B]">{call.treatment}</p>
              </div>
              <StatusBadge status={call.status} />
            </div>
          </article>
        ))}
      </div>
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
    "Terminés aujourd'hui": "0",
  });
  const [loading, setLoading] = useState(true);
  const [recentCalls, setRecentCalls] = useState<QueuePatient[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [roomData, statsData, appointmentsData, completedData] = await Promise.all([
        api<{ data: WaitingRoomEntry[]; meta?: Record<string, unknown> }>("/waiting-room?per_page=100&exclude_terminated=1"),
        api<StatsResponse>("/waiting-room/stats"),
        api<{ data: { id: number; patient: { first_name: string; last_name: string; phone: string; patient_code: string; id: number }; start_time: string; treatment: string; status: string }[] }>(`/appointments?date=${today}&status=Arrivé&per_page=100`),
        api<{ data: WaitingRoomEntry[] }>("/waiting-room?per_page=10&completed_only=1"),
      ]);

      const mapped = roomData.data.map((entry, index) => mapApiEntry(entry, index));

      // Recent calls: Terminé and Absent entries for today
      const terminatedEntries = (completedData.data || [])
        .filter((e) => e.status === "Terminé" || e.status === "Absent")
        .sort((a, b) => (b.queue_number ?? 0) - (a.queue_number ?? 0))
        .slice(0, 10)
        .map((entry, i) => mapApiEntry(entry, i));
      setRecentCalls(terminatedEntries);

      const existingPatientIds = new Set(roomData.data.map((e) => e.patient_id));
      const arrivedFromAppointments = (appointmentsData.data || [])
        .filter((a) => !existingPatientIds.has(a.patient?.id))
        .map((a, i) => ({
          id: `apt-${a.id}`,
          order: mapped.length + i + 1,
          name: `${a.patient.first_name} ${a.patient.last_name}`,
          phone: a.patient.phone,
          patientCode: a.patient.patient_code,
          appointmentTime: a.start_time || "",
          appointmentLabel: `${a.patient.first_name} ${a.patient.last_name} - ${a.treatment}`,
          treatment: a.treatment,
          waitingTime: "—",
          status: "Arrivé" as QueueStatus,
          appointmentId: a.id,
          patientId: a.patient.id,
        }));

      // Sort: En consultation first, then Prochain, Arrivé, En attente
      const statusOrder: Record<string, number> = {
        "En consultation": 0,
        "Prochain": 1,
        "Arrivé": 2,
        "En attente": 3,
      };
      const allPatients = [...mapped, ...arrivedFromAppointments].sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 3;
        const orderB = statusOrder[b.status] ?? 3;
        if (orderA !== orderB) return orderA - orderB;
        const timeA = a.appointmentTime || "00:00";
        const timeB = b.appointmentTime || "00:00";
        return timeA.localeCompare(timeB);
      }).map((p, i) => ({ ...p, order: i + 1 }));

      setQueuePatients(allPatients);

      setStatsValues({
        "En attente": String(
          statsData.en_attente ?? statsData.waiting ?? statsData.waiting_count ?? 0,
        ),
        "En consultation": String(
          statsData.en_consultation ?? statsData.in_consultation ?? statsData.in_consultation_count ?? 0,
        ),
        Prochains: String(statsData.prochain ?? statsData.next ?? statsData.next_count ?? 0),
        "Terminés aujourd'hui": String(
          statsData.termine ?? statsData.completed ?? statsData.completed_count ?? 0,
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

  const handleCallNext = async (patient?: QueuePatient) => {
    try {
      if (patient?.status === "Arrivé" && patient.appointmentId) {
        await api("/waiting-room", {
          method: "POST",
          body: JSON.stringify({
            patient_id: patient.patientId || 0,
            appointment_id: patient.appointmentId,
            appointment_time: patient.appointmentTime,
            appointment_label: patient.appointmentLabel,
            treatment: patient.treatment,
            promote_to_prochain: true,
          }),
        });
      } else {
        await api("/waiting-room/call-next", { method: "POST" });
      }
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

  const recentCallsData = recentCalls;

  const dailyStatItems = [
    { label: "Total en file", value: String(queuePatients.length), tone: "teal" as const },
    { label: "En attente", value: statsValues["En attente"] || "0", tone: "blue" as const },
    { label: "En consultation", value: statsValues["En consultation"] || "0", tone: "orange" as const },
    { label: "Terminés", value: statsValues["Terminés aujourd'hui"] || "0", tone: "green" as const },
    { label: "Absents", value: String(queuePatients.filter((p) => p.status === "Absent").length), tone: "red" as const },
  ];

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
        aria-label="Statistiques salle d'attente"
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
            onStart={handleStart}
          />
          <RecentCallsCard calls={recentCallsData} />
        </section>
        <aside className="space-y-4 2xl:space-y-5">
          <CurrentConsultationCard
            patient={currentConsultation}
            onComplete={handleComplete}
          />
          <NextPatientCard patient={nextPatient} onStart={handleStart} />
          <DailyStatsCard stats={dailyStatItems} />
          <TipCard />
          <CallScreenCard patient={firstWaiting} onCall={handleCallNext} />
        </aside>
      </div>
    </section>
  );
}
