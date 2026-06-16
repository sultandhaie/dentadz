"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Calendar,
  CalendarPlus,
  Clock,
  CreditCard,
  Droplets,
  Edit,
  Eye,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Pill,
  ShieldCheck,
  Stethoscope,
  User,
  UserRound,
} from "lucide-react";
import { api } from "../../../lib/api";

interface Patient {
  id: number;
  patient_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  age: number;
  birth_date: string;
  gender: string;
  address: string;
  blood_type: string;
  allergies: string;
  medical_notes: string;
  emergency_contact: string;
  emergency_phone: string;
  status: string;
  balance: number;
  assigned_dentist?: { name: string; specialty?: string } | null;
  appointments?: { id: number; appointment_code: string; appointment_date: string; start_time: string; status: string; treatment: string; notes?: string; room?: string }[];
  payments?: { id: number; amount: number; payment_date: string; method: string }[];
  prescriptions?: { id: number; prescription_code: string; prescribed_date: string; status: string; medications: string; instructions?: string }[];
  dental_plans?: { id: number; plan_code: string; status: string; total_amount: number; paid_amount: number; balance: number; created_date: string; notes?: string; treatments?: { treatment_name: string; status: string; price: number; tooth_number: number; appointment_date: string }[] }[];
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

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return dateStr.split("T")[0];
}

