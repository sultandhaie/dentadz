"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  CheckCircle,
  CreditCard,
  Download,
  Info,
  Landmark,
  Plus,
  Printer,
  Receipt,
  Search,
  Smartphone,
  Wallet,
} from "lucide-react";

const mockPatients = [
  { id: "#P-000125", name: "Ahmed Benali", phone: "0555 22 33 44", age: 34 },
  { id: "#P-000126", name: "Sara Khaldi", phone: "0661 10 20 30", age: 29 },
  { id: "#P-000127", name: "Mohamed Amrani", phone: "0770 55 44 66", age: 42 },
  { id: "#P-000128", name: "Lina Cherif", phone: "0550 33 44 55", age: 26 },
  { id: "#P-000129", name: "Yacine Saadi", phone: "0777 44 55 66", age: 31 },
];

const treatments = [
  { name: "Consultation + Diagnostic", price: 2000 },
  { name: "Détartrage", price: 4000 },
  { name: "Extraction dentaire simple", price: 5000 },
  { name: "Extraction chirurgicale", price: 8000 },
  { name: "Plombage composite", price: 6000 },
  { name: "Traitement canalaire (Dévitalisation)", price: 12000 },
  { name: "Couronne céramique", price: 18000 },
  { name: "Implant dentaire", price: 60000 },
  { name: "Appareil orthodontique (Semestre)", price: 80000 },
  { name: "Blanchiment dentaire", price: 25000 },
];

