"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FilePlus,
  Info,
  Pill,
  Plus,
  Printer,
  Search,
  Trash2,
} from "lucide-react";

const mockPatients = [
  { id: "#P-000125", name: "Ahmed Benali", phone: "0555 22 33 44", age: 34 },
  { id: "#P-000126", name: "Sara Khaldi", phone: "0661 10 20 30", age: 29 },
  { id: "#P-000127", name: "Mohamed Amrani", phone: "0770 55 44 66", age: 42 },
  { id: "#P-000128", name: "Lina Cherif", phone: "0550 33 44 55", age: 26 },
  { id: "#P-000129", name: "Yacine Saadi", phone: "0777 44 55 66", age: 31 },
];

const mockMedicines = [
  "Amoxicilline 500mg (Capsule)",
  "Amoxicilline 1g (Comprimé)",
  "Ibuprofène 400mg (Comprimé)",
  "Paracétamol 1g (Comprimé)",
  "Métronidazole 500mg (Comprimé)",
  "Chlorhexidine 0.12% (Bain de bouche)",
  "Clamoxyl 1g (Comprimé)",
  "Prednisolone 20mg (Comprimé)",
  "Augmentin 1g (Comprimé)",
  "Eludril (Bain de bouche)",
];

interface MedicationRow {
  key: number;
  name: string;
  type: string;
  dosage: string;
  duration: string;
  quantity: string;
}

