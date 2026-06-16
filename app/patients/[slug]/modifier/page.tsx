"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileText,
  HeartHandshake,
  Info,
  Loader2,
  Phone,
  ShieldAlert,
  User,
  UserCheck,
} from "lucide-react";
import { api } from "../../../../lib/api";

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  birth_date: string;
  gender: string;
  address: string;
  blood_type: string;
  allergies: string;
  medical_notes: string;
  emergency_contact: string;
  emergency_phone: string;
  status: string;
  assigned_dentist_id: number | null;
}

interface Dentist {
  id: number;
  name: string;
  specialty?: string;
}

export default function ModifierPatientPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    birth_date: "",
    gender: "Homme",
    address: "",
    blood_type: "",
    allergies: "",
    medical_notes: "",
    emergency_contact: "",
    emergency_phone: "",
    status: "Actif",
    assigned_dentist_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const token = localStorage.getItem("auth_token") || "";

    Promise.all([
      api<Patient>(`/patients/${slug}`, { token }),
      api<Dentist[]>("/dentists", { token }),
    ])
      .then(([patient, dentistsList]) => {
        setFormData({
          first_name: patient.first_name || "",
          last_name: patient.last_name || "",
          phone: patient.phone || "",
          email: patient.email || "",
          birth_date: patient.birth_date || "",
          gender: patient.gender || "Homme",
          address: patient.address || "",
          blood_type: patient.blood_type || "",
          allergies: patient.allergies || "",
          medical_notes: patient.medical_notes || "",
          emergency_contact: patient.emergency_contact || "",
          emergency_phone: patient.emergency_phone || "",
          status: patient.status || "Actif",
          assigned_dentist_id: patient.assigned_dentist_id ? String(patient.assigned_dentist_id) : "",
        });
        setDentists(dentistsList);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est obligatoire";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est obligatoire";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est obligatoire";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    const token = localStorage.getItem("auth_token") || "";
    const payload: Record<string, unknown> = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      status: formData.status,
    };

    if (formData.email.trim()) payload.email = formData.email.trim();
    if (formData.birth_date) payload.birth_date = formData.birth_date;
    if (formData.address.trim()) payload.address = formData.address.trim();
    if (formData.blood_type) payload.blood_type = formData.blood_type;
    if (formData.assigned_dentist_id) payload.assigned_dentist_id = Number(formData.assigned_dentist_id);
    if (formData.allergies.trim()) payload.allergies = formData.allergies.trim();
    if (formData.medical_notes.trim()) payload.medical_notes = formData.medical_notes.trim();
    if (formData.emergency_contact.trim()) payload.emergency_contact = formData.emergency_contact.trim();
    if (formData.emergency_phone.trim()) payload.emergency_phone = formData.emergency_phone.trim();

    try {
      await api(`/patients/${slug}`, {
        method: "PUT",
        token,
        body: JSON.stringify(payload),
      });
      setShowSuccess(true);
      setTimeout(() => router.push("/patients"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444]">
            <AlertCircle className="h-7 w-7" />
          </span>
          <p className="text-sm font-bold text-[#0F172A]">{error}</p>
          <Link
            href={`/patients/${slug}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dossier
          </Link>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-center shadow-[0_20px_45px_rgba(16,185,129,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Dossier mis à jour avec succès !</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Les informations de <strong>{formData.first_name} {formData.last_name.toUpperCase()}</strong> ont été enregistrées.
          </p>
          <p className="mt-3 text-xs font-semibold text-[#64748B]">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/patients/${slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50"
            aria-label="Retour au dossier patient"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-[#0F766E]">Dashboard</Link>
              <span className="mx-1.5">/</span>
              <Link href="/patients" className="hover:text-[#0F766E]">Patients</Link>
              <span className="mx-1.5">/</span>
              <Link href={`/patients/${slug}`} className="hover:text-[#0F766E]">{formData.first_name} {formData.last_name}</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#0F172A]">Modifier</span>
            </nav>
            <h2 className="mt-1 text-xl font-bold text-[#0F172A] sm:text-2xl">
              Modifier le dossier
            </h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {serverError}
            </div>
          )}

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <User className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Informations d&apos;identité & Contact</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="last_name" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${
                    errors.last_name
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                  }`}
                  placeholder="ex: Benali"
                />
                {errors.last_name && <p className="mt-1 text-xs font-bold text-red-500">{errors.last_name}</p>}
              </div>

              <div>
                <label htmlFor="first_name" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition ${
                    errors.first_name
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                  }`}
                  placeholder="ex: Ahmed"
                />
                {errors.first_name && <p className="mt-1 text-xs font-bold text-red-500">{errors.first_name}</p>}
              </div>

              <div>
                <label htmlFor="birth_date" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Genre
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                >
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                    }`}
                    placeholder="ex: 0555123456"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs font-bold text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  E-mail
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
                <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                  placeholder="ex: Alger Centre, Alger"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <ShieldAlert className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Informations Médicales</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="blood_type" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Groupe Sanguin
                </label>
                <select
                  id="blood_type"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                >
                  <option value="">Non spécifié</option>
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
                <label htmlFor="assigned_dentist_id" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Dentiste Référent
                </label>
                <select
                  id="assigned_dentist_id"
                  name="assigned_dentist_id"
                  value={formData.assigned_dentist_id}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                >
                  <option value="">Sélectionner un dentiste</option>
                  {dentists.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}{d.specialty ? ` — ${d.specialty}` : ""}
                    </option>
                  ))}
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
                  placeholder="ex: Pénicilline, Aspirine, Latex..."
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="medical_notes" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Notes médicales
                </label>
                <textarea
                  id="medical_notes"
                  name="medical_notes"
                  rows={3}
                  value={formData.medical_notes}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
                  placeholder="Notes complémentaires..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                <HeartHandshake className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Contact d&apos;urgence</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="emergency_contact" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Nom du contact
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E]"
                  placeholder="ex: Karim Benali"
                />
              </div>
              <div>
                <label htmlFor="emergency_phone" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                  Téléphone du contact
                </label>
                <input
                  type="tel"
                  id="emergency_phone"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium outline-none transition focus:border-[#0F766E]"
                  placeholder="ex: 0661123456"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Statut</h3>
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wide text-[#64748B] mb-1.5">
                Statut du patient
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
              >
                <option value="Actif">Actif</option>
                <option value="En traitement">En traitement</option>
                <option value="Nouveau">Nouveau</option>
                <option value="En retard">En retard</option>
              </select>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 flex gap-2">
              <Info className="h-4.5 w-4.5 text-[#0F766E] shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-[#64748B] leading-4">
                Les champs marqués d&apos;une étoile (*) sont requis.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4.5 w-4.5" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
            <Link
              href={`/patients/${slug}`}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] shadow-sm transition hover:bg-slate-50"
            >
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