const paymentMethods = [
  { value: "Cash", label: "Cash (Espèces)", icon: Banknote, bg: "bg-green-50 text-green-700 border-green-200" },
  { value: "BaridiMob", label: "BaridiMob", icon: Smartphone, bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "CCP", label: "CCP (Poste)", icon: Landmark, bg: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Carte bancaire", label: "CIB / Edahabia", icon: CreditCard, bg: "bg-teal-50 text-teal-700 border-teal-200" },
];

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    patientId: "",
    patientSearch: "",
    dentiste: "Dr Benali",
    date: new Date().toISOString().split("T")[0],
    treatment: "Consultation + Diagnostic",
    total: "2000",
    paid: "2000",
    method: "Cash",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);

  // Prefill details from URL query parameters (useful when coming from Dashboard 'Terminer' checkout)
  useEffect(() => {
    const pId = searchParams.get("patientId");
    const pName = searchParams.get("patientName");
    const treatment = searchParams.get("treatment");
    const price = searchParams.get("price");

    if (pId || pName || treatment || price) {
      const formattedId = pId ? (pId.startsWith("#") ? pId : `#${pId}`) : "";
      setFormData((prev) => ({
        ...prev,
        patientId: formattedId || prev.patientId,
        patientSearch: pName || prev.patientSearch,
        treatment: treatment || prev.treatment,
        total: price || prev.total,
        paid: price || prev.paid,
      }));
    }
  }, [searchParams]);

  const totalNum = parseFloat(formData.total) || 0;
  const paidNum = parseFloat(formData.paid) || 0;
  const remainingNum = Math.max(0, totalNum - paidNum);

  let status: "Payé" | "Partiel" | "Impayé" = "Impayé";
  if (paidNum > 0) {
    if (remainingNum === 0) {
      status = "Payé";
    } else {
      status = "Partiel";
    }
  }

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(formData.patientSearch.toLowerCase()) ||
    p.phone.includes(formData.patientSearch)
  );

  const handlePatientSelect = (p: typeof mockPatients[0]) => {
    setFormData((prev) => ({
      ...prev,
      patientId: p.id,
      patientSearch: p.name,
    }));
    setShowPatientResults(false);
    if (errors.patientId) {
      setErrors((prev) => ({ ...prev, patientId: "" }));
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedT = treatments.find((t) => t.name === e.target.value);
    if (selectedT) {
      setFormData((prev) => ({
        ...prev,
        treatment: selectedT.name,
        total: String(selectedT.price),
        paid: String(selectedT.price), // default to pay in full
      }));
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      patientId: "",
      patientSearch: "",
      dentiste: "Dr Benali",
      date: new Date().toISOString().split("T")[0],
      treatment: "Consultation + Diagnostic",
      total: "2000",
      paid: "2000",
      method: "Cash",
      notes: "",
    });
    setErrors({});
    setShowSuccess(false);
  };

  const selectedPatient = mockPatients.find((p) => p.id === formData.patientId);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/paiements"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50"
            aria-label="Retour à la liste des paiements"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#F59E0B]">Dashboard</Link>
              <span className="mx-1.5">/</span>
              <Link href="/paiements" className="hover:text-[#F59E0B]">Paiements</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">Nouveau paiement</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">
              Enregistrer un Paiement
            </h2>
          </div>
        </div>
      </div>

      {showSuccess ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 text-center shadow-[0_20px_45px_rgba(245,158,11,0.06)] animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Transaction enregistrée avec succès !</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Le paiement de <strong>{parseFloat(formData.paid).toLocaleString("fr-DZ")} DA</strong> pour <strong>{selectedPatient?.name}</strong> a été validé. 
            {remainingNum > 0 ? ` Solde restant : ${remainingNum.toLocaleString("fr-DZ")} DA.` : " Facture réglée en totalité."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50"
            >
              Enregistrer un autre paiement
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
            >
              <Printer className="h-4 w-4" />
              Imprimer le reçu
            </button>
            <Link
              href="/paiements"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-200"
            >
              Retour aux transactions
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
          {/* Main payment inputs */}
          <div className="space-y-6 xl:col-span-2">
            {/* Patient & Invoice Base Card */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                  <Wallet className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Patient & Date de facturation</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="patientSearch" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Sélectionner le patient <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      id="patientSearch"
                      name="patientSearch"
                      value={formData.patientSearch}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          patientSearch: e.target.value,
                          patientId: "",
                        }));
                        setShowPatientResults(true);
                      }}
                      onFocus={() => setShowPatientResults(true)}
                      className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition ${
                        errors.patientId
                          ? "border-red-300 focus:border-red-500"
                          : "border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-4 focus:ring-amber-700/10"
                      }`}
                      placeholder="Rechercher par nom..."
                      autoComplete="off"
                    />
                  </div>

                  {showPatientResults && (
                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-xl">
                      {filteredPatients.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePatientSelect(p)}
                          className="flex w-full flex-col px-4 py-2 text-left hover:bg-slate-50 transition"
                        >
                          <span className="text-sm font-bold text-[#0F172A]">{p.name}</span>
                          <span className="text-xs text-[#64748B]">{p.phone} · ID {p.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.patientId && <p className="mt-1 text-xs font-bold text-red-500">{errors.patientId}</p>}
                </div>

                <div>
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Date du versement <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-amber-700/10"
                  />
                </div>
              </div>
            </div>

            {/* Financial Details Card */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                  <Receipt className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Détail Financier & Acte dentaire</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label htmlFor="treatment" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Traitement / Acte médical
                  </label>
                  <select
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleTreatmentChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#F59E0B]"
                  >
                    {treatments.map((t) => (
                      <option key={t.name} value={t.name}>{t.name} ({t.price.toLocaleString("fr-DZ")} DA)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="total" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Montant total (DA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="total"
                    name="total"
                    value={formData.total}
                    onChange={handleFormChange}
                    className={`h-11 w-full rounded-xl border px-4 text-sm font-bold outline-none transition ${
                      errors.total ? "border-red-300 focus:border-red-500" : "border-[#E2E8F0] focus:border-[#F59E0B]"
                    }`}
                  />
                  {errors.total && <p className="mt-1 text-xs font-bold text-red-500">{errors.total}</p>}
                </div>

                <div>
                  <label htmlFor="paid" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Montant versé (DA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="paid"
                    name="paid"
                    value={formData.paid}
                    onChange={handleFormChange}
                    className={`h-11 w-full rounded-xl border px-4 text-sm font-bold outline-none transition ${
                      errors.paid ? "border-red-300 focus:border-red-500" : "border-[#E2E8F0] focus:border-[#F59E0B]"
                    }`}
                  />
                  {errors.paid && <p className="mt-1 text-xs font-bold text-red-500">{errors.paid}</p>}
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Mode de paiement
                  </span>
                  <select
                    id="method"
                    name="method"
                    value={formData.method}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#F59E0B]"
                  >
                    <option value="Cash">Cash (Espèces)</option>
                    <option value="BaridiMob">BaridiMob</option>
                    <option value="CCP">CCP (Poste)</option>
                    <option value="Carte bancaire">CIB / Edahabia</option>
                    <option value="Virement">Virement bancaire</option>
                  </select>
                </div>
              </div>

              {/* Dynamic calculations panel */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Total à payer</p>
                  <p className="mt-1 text-base font-bold text-[#0F172A]">{totalNum.toLocaleString("fr-DZ")} DA</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Versé aujourd'hui</p>
                  <p className={`mt-1 text-base font-bold ${paidNum === totalNum ? "text-green-700" : "text-blue-700"}`}>
                    {paidNum.toLocaleString("fr-DZ")} DA
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Reste dû</p>
                  <p className={`mt-1 text-base font-bold ${remainingNum > 0 ? "text-red-500" : "text-[#0F172A]"}`}>
                    {remainingNum.toLocaleString("fr-DZ")} DA
                  </p>
                </div>
                <div className="col-span-3 border-t border-slate-200/60 pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#64748B]">Statut du paiement :</span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    status === "Payé"
                      ? "bg-emerald-50 text-[#22C55E]"
                      : status === "Partiel"
                        ? "bg-blue-50 text-[#2563EB]"
                        : "bg-orange-50 text-[#F59E0B]"
                  }`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Method Badges selector */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                  <CreditCard className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Mode de règlement</h3>
              </div>

              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const isSelected = formData.method === method.value;
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, method: method.value }))}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-[#F59E0B] bg-amber-50/20 shadow-sm"
                          : "border-[#E2E8F0] bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${method.bg}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="text-sm font-bold text-[#0F172A]">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes & Practitioner */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                  <Info className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Administration</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="dentiste" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Dentiste traitant
                  </label>
                  <select
                    id="dentiste"
                    name="dentiste"
                    value={formData.dentiste}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#F59E0B]"
                  >
                    <option value="Dr Benali">Dr Benali</option>
                    <option value="Dr Amrani">Dr Amrani</option>
                    <option value="Dr Cherif">Dr Cherif</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Notes de transaction
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#F59E0B]"
                    placeholder="Numéro de chèque, transaction ID, remarques..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-amber-700/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Validation...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4.5 w-4.5" />
                    <span>Enregistrer le Paiement</span>
                  </>
                )}
              </button>
              <Link
                href="/paiements"
                className="flex h-11 w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50"
              >
                Annuler
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function NouveauPaiementPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-[#F59E0B]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <PaymentForm />
    </Suspense>
  );
}
