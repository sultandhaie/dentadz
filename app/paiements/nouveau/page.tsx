"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Banknote, CheckCircle, CreditCard, Download, Info, Landmark,
  Plus, Printer, Receipt, Search, Smartphone, Wallet,
} from "lucide-react";
import { api } from "../../../lib/api";

interface Patient { id: number; first_name: string; last_name: string; phone: string; patient_code: string; }
interface Treatment { id: number; name: string; price: number; }

function PaymentForm() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [formData, setFormData] = useState({
    patientId: "", patientSearch: "", dentiste: "", date: new Date().toISOString().split("T")[0],
    treatment: "Consultation + Diagnostic", total: "2000", paid: "2000", method: "Cash", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ data: Patient[] }>("/patients?per_page=100"),
      api<{ data: Treatment[] }>("/treatments?per_page=100"),
    ]).then(([p, t]) => {
      setPatients(p?.data ?? (Array.isArray(p) ? p : []));
      setTreatments(t?.data ?? (Array.isArray(t) ? t : []));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const pId = searchParams.get("patientId");
    const pName = searchParams.get("patientName");
    const treatment = searchParams.get("treatment");
    const price = searchParams.get("price");
    if (pId || pName || treatment || price) {
      setFormData(prev => ({ ...prev, patientSearch: pName || prev.patientSearch, treatment: treatment || prev.treatment, total: price || prev.total, paid: price || prev.paid }));

      if (pId && patients.length > 0) {
        const found = patients.find(p => String(p.id) === pId || p.patient_code === pId);
        if (found) {
          setFormData(prev => ({ ...prev, patientId: String(found.id), patientSearch: `${found.first_name} ${found.last_name}` }));
        }
      }
    }
  }, [searchParams, patients]);

  const totalNum = parseFloat(formData.total) || 0;
  const paidNum = parseFloat(formData.paid) || 0;
  const remainingNum = Math.max(0, totalNum - paidNum);
  let status: "Payé" | "Partiel" | "Impayé" = "Impayé";
  if (paidNum > 0) { status = remainingNum === 0 ? "Payé" : "Partiel"; }

  const filteredPatients = patients.filter(p => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    return name.includes(formData.patientSearch.toLowerCase()) || p.phone.includes(formData.patientSearch);
  });

  const handlePatientSelect = (p: Patient) => {
    setFormData(prev => ({ ...prev, patientId: String(p.id), patientSearch: `${p.first_name} ${p.last_name}` }));
    setShowPatientResults(false);
    if (errors.patientId) setErrors(prev => ({ ...prev, patientId: "" }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedT = treatments.find(t => t.name === e.target.value);
    if (selectedT) { setFormData(prev => ({ ...prev, treatment: selectedT.name, total: String(selectedT.price), paid: String(selectedT.price) })); }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientId) newErrors.patientId = "Veuillez sélectionner un patient";
    if (!formData.date) newErrors.date = "La date est obligatoire";
    if (totalNum <= 0) newErrors.total = "Le montant total doit être supérieur à 0";
    if (paidNum < 0) newErrors.paid = "Le montant payé ne peut pas être négatif";
    if (paidNum > totalNum) newErrors.paid = "Le montant payé ne peut pas dépasser le total";
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
      await api("/payments", {
        method: "POST", token,
        body: JSON.stringify({
          patient_id: Number(formData.patientId),
          amount: paidNum,
          method: formData.method,
          status: status === "Payé" ? "Payé" : status === "Partiel" ? "Partiel" : "En attente",
          payment_date: formData.date,
          notes: formData.notes || undefined,
        }),
      });
      setShowSuccess(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ patientId: "", patientSearch: "", dentiste: "", date: new Date().toISOString().split("T")[0], treatment: "Consultation + Diagnostic", total: "2000", paid: "2000", method: "Cash", notes: "" });
    setErrors({});
    setServerError("");
    setShowSuccess(false);
  };

  const selectedPatient = patients.find(p => String(p.id) === formData.patientId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F59E0B] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/paiements" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50" aria-label="Retour à la liste des paiements">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#F59E0B]">Dashboard</Link><span className="mx-1.5">/</span>
              <Link href="/paiements" className="hover:text-[#F59E0B]">Paiements</Link><span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">Nouveau paiement</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">Enregistrer un Paiement</h2>
          </div>
        </div>
      </div>

      {showSuccess ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 text-center shadow-[0_20px_45px_rgba(245,158,11,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600"><CheckCircle className="h-8 w-8" /></div>
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Transaction enregistrée avec succès !</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Le paiement de <strong>{paidNum.toLocaleString("fr-DZ")} DA</strong> pour <strong>{selectedPatient?.first_name} {selectedPatient?.last_name}</strong> a été validé.
            {remainingNum > 0 ? ` Solde restant : ${remainingNum.toLocaleString("fr-DZ")} DA.` : " Facture réglée en totalité."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={handleReset} className="inline-flex h-11 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50">Enregistrer un autre paiement</button>
            <button onClick={() => window.print()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"><Printer className="h-4 w-4" />Imprimer le reçu</button>
            <Link href="/paiements" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-200">Retour aux transactions</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]"><Wallet className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Patient & Date de facturation</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="patientSearch" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Sélectionner le patient <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#64748B]" />
                    <input type="text" id="patientSearch" name="patientSearch" value={formData.patientSearch} onChange={(e) => { setFormData(prev => ({ ...prev, patientSearch: e.target.value, patientId: "" })); setShowPatientResults(true); }} onFocus={() => setShowPatientResults(true)} className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition ${errors.patientId ? "border-red-300 focus:border-red-500" : "border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-4 focus:ring-amber-700/10"}`} placeholder="Rechercher par nom..." autoComplete="off" />
                  </div>
                  {showPatientResults && (
                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-xl">
                      {filteredPatients.length > 0 ? filteredPatients.map(p => (
                        <button key={p.id} type="button" onClick={() => handlePatientSelect(p)} className="flex w-full flex-col px-4 py-2 text-left hover:bg-slate-50 transition">
                          <span className="text-sm font-bold text-[#0F172A]">{p.first_name} {p.last_name}</span>
                          <span className="text-xs text-[#64748B]">{p.phone} · ID #{p.id}</span>
                        </button>
                      )) : <div className="px-4 py-3 text-center text-xs font-semibold text-[#64748B]">Aucun patient trouvé.</div>}
                    </div>
                  )}
                  {errors.patientId && <p className="mt-1 text-xs font-bold text-red-500">{errors.patientId}</p>}
                </div>
                <div>
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Date du versement <span className="text-red-500">*</span></label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleFormChange} className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-amber-700/10" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]"><Receipt className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Détail Financier & Acte dentaire</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label htmlFor="treatment" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Traitement / Acte médical</label>
                  <select id="treatment" name="treatment" value={formData.treatment} onChange={handleTreatmentChange} className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#F59E0B]">
                    {treatments.length > 0 ? treatments.map(t => (<option key={t.id} value={t.name}>{t.name} ({t.price.toLocaleString("fr-DZ")} DA)</option>)) : (
                      <>
                        <option value="Consultation + Diagnostic">Consultation + Diagnostic (2000 DA)</option>
                        <option value="Détartrage">Détartrage (4000 DA)</option>
                        <option value="Extraction">Extraction (5000 DA)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="total" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Montant total (DA) <span className="text-red-500">*</span></label>
                  <input type="number" id="total" name="total" value={formData.total} onChange={handleFormChange} className={`h-11 w-full rounded-xl border px-4 text-sm font-bold outline-none transition ${errors.total ? "border-red-300 focus:border-red-500" : "border-[#E2E8F0] focus:border-[#F59E0B]"}`} />
                  {errors.total && <p className="mt-1 text-xs font-bold text-red-500">{errors.total}</p>}
                </div>
                <div>
                  <label htmlFor="paid" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Montant versé (DA) <span className="text-red-500">*</span></label>
                  <input type="number" id="paid" name="paid" value={formData.paid} onChange={handleFormChange} className={`h-11 w-full rounded-xl border px-4 text-sm font-bold outline-none transition ${errors.paid ? "border-red-300 focus:border-red-500" : "border-[#E2E8F0] focus:border-[#F59E0B]"}`} />
                  {errors.paid && <p className="mt-1 text-xs font-bold text-red-500">{errors.paid}</p>}
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Mode de paiement</span>
                  <select id="method" name="method" value={formData.method} onChange={handleFormChange} className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#F59E0B]">
                    <option value="Cash">Cash (Espèces)</option><option value="BaridiMob">BaridiMob</option><option value="CCP">CCP (Poste)</option><option value="Carte">CIB / Edahabia</option><option value="Virement">Virement bancaire</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Total à payer</p><p className="mt-1 text-base font-bold text-[#0F172A]">{totalNum.toLocaleString("fr-DZ")} DA</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Versé aujourd&apos;hui</p><p className={`mt-1 text-base font-bold ${paidNum === totalNum ? "text-green-700" : "text-blue-700"}`}>{paidNum.toLocaleString("fr-DZ")} DA</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Reste dû</p><p className={`mt-1 text-base font-bold ${remainingNum > 0 ? "text-red-500" : "text-[#0F172A]"}`}>{remainingNum.toLocaleString("fr-DZ")} DA</p></div>
                <div className="col-span-3 border-t border-slate-200/60 pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#64748B]">Statut du paiement :</span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status === "Payé" ? "bg-emerald-50 text-[#22C55E]" : status === "Partiel" ? "bg-blue-50 text-[#2563EB]" : "bg-orange-50 text-[#F59E0B]"}`}>{status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]"><CreditCard className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Mode de règlement</h3>
              </div>
              <div className="space-y-2">
                {[{ value: "Cash", label: "Cash (Espèces)", icon: Banknote, bg: "bg-green-50 text-green-700 border-green-200" }, { value: "BaridiMob", label: "BaridiMob", icon: Smartphone, bg: "bg-indigo-50 text-indigo-700 border-indigo-200" }, { value: "CCP", label: "CCP (Poste)", icon: Landmark, bg: "bg-blue-50 text-blue-700 border-blue-200" }, { value: "Carte", label: "CIB / Edahabia", icon: CreditCard, bg: "bg-teal-50 text-teal-700 border-teal-200" }].map((method) => {
                  const isSelected = formData.method === method.value;
                  const Icon = method.icon;
                  return (
                    <button key={method.value} type="button" onClick={() => setFormData(prev => ({ ...prev, method: method.value }))} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${isSelected ? "border-[#F59E0B] bg-amber-50/20 shadow-sm" : "border-[#E2E8F0] bg-white hover:bg-slate-50"}`}>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${method.bg}`}><Icon className="h-4.5 w-4.5" /></span>
                      <span className="text-sm font-bold text-[#0F172A]">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]"><Info className="h-4.5 w-4.5" /></span>
                <h3 className="text-base font-bold text-[#0F172A]">Administration</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">Notes de transaction</label>
                  <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleFormChange} className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#F59E0B]" placeholder="Numéro de chèque, transaction ID, remarques..."></textarea>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-amber-700/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none cursor-pointer">
                {isSubmitting ? (<><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /><span>Validation...</span></>) : (<><Download className="h-4.5 w-4.5" /><span>Enregistrer le Paiement</span></>)}
              </button>
              <Link href="/paiements" className="flex h-11 w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50">Annuler</Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function NouveauPaiementPage() {
  return <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F59E0B] border-t-transparent" /></div>}><PaymentForm /></Suspense>;
}