function getStatusClass(status: string) {
  const statusClasses: Record<string, string> = {
    Actif: "bg-emerald-50 text-[#22C55E] ring-emerald-100",
    "En traitement": "bg-amber-50 text-[#F59E0B] ring-amber-100",
    Nouveau: "bg-blue-50 text-[#2563EB] ring-blue-100",
    "En retard": "bg-red-50 text-[#EF4444] ring-red-100",
  };
  return statusClasses[status] || "bg-slate-50 text-[#64748B] ring-slate-100";
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

function StatusBadge({ status }: { status: string }) {
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

function InfoRow({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: typeof User;
  label: string;
  value: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
      <span
        className={cx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white",
          iconColor || "text-[#0F766E]",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-bold text-[#0F172A]">{value || "—"}</p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  accent,
}: {
  href: string;
  icon: typeof CalendarPlus;
  label: string;
  accent: "teal" | "blue" | "purple" | "amber";
}) {
  const accents = {
    teal: "bg-teal-50 text-[#0F766E] hover:border-[#0F766E]/30",
    blue: "bg-blue-50 text-[#2563EB] hover:border-[#2563EB]/30",
    purple: "bg-violet-50 text-[#7C3AED] hover:border-violet-400/40",
    amber: "bg-amber-50 text-[#F59E0B] hover:border-[#F59E0B]/30",
  };
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span
        className={cx(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          accents[accent],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-bold text-[#0F172A]">{label}</span>
    </Link>
  );
}

export default function PatientDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const isConsultation = searchParams.get("consultation") === "active";
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const token = localStorage.getItem("auth_token") || "";
    api<Patient>(`/patients/${slug}`, { token })
      .then(setPatient)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
          <p className="text-sm font-semibold text-[#64748B]">Chargement du dossier patient...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444]">
            <AlertCircle className="h-7 w-7" />
          </span>
          <p className="text-sm font-bold text-[#0F172A]">{error || "Patient introuvable"}</p>
          <Link
            href="/patients"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux patients
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${patient.first_name} ${patient.last_name}`;

  const historyItems: { date: string; type: string; icon: typeof Calendar; color: string; bgColor: string; title: string; detail: string; status: string; link?: string }[] = [];
  (patient.appointments || []).forEach((a) => {
    historyItems.push({
      date: formatDate(a.appointment_date),
      type: "Rendez-vous",
      icon: Calendar,
      color: "text-[#2563EB]",
      bgColor: "bg-blue-50",
      title: a.treatment,
      detail: `${a.start_time || ""} ${a.room ? "· " + a.room : ""}`,
      status: a.status,
    });
  });
  (patient.prescriptions || []).forEach((p) => {
    historyItems.push({
      date: formatDate(p.prescribed_date),
      type: "Ordonnance",
      icon: FileText,
      color: "text-[#7C3AED]",
      bgColor: "bg-purple-50",
      title: p.prescription_code,
      detail: p.medications || "",
      status: p.status,
      link: `/ordonnances/${p.id}`,
    });
  });
  (patient.dental_plans || []).forEach((dp) => {
    historyItems.push({
      date: formatDate(dp.created_date),
      type: "Plan dentaire",
      icon: Stethoscope,
      color: "text-[#0F766E]",
      bgColor: "bg-teal-50",
      title: dp.plan_code,
      detail: `${formatBalance(Number(dp.total_amount))} · ${dp.treatments?.length || 0} traitement(s)`,
      status: dp.status,
    });
  });
  historyItems.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/patients"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50"
            aria-label="Retour à la liste des patients"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#0F766E]">
                Dashboard
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/patients" className="hover:text-[#0F766E]">
                Patients
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">{fullName}</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">{fullName}</h2>
          </div>
        </div>
        <Link
          href={`/patients/${patient.patient_code}/modifier`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </Link>
      </div>

      {isConsultation && (
        <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-white to-violet-50 p-4 shadow-lg shadow-purple-100/50 2xl:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-lg shadow-purple-700/30">
                <Stethoscope className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Mode consultation active</h3>
                <p className="text-sm font-semibold text-[#64748B]">Vous êtes en consultation avec ce patient</p>
              </div>
            </div>
            <Link
              href="/salle-attente"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 text-sm font-bold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <CheckCircle className="h-4 w-4" />
              Terminer la consultation
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Link
              href={`/ordonnances/nouvelle?patientId=${patient.patient_code}&patientName=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2.5 text-sm font-bold text-[#7C3AED] transition hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-md"
            >
              <Pill className="h-4 w-4" />
              Ordonnance
            </Link>
            <Link
              href={`/rendez-vous/nouveau?patient_id=${patient.patient_code}&patient_name=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2.5 text-sm font-bold text-[#7C3AED] transition hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-md"
            >
              <CalendarPlus className="h-4 w-4" />
              Nouveau RDV
            </Link>
            <Link
              href={`/paiements/nouveau?patientId=${patient.patient_code}&patientName=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2.5 text-sm font-bold text-[#7C3AED] transition hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-md"
            >
              <CreditCard className="h-4 w-4" />
              Paiement
            </Link>
            <Link
              href={`/plan-dentaire?patient_id=${patient.patient_code}`}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2.5 text-sm font-bold text-[#7C3AED] transition hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-md"
            >
              <FileText className="h-4 w-4" />
              Plan dentaire
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <div className={panelClass}>
            <div className="flex items-start gap-4">
              <Avatar name={fullName} className="h-16 w-16 text-lg 2xl:h-20 2xl:w-20 2xl:text-xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-[#0F172A] 2xl:text-2xl">{fullName}</h3>
                  <StatusBadge status={patient.status} />
                </div>
                <p className="mt-1 text-sm font-semibold text-[#64748B]">
                  {patient.patient_code} · {patient.age} ans
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E] ring-1 ring-teal-100">
                    <Phone className="h-3.5 w-3.5" />
                    {patient.phone}
                  </span>
                  {patient.email && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] ring-1 ring-blue-100">
                      <Mail className="h-3.5 w-3.5" />
                      {patient.email}
                    </span>
                  )}
                  {patient.gender && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-[#7C3AED] ring-1 ring-violet-100">
                      <User className="h-3.5 w-3.5" />
                      {patient.gender}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Solde</p>
                <p
                  className={cx(
                    "mt-1 text-xl font-bold 2xl:text-2xl",
                    patient.balance > 0 ? "text-[#EF4444]" : "text-[#0F172A]",
                  )}
                >
                  {formatBalance(patient.balance)}
                </p>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <User className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Informations personnelles</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 2xl:gap-4">
              <InfoRow icon={UserRound} label="Nom complet" value={fullName} />
              <InfoRow icon={User} label="Code patient" value={patient.patient_code} />
              <InfoRow icon={Calendar} label="Date de naissance" value={formatDate(patient.birth_date)} iconColor="text-[#2563EB]" />
              <InfoRow icon={User} label="Âge" value={`${patient.age} ans`} iconColor="text-[#7C3AED]" />
              <InfoRow icon={Phone} label="Téléphone" value={patient.phone} />
              <InfoRow icon={Mail} label="Email" value={patient.email} iconColor="text-[#2563EB]" />
              <InfoRow icon={MapPin} label="Adresse" value={patient.address} iconColor="text-[#F59E0B]" />
              <InfoRow icon={Droplets} label="Groupe sanguin" value={patient.blood_type} iconColor="text-[#EF4444]" />
            </div>
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#EF4444]">
                <HeartPulse className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Informations médicales</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 2xl:gap-4">
              <InfoRow icon={Droplets} label="Groupe sanguin" value={patient.blood_type} iconColor="text-[#EF4444]" />
              <InfoRow icon={AlertCircle} label="Allergies" value={patient.allergies} iconColor="text-[#F59E0B]" />
              <div className="sm:col-span-2">
                <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Notes médicales
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#0F172A]">
                    {patient.medical_notes || "Aucune note médicale"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Contact d&apos;urgence</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 2xl:gap-4">
              <InfoRow icon={UserRound} label="Personne de contact" value={patient.emergency_contact} iconColor="text-[#F59E0B]" />
              <InfoRow icon={Phone} label="Téléphone d&apos;urgence" value={patient.emergency_phone} />
            </div>
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Clock className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Historique des consultations</h3>
            </div>
            {historyItems.length === 0 ? (
              <p className="py-4 text-center text-sm font-semibold text-[#64748B]">Aucun historique de consultation</p>
            ) : (
              <div className="space-y-3">
                {historyItems.slice(0, 10).map((item, i) => {
                  const HistoryIcon = item.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className={cx("flex h-8 w-8 items-center justify-center rounded-full", item.bgColor, item.color)}>
                          <HistoryIcon className="h-4 w-4" />
                        </span>
                        {i < historyItems.length - 1 && <div className="mt-1 h-full w-px bg-slate-200" />}
                      </div>
                      <div className="min-w-0 flex-1 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-bold text-[#64748B]">{item.date}</p>
                          <span className={cx("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold", item.bgColor, item.color)}>
                            {item.type}
                          </span>
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#64748B]">
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm font-bold text-[#0F172A]">{item.title}</p>
                        {item.detail && (
                          <div className="mt-0.5">
                            {item.detail.split("\n").slice(0, 2).map((line, li) => (
                              <p key={li} className="text-xs font-medium text-[#64748B] truncate">{line}</p>
                            ))}
                            {item.detail.split("\n").length > 2 && (
                              <p className="text-xs font-medium text-[#64748B]">...</p>
                            )}
                          </div>
                        )}
                        {item.link && (
                          <Link
                            href={item.link}
                            className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-[#7C3AED] transition hover:bg-purple-100"
                          >
                            <Eye className="h-3 w-3" />
                            Voir l&apos;ordonnance
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
                {historyItems.length > 10 && (
                  <p className="text-center text-xs font-bold text-[#64748B]">+{historyItems.length - 10} autres entrées</p>
                )}
              </div>
            )}
          </div>

        </div>

        <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start 2xl:top-6">
          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <User className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Dentiste assigné</h3>
            </div>
            {patient.assigned_dentist ? (
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4">
                <Avatar
                  name={patient.assigned_dentist.name}
                  className="h-12 w-12 text-sm 2xl:h-14 2xl:w-14 2xl:text-base"
                />
                <div>
                  <p className="font-bold text-[#0F172A]">{patient.assigned_dentist.name}</p>
                  {patient.assigned_dentist.specialty && (
                    <p className="text-xs font-semibold text-[#64748B]">
                      {patient.assigned_dentist.specialty}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#64748B]">Aucun dentiste assigné</p>
            )}
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                <CreditCard className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Résumé financier</h3>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Solde impayé</p>
              <p
                className={cx(
                  "mt-1 text-2xl font-bold 2xl:text-3xl",
                  patient.balance > 0 ? "text-[#EF4444]" : "text-[#22C55E]",
                )}
              >
                {formatBalance(patient.balance)}
              </p>
            </div>
            {patient.payments && patient.payments.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                  Derniers paiements
                </p>
                {patient.payments.slice(0, 3).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-2.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">
                        {payment.amount.toLocaleString("fr-DZ")} DA
                      </p>
                      <p className="text-[10px] font-semibold text-[#64748B]">
                        {formatDate(payment.payment_date)}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#64748B]">
                      {payment.method}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Activité récente</h3>
            </div>
            <div className="space-y-2">
              {patient.appointments && patient.appointments.length > 0 && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Rendez-vous
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">
                    {patient.appointments.length} rendez-vous
                  </p>
                </div>
              )}
              {patient.prescriptions && patient.prescriptions.length > 0 && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Ordonnances
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">
                    {patient.prescriptions.length} ordonnance(s)
                  </p>
                </div>
              )}
              {patient.dental_plans && patient.dental_plans.length > 0 && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Plans dentaires
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">
                    {patient.dental_plans.length} plan(s)
                  </p>
                </div>
              )}
              {(!patient.appointments || patient.appointments.length === 0) &&
                (!patient.prescriptions || patient.prescriptions.length === 0) &&
                (!patient.dental_plans || patient.dental_plans.length === 0) && (
                  <p className="py-2 text-center text-xs font-semibold text-[#64748B]">
                    Aucune activité récente
                  </p>
                )}
            </div>
          </div>

          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-[#7C3AED]">
                <CalendarPlus className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Actions rapides</h3>
            </div>
            <div className="space-y-2">
              <QuickAction
                href={`/rendez-vous/nouveau?patient_id=${patient.patient_code}`}
                icon={CalendarPlus}
                label="Ajouter un rendez-vous"
                accent="teal"
              />
              <QuickAction
                href={`/paiements/nouveau?patientId=${patient.patient_code}&patientName=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`}
                icon={CreditCard}
                label="Ajouter paiement"
                accent="blue"
              />
              <QuickAction
                href={`/ordonnances/nouvelle?patientId=${patient.patient_code}&patientName=${encodeURIComponent(patient.first_name + " " + patient.last_name)}`}
                icon={FileText}
                label="Nouvelle ordonnance"
                accent="purple"
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
