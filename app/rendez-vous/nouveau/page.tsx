"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, CalendarCheck, CheckCircle, Clock, Info, Search, Stethoscope, User, UserRound } from "lucide-react";
import { api } from "../../../lib/api";

interface Patient { id: number; first_name: string; last_name: string; phone: string; }
interface Dentist { id: number; name: string; specialty?: string; }
interface Treatment { id: number; name: string; price: number; }

const timeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

export default function NouveauRendezVousPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [formData, setFormData] = useState({ patientId: "", patientSearch: "", dentistId: "", date: "", heure: "", motif: "Consultation", salle: "Cabinet 01", statut: "Confirmé", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showCustomTime, setShowCustomTime] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ data: Patient[] }>("/patients?per_page=100"),
      api<Dentist[]>("/dentists"),
      api<{ data: Treatment[] }>("/treatments?per_page=100"),
    ]).then(([p, d, t]) => {
      setPatients(p?.data ?? (Array.isArray(p) ? p : []));
      setDentists(Array.isArray(d) ? d : []);
      setTreatments(t?.data ?? (Array.isArray(t) ? t : []));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const pId = searchParams.get("patient_id");
    const pName = searchParams.get("patient_name");
    const date = searchParams.get("date");
    const heure = searchParams.get("heure");
    if (pId || pName || date || heure) {
      setFormData(prev => ({
        ...prev,
        patientId: pId || prev.patientId,
        patientSearch: pName ? decodeURIComponent(pName) : prev.patientSearch,
        date: date || prev.date,
        heure: heure || prev.heure,
      }));
    }
  }, [searchParams]);

  const filteredPatients = patients.filter((p) => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    return name.includes(formData.patientSearch.toLowerCase()) || p.phone.includes(formData.patientSearch);
  });

  const handlePatientSelect = (p: Patient) => {
    setFormData((prev) => ({ ...prev, patientId: String(p.id), patientSearch: `${p.first_name} ${p.last_name}` }));
    setShowPatientResults(false);
    if (errors.patientId) setErrors((prev) => ({ ...prev, patientId: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, heure: time }));
    if (errors.heure) setErrors((prev) => ({ ...prev, heure: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientId) newErrors.patientId = "Veuillez sélectionner un patient";
    if (!formData.dentistId) newErrors.dentistId = "Veuillez sélectionner un dentiste";
    if (!formData.date) newErrors.date = "La date est obligatoire";
    if (!formData.heure) newErrors.heure = "Veuillez sélectionner une heure";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setIsSubmitting(true);
    setServerError("");
    const token = localStorage.getItem("auth_token") || "";
    try {
      const endTime = formData.heure;
      const [h, m] = endTime.split(":").map(Number);
      const endH = m >= 30 ? h + 1 : h;
      const endM = m >= 30 ? 0 : 30;
      await api("/appointments", {
        method: "POST", token,
        body: JSON.stringify({
          patient_id: Number(formData.patientId),
          dentist_id: Number(formData.dentistId),
          appointment_date: formData.date,
          start_time: formData.heure,
          end_time: `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`,
          treatment: formData.motif,
          status: formData.statut,
          room: formData.salle,
          notes: formData.notes || undefined,
        }),
      });
      setShowSuccess(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ patientId: "", patientSearch: "", dentistId: "", date: "", heure: "", motif: "Consultation", salle: "Cabinet 01", statut: "Confirmé", notes: "" });
    setErrors({});
    setServerError("");
    setShowSuccess(false);
    setShowCustomTime(false);
  };

  const selectedPatient = patients.find((p) => String(p.id) === formData.patientId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/rendez-vous" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50" aria-label="Retour à la liste des rendez-vous">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#2563EB]">Dashboard</Link><span className="mx-1.5">/</span>
              <Link href="/rendez-vous" className="hover:text-[#2563EB]">Rendez-vous</Link><span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">Nouveau rendez-vous</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">Planifier un Rendez-vous</h2>
          </div>
        </div>
      </div>

      {showSuccess ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center shadow-[0_20px_45px_rgba(37,99,235,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600"><CheckCircle className="h-8 w-8" /></div>
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Rendez-vous planifié avec succès !</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Le rendez-vous pour <strong>{selectedPatient?.first_name} {selectedPatient?.last_name}</strong> est planifié le <strong>{formData.date}</strong> à <strong>{formData.heure}</strong>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={handleReset} className="inline-flex h-11 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50">Planifier un autre rendez-vous</button>
            <Link href="/rendez-vous" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-700">Consulter le planning</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><User className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Patient & Praticien</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="patientSearch" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Sélectionner un patient <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#64748B]" />
                    <input type="text" id="patientSearch" name="patientSearch" value={formData.patientSearch} onChange={(e) => { setFormData((prev) => ({ ...prev, patientSearch: e.target.value, patientId: "" })); setShowPatientResults(true); }} onFocus={() => setShowPatientResults(true)} className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition ${errors.patientId ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-700/10"}`} placeholder="Rechercher par nom ou téléphone..." autoComplete="off" />
                  </div>
                  {showPatientResults && formData.patientSearch.length >= 0 && (
                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-xl">
                      {filteredPatients.length > 0 ? filteredPatients.map((p) => (
                        <button key={p.id} type="button" onClick={() => handlePatientSelect(p)} className="flex w-full flex-col px-4 py-2 text-left hover:bg-slate-50 transition">
                          <span className="text-sm font-bold text-[#0F172A]">{p.first_name} {p.last_name}</span>
                          <span className="text-xs text-[#64748B]">{p.phone} · ID #{p.id}</span>
                        </button>
                      )) : <div className="px-4 py-3 text-center text-xs font-semibold text-[#64748B]">Aucun patient trouvé. <Link href="/patients/nouveau" className="text-[#2563EB] hover:underline">Créer un nouveau patient?</Link></div>}
                    </div>
                  )}
                  {errors.patientId && <p className="mt-1 text-xs font-bold text-red-500">{errors.patientId}</p>}
                </div>
                <div>
                  <label htmlFor="dentistId" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Dentiste praticien <span className="text-red-500">*</span></label>
                  <select id="dentistId" name="dentistId" value={formData.dentistId} onChange={handleChange} className={`h-11 w-full rounded-xl border px-3 text-sm font-bold text-[#0F172A] outline-none transition ${errors.dentistId ? "border-red-300" : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-700/10"}`}>
                    <option value="">Sélectionner un dentiste</option>
                    {dentists.map((d) => (<option key={d.id} value={d.id}>{d.name}{d.specialty ? ` (${d.specialty})` : ""}</option>))}
                  </select>
                  {errors.dentistId && <p className="mt-1 text-xs font-bold text-red-500">{errors.dentistId}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><Calendar className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Date & Créneau Horaire</h3>
              </div>
              <div className="space-y-5">
                <div className="max-w-xs">
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Date du rendez-vous <span className="text-red-500">*</span></label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${errors.date ? "border-red-300 focus:border-red-500" : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-700/10"}`} />
                  {errors.date && <p className="mt-1 text-xs font-bold text-red-500">{errors.date}</p>}
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-2">Sélectionner un horaire <span className="text-red-500">*</span></span>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {timeSlots.map((time) => {
                      const isSelected = formData.heure === time && !showCustomTime;
                      return (<button key={time} type="button" onClick={() => { handleTimeSelect(time); setShowCustomTime(false); }} className={`flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition ${isSelected ? "bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-sm shadow-blue-200" : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"}`}>{time}</button>);
                    })}
                    <button type="button" onClick={() => setShowCustomTime(true)} className={`flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition ${showCustomTime ? "bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-sm shadow-blue-200" : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"}`}>Autre</button>
                  </div>
                  {showCustomTime && (
                    <div className="mt-3 flex items-center gap-3">
                      <input type="time" value={formData.heure} onChange={(e) => { setFormData(prev => ({ ...prev, heure: e.target.value })); if (errors.heure) setErrors(prev => ({ ...prev, heure: "" })); }} className="h-11 w-full max-w-xs rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-700/10" />
                      <span className="text-xs font-bold text-[#64748B]">ou saisissez l'heure souhaitée</span>
                    </div>
                  )}
                  {errors.heure && <p className="mt-1 text-xs font-bold text-red-500">{errors.heure}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><Stethoscope className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Acte & Motif</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor="motif" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Motif de consultation</label>
                  <select id="motif" name="motif" value={formData.motif} onChange={handleChange} className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#2563EB]">
                    {treatments.length > 0 ? treatments.map((t) => (<option key={t.id} value={t.name}>{t.name}</option>)) : (
                      <>
                        <option value="Consultation">Consultation</option>
                        <option value="Détartrage">Détartrage</option>
                        <option value="Extraction">Extraction</option>
                        <option value="Orthodontie">Orthodontie</option>
                        <option value="Plombage">Plombage</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="salle" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Salle de soins</label>
                  <select id="salle" name="salle" value={formData.salle} onChange={handleChange} className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#2563EB]">
                    <option value="Cabinet 01">Cabinet 01</option><option value="Cabinet 02">Cabinet 02</option><option value="Cabinet Ortho">Cabinet Ortho</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="statut" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Statut initial</label>
                  <select id="statut" name="statut" value={formData.statut} onChange={handleChange} className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#2563EB]">
                    <option value="Confirmé">Confirmé</option><option value="En attente">En attente (Rappel requis)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><Info className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Remarques / Notes</h3>
              </div>
              <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Notes cliniques</label>
                <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#2563EB]" placeholder="ex: Douleur molaire en bas à gauche, premier contrôle..."></textarea>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none cursor-pointer">
                {isSubmitting ? (<><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /><span>Planification...</span></>) : (<><CalendarCheck className="h-4.5 w-4.5" /><span>Planifier le Rendez-vous</span></>)}
              </button>
              <Link href="/rendez-vous" className="flex h-11 w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50">Annuler</Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