export default function NouvelleOrdonnancePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: "",
    patientSearch: "",
    dentiste: "Dr Benali",
    date: new Date().toISOString().split("T")[0],
    motifTraitement: "",
    instructionsGenerales: "Éviter les aliments durs pendant 48h. Consulter en cas de douleur ou gonflement.",
  });

  const [medications, setMedications] = useState<MedicationRow[]>([
    {
      key: Date.now(),
      name: "",
      type: "Comprimé",
      dosage: "1 comprimé 3 fois par jour",
      duration: "7 jours",
      quantity: "1 boîte",
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);

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

  const handleAddMedication = () => {
    setMedications((prev) => [
      ...prev,
      {
        key: Date.now() + Math.random(),
        name: "",
        type: "Comprimé",
        dosage: "",
        duration: "5 jours",
        quantity: "1 boîte",
      },
    ]);
  };

  const handleRemoveMedication = (key: number) => {
    setMedications((prev) => prev.filter((m) => m.key !== key));
  };

  const handleMedicationChange = (key: number, field: keyof MedicationRow, value: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.key === key ? { ...m, [field]: value } : m))
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientId) newErrors.patientId = "Veuillez sélectionner un patient";
    if (!formData.date) newErrors.date = "La date est obligatoire";
    if (!formData.motifTraitement.trim()) {
      newErrors.motifTraitement = "Le motif ou traitement est obligatoire";
    }

    const emptyMeds = medications.some((m) => !m.name.trim());
    if (emptyMeds) {
      newErrors.medications = "Veuillez remplir le nom de tous les médicaments ou supprimer les lignes vides";
    }

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
      motifTraitement: "",
      instructionsGenerales: "Éviter les aliments durs pendant 48h. Consulter en cas de douleur ou gonflement.",
    });
    setMedications([
      {
        key: Date.now(),
        name: "",
        type: "Comprimé",
        dosage: "1 comprimé 3 fois par jour",
        duration: "7 jours",
        quantity: "1 boîte",
      },
    ]);
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
            href="/ordonnances"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50"
            aria-label="Retour à la liste des ordonnances"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#7C3AED]">Dashboard</Link>
              <span className="mx-1.5">/</span>
              <Link href="/ordonnances" className="hover:text-[#7C3AED]">Ordonnances</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">Nouvelle ordonnance</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">
              Rédiger une Ordonnance
            </h2>
          </div>
        </div>
      </div>

      {showSuccess ? (
        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 text-center shadow-[0_20px_45px_rgba(124,58,237,0.06)] animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Ordonnance enregistrée avec succès !</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            L'ordonnance pour <strong>{selectedPatient?.name}</strong> a été enregistrée. Elle contient <strong>{medications.length} médicament(s)</strong> et est prête pour l'impression ou l'envoi.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50"
            >
              Rédiger une autre ordonnance
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
            >
              <Printer className="h-4 w-4" />
              Imprimer maintenant
            </button>
            <Link
              href="/ordonnances"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-200"
            >
              Retour aux ordonnances
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
          {/* Main Prescription Form */}
          <div className="space-y-6 xl:col-span-2">
            {/* Header & Patient metadata */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                  <Pill className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Informations de l'Ordonnance</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="patientSearch" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Patient destinataire <span className="text-red-500">*</span>
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
                          : "border-[#E2E8F0] focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-700/10"
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
                    Date d'émission <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-700/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="motifTraitement" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Motif / Traitement associé <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="motifTraitement"
                    name="motifTraitement"
                    value={formData.motifTraitement}
                    onChange={handleFormChange}
                    className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${
                      errors.motifTraitement
                        ? "border-red-300 focus:border-red-500"
                        : "border-[#E2E8F0] focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-700/10"
                    }`}
                    placeholder="ex: Extraction dentaire, Dévitalisation dent 46..."
                  />
                  {errors.motifTraitement && <p className="mt-1 text-xs font-bold text-red-500">{errors.motifTraitement}</p>}
                </div>
              </div>
            </div>

            {/* Medicines List Builder */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                    <Pill className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">Médicaments prescrits</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-purple-50 px-3.5 text-xs font-bold text-[#7C3AED] transition hover:bg-purple-100"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un médicament
                </button>
              </div>

              {errors.medications && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-500">
                  {errors.medications}
                </div>
              )}

              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div
                    key={med.key}
                    className="relative grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 pt-10 sm:grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr] sm:pt-4 sm:items-end"
                  >
                    {/* Delete button for mobile absolute placement */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(med.key)}
                      disabled={medications.length === 1}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-[#EF4444] transition hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent sm:hidden"
                      aria-label="Supprimer la ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                        Médicament {index + 1}
                      </label>
                      <input
                        type="text"
                        list="medicine-options"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(med.key, "name", e.target.value)}
                        placeholder="ex: Amoxicilline 500mg"
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium outline-none transition focus:border-[#7C3AED]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                        Forme
                      </label>
                      <select
                        value={med.type}
                        onChange={(e) => handleMedicationChange(med.key, "type", e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs font-bold text-[#0F172A] outline-none transition focus:border-[#7C3AED]"
                      >
                        <option value="Comprimé">Comprimé</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Bain de bouche">Bain de bouche</option>
                        <option value="Sirop">Sirop</option>
                        <option value="Gel/Pommade">Gel/Pommade</option>
                        <option value="Sachet">Sachet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                        Dosage / Posologie
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(med.key, "dosage", e.target.value)}
                        placeholder="ex: 1 gélule 3 fois par jour"
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium outline-none transition focus:border-[#7C3AED]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                        Durée
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicationChange(med.key, "duration", e.target.value)}
                        placeholder="ex: 7 jours"
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium outline-none transition focus:border-[#7C3AED]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                          Qté / Boîte
                        </label>
                        <input
                          type="text"
                          value={med.quantity}
                          onChange={(e) => handleMedicationChange(med.key, "quantity", e.target.value)}
                          placeholder="ex: 2 boîtes"
                          className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium outline-none transition focus:border-[#7C3AED]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(med.key)}
                        disabled={medications.length === 1}
                        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-100 text-[#EF4444] transition hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent sm:inline-flex"
                        aria-label="Supprimer la ligne"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <datalist id="medicine-options">
                {mockMedicines.map((m) => (
                  <option key={m} value={m.split(" (")[0]} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Signature & Doctor Metadata */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                  <FilePlus className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Praticien & Signature</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="dentiste" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Médecin prescripteur
                  </label>
                  <select
                    id="dentiste"
                    name="dentiste"
                    value={formData.dentiste}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#7C3AED]"
                  >
                    <option value="Dr Benali">Dr Benali</option>
                    <option value="Dr Amrani">Dr Dr Amrani</option>
                    <option value="Dr Cherif">Dr Cherif</option>
                  </select>
                </div>

                <div className="rounded-xl border border-dashed border-[#CBD5E1] p-3 text-center bg-slate-50/50">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[#64748B] mb-1">
                    <Printer className="h-4 w-4" />
                  </div>
                  <p className="text-[11px] font-bold text-[#64748B]">Signature électronique</p>
                  <p className="text-[10px] text-[#94A3B8]">Appliquée automatiquement à l'impression</p>
                </div>
              </div>
            </div>

            {/* General Instructions */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                  <Info className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Consignes générales</h3>
              </div>

              <div>
                <label htmlFor="instructionsGenerales" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Consignes au patient
                </label>
                <textarea
                  id="instructionsGenerales"
                  name="instructionsGenerales"
                  rows={4}
                  value={formData.instructionsGenerales}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#7C3AED]"
                  placeholder="ex: Prendre après les repas, rincer la bouche..."
                ></textarea>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Printer className="h-4.5 w-4.5" />
                    <span>Imprimer & Enregistrer</span>
                  </>
                )}
              </button>
              <Link
                href="/ordonnances"
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
