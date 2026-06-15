"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  HeartHandshake,
  Info,
  Phone,
  ShieldAlert,
  User,
  UserCheck,
} from "lucide-react";

export default function NouveauPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    genre: "Homme",
    telephone: "",
    email: "",
    adresse: "",
    groupeSanguin: "Non spécifié",
    dentiste: "Dr Benali",
    allergies: "",
    antecedents: "",
    contactUrgenceNom: "",
    contactUrgenceTel: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, name }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenreChange = (genre: "Homme" | "Femme") => {
    setFormData((prev) => ({ ...prev, genre }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est obligatoire";
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est obligatoire";
    } else if (!/^\d{9,10}$/.test(formData.telephone.replace(/\s/g, ""))) {
      newErrors.telephone = "Numéro de téléphone invalide (ex: 0555123456)";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      nom: "",
      prenom: "",
      dateNaissance: "",
      genre: "Homme",
      telephone: "",
      email: "",
      adresse: "",
      groupeSanguin: "Non spécifié",
      dentiste: "Dr Benali",
      allergies: "",
      antecedents: "",
      contactUrgenceNom: "",
      contactUrgenceTel: "",
      notes: "",
    });
    setErrors({});
    setShowSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
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
              <Link href="/dashboard" className="hover:text-[#0F766E]">Dashboard</Link>
              <span className="mx-1.5">/</span>
              <Link href="/patients" className="hover:text-[#0F766E]">Patients</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">Nouveau patient</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">
              Nouveau Dossier Patient
            </h2>
          </div>
        </div>
      </div>

      {showSuccess ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-center shadow-[0_20px_45px_rgba(16,185,129,0.06)] animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Dossier créé avec succès !</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Le dossier médical de <strong>{formData.prenom} {formData.nom.toUpperCase()}</strong> a été enregistré dans le système. Vous pouvez maintenant planifier un rendez-vous ou ajouter des traitements.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50"
            >
              Créer un autre dossier
            </button>
            <Link
              href="/patients"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0F766E] px-5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
            >
              Consulter la liste
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
          {/* Main Information Form Column */}
          <div className="space-y-6 xl:col-span-2">
            {/* Identity & Contact Card */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                  <User className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Informations d'identité & Contact</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${
                      errors.nom
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    }`}
                    placeholder="ex: Benali"
                  />
                  {errors.nom && <p className="mt-1 text-xs font-bold text-red-500">{errors.nom}</p>}
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${
                      errors.prenom
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    }`}
                    placeholder="ex: Ahmed"
                  />
                  {errors.prenom && <p className="mt-1 text-xs font-bold text-red-500">{errors.prenom}</p>}
                </div>

                <div>
                  <label htmlFor="dateNaissance" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateNaissance"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${
                      errors.dateNaissance
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    }`}
                  />
                  {errors.dateNaissance && <p className="mt-1 text-xs font-bold text-red-500">{errors.dateNaissance}</p>}
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Genre <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenreChange("Homme")}
                      className={`h-11 rounded-xl text-sm font-bold border transition ${
                        formData.genre === "Homme"
                          ? "bg-teal-50 border-[#0F766E] text-[#0F766E]"
                          : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-slate-50"
                      }`}
                    >
                      Homme
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenreChange("Femme")}
                      className={`h-11 rounded-xl text-sm font-bold border transition ${
                        formData.genre === "Femme"
                          ? "bg-teal-50 border-[#0F766E] text-[#0F766E]"
                          : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-slate-50"
                      }`}
                    >
                      Femme
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition ${
                        errors.telephone
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                      }`}
                      placeholder="ex: 0555123456"
                    />
                  </div>
                  {errors.telephone && <p className="mt-1 text-xs font-bold text-red-500">{errors.telephone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    E-mail <span className="text-xs text-[#94A3B8] font-normal">(Optionnel)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    placeholder="ex: patient@mail.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="adresse" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    placeholder="ex: Alger Centre, Alger"
                  />
                </div>
              </div>
            </div>

            {/* Medical Context Card */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Informations Médicales</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="groupeSanguin" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Groupe Sanguin
                  </label>
                  <select
                    id="groupeSanguin"
                    name="groupeSanguin"
                    value={formData.groupeSanguin}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                  >
                    <option value="Non spécifié">Non spécifié</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dentiste" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Dentiste Référent
                  </label>
                  <select
                    id="dentiste"
                    name="dentiste"
                    value={formData.dentiste}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                  >
                    <option value="Dr Benali">Dr Benali</option>
                    <option value="Dr Amrani">Dr Amrani</option>
                    <option value="Dr Cherif">Dr Cherif</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="allergies" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Allergies connues
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    rows={2}
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    placeholder="ex: Pénicilline, Aspirine, Latex... (laisser vide si aucune)"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="antecedents" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Antécédents médicaux
                  </label>
                  <textarea
                    id="antecedents"
                    name="antecedents"
                    rows={2}
                    value={formData.antecedents}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    placeholder="ex: Hypertension, Diabète, Maladies cardiaques..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Form Info Column */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                  <HeartHandshake className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Contact d'urgence</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="contactUrgenceNom" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Nom du contact
                  </label>
                  <input
                    type="text"
                    id="contactUrgenceNom"
                    name="contactUrgenceNom"
                    value={formData.contactUrgenceNom}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E]"
                    placeholder="ex: Karim Benali"
                  />
                </div>
                <div>
                  <label htmlFor="contactUrgenceTel" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                    Téléphone du contact
                  </label>
                  <input
                    type="tel"
                    id="contactUrgenceTel"
                    name="contactUrgenceTel"
                    value={formData.contactUrgenceTel}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E]"
                    placeholder="ex: 0661123456"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Administrative Info */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                  <FileText className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Notes administratives</h3>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Remarques
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#0F766E]"
                  placeholder="Notes complémentaires..."
                ></textarea>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 flex gap-2">
                <Info className="h-4.5 w-4.5 text-[#0F766E] shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold text-[#64748B] leading-4">
                  Les champs marqués d'une étoile (*) sont requis. La création du dossier valide la charte de confidentialité.
                </p>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none cursor-pointer"
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
                    <UserCheck className="h-4.5 w-4.5" />
                    <span>Créer le Dossier Patient</span>
                  </>
                )}
              </button>
              <Link
                href="/patients"
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
