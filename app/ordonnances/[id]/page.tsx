"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Pill,
  Printer,
  User,
} from "lucide-react";

import { api } from "../../../lib/api";

type Prescription = {
  id: number;
  prescription_code: string;
  medications: string;
  instructions: string;
  prescribed_date: string;
  validity_date: string;
  status: string;
  patient: { id: number; first_name: string; last_name: string; phone: string; patient_code: string };
  dentist: { name: string; id?: number };
};

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = dateStr.split("T")[0].split(" ")[0];
  const parts = d.split("-");
  if (parts.length === 3) {
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ];
    return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
  }
  return d;
}

function getStatusStyle(status: string) {
  const map: Record<string, string> = {
    Active: "bg-emerald-50 text-[#22C55E] ring-emerald-100",
    Brouillon: "bg-slate-100 text-[#64748B] ring-slate-200",
    Expirée: "bg-amber-50 text-[#F59E0B] ring-amber-100",
    "Annulée": "bg-red-50 text-[#EF4444] ring-red-100",
    Délivrée: "bg-emerald-50 text-[#22C55E] ring-emerald-100",
  };
  return map[status] || "bg-slate-100 text-[#64748B] ring-slate-200";
}

export default function OrdonnanceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [rx, setRx] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("auth_token") || "";
    api<Prescription>(`/prescriptions/${id}`, { token })
      .then(setRx)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
          <p className="text-sm font-semibold text-[#64748B]">Chargement de l&apos;ordonnance...</p>
        </div>
      </div>
    );
  }

  if (error || !rx) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444]">
            <FileText className="h-7 w-7" />
          </span>
          <p className="text-sm font-bold text-[#0F172A]">{error || "Ordonnance introuvable"}</p>
          <Link
            href="/ordonnances"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0D5E53]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </div>
    );
  }

  const medications = (rx.medications || "").split("\n").filter((l: string) => l.trim());
  const patientName = `${rx.patient?.first_name || ""} ${rx.patient?.last_name || ""}`.trim();

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ordonnances"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50"
            aria-label="Retour à la liste des ordonnances"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#0F766E]">Dashboard</Link>
              <span className="mx-1.5">/</span>
              <Link href="/ordonnances" className="hover:text-[#0F766E]">Ordonnances</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">{rx.prescription_code}</span>
            </nav>
            <h2 className="mt-1 flex items-center gap-3 text-xl font-bold text-[#0F172A] sm:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                <FileText className="h-5 w-5" />
              </span>
              {rx.prescription_code}
              <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1", getStatusStyle(rx.status))}>
                {rx.status}
              </span>
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                <Pill className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Médicaments prescrits</h3>
            </div>
            <div className="space-y-3">
              {medications.map((line: string, i: number) => {
                const badgeColors = [
                  "bg-teal-50 text-[#0F766E]",
                  "bg-blue-50 text-[#2563EB]",
                  "bg-purple-50 text-[#7C3AED]",
                  "bg-amber-50 text-[#F59E0B]",
                  "bg-rose-50 text-[#E11D48]",
                ];
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
                    <span className={cx("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", badgeColors[i % badgeColors.length])}>
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-[#0F172A]">{line}</p>
                  </div>
                );
              })}
              {medications.length === 0 && (
                <p className="py-4 text-center text-sm font-semibold text-[#64748B]">Aucun médicament prescrit</p>
              )}
            </div>
          </div>

          {rx.instructions && (
            <div className={panelClass}>
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <FileText className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Instructions</h3>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-4">
                <p className="whitespace-pre-line text-sm font-medium text-[#0F172A]">{rx.instructions}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className={panelClass}>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <User className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Informations</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Patient</p>
                {rx.patient ? (
                  <Link
                    href={`/patients/${rx.patient.patient_code}`}
                    className="mt-0.5 text-sm font-bold text-[#0F766E] hover:underline"
                  >
                    {patientName}
                  </Link>
                ) : (
                  <p className="mt-0.5 text-sm font-bold text-[#0F172A]">—</p>
                )}
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Dentiste</p>
                <p className="mt-0.5 text-sm font-bold text-[#0F172A]">{rx.dentist?.name || "—"}</p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Date de prescription</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#0F766E]" />
                  <p className="text-sm font-bold text-[#0F172A]">{formatDate(rx.prescribed_date)}</p>
                </div>
              </div>
              {rx.validity_date && (
                <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Date de validité</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
                    <p className="text-sm font-bold text-[#0F172A]">{formatDate(rx.validity_date)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
