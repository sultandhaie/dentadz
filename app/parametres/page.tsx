"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";
import {
  Badge,
  Bell,
  Building2,
  Calendar,
  CalendarClock,
  CalendarDays,
  Camera,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Clock3,
  CloudUpload,
  CreditCard,
  DatabaseBackup,
  Download,
  Eye,
  FileText,
  Hash,
  Languages,
  List,
  Loader2,
  Lock,
  Mail,
  MoreVertical,
  Pencil,
  Percent,
  Phone,
  Plus,
  Printer,
  RefreshCcw,
  Ruler,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Sun,
  Tag,
  Timer,
  Trash2,
  TriangleAlert,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type SettingRow =
  | { type: "select"; label: string; value: string; icon: IconComponent; description?: string }
  | { type: "input"; label: string; value: string; icon: IconComponent; description?: string }
  | { type: "toggle"; label: string; enabled: boolean; icon: IconComponent; description?: string }
  | { type: "action"; label: string; buttonLabel: string; icon: IconComponent; description?: string; danger?: boolean };

interface ClinicInfo {
  name: string;
  specialty: string;
  phone: string;
  email: string;
  address: string;
  website: string;
}

interface ClinicSetting {
  id: number;
  key: string;
  value: string;
  group: string;
  type: string;
  label: string;
  description: string;
  is_public: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  specialty: string;
  phone: string;
  is_active: boolean;
  last_login_at: string | null;
}

const tabs = [
  { label: "Général", icon: Settings },
  { label: "Cabinet", icon: Building2 },
  { label: "Utilisateurs", icon: Users },
  { label: "Rendez-vous", icon: CalendarDays },
  { label: "Paiements", icon: CreditCard },
  { label: "Notifications", icon: Bell },
  { label: "Sécurité", icon: Shield },
  { label: "Sauvegarde", icon: DatabaseBackup },
];

const defaultClinicInfo: ClinicInfo = {
  name: "",
  specialty: "",
  phone: "",
  email: "",
  address: "",
  website: "",
};

const generalPreferences: SettingRow[] = [
  { type: "select", label: "Langue de l'interface", value: "Français", icon: Languages },
  { type: "select", label: "Fuseau horaire", value: "(UTC+1) Afrique/Alger", icon: Clock },
  { type: "select", label: "Format de date", value: "DD MMM YYYY (10 Juin 2026)", icon: Calendar },
  { type: "select", label: "Format d'heure", value: "24 heures (14:30)", icon: Timer },
  { type: "select", label: "Devise", value: "Dinar Algérien (DA)", icon: CircleDollarSign },
  { type: "select", label: "Thème", value: "Clair", icon: Sun },
];

const appointmentSettings: SettingRow[] = [
  { type: "select", label: "Durée par défaut d'un rendez-vous", value: "30 minutes", icon: Clock3 },
  { type: "select", label: "Intervalle entre les rendez-vous", value: "15 minutes", icon: CalendarClock },
  { type: "toggle", label: "Autoriser la prise de rendez-vous en ligne", description: "Les patients peuvent réserver via le lien public", enabled: true, icon: CalendarDays },
  { type: "toggle", label: "Rappel automatique par SMS/Email", description: "Envoyer un rappel avant chaque rendez-vous", enabled: true, icon: Bell },
  { type: "toggle", label: "Notifications des nouveaux rendez-vous", description: "Recevoir une notification lors d'un nouveau rendez-vous", enabled: true, icon: Clock },
];

const paymentSettings: SettingRow[] = [
  { type: "input", label: "Taux de TVA (%)", value: "19", icon: Percent },
  { type: "input", label: "Préfixe des factures", value: "FAC-2026-", icon: FileText },
  { type: "select", label: "Conditions de paiement", value: "Paiement immédiat", icon: CreditCard },
  { type: "toggle", label: "Activer les remises", description: "Autoriser les remises sur les factures", enabled: true, icon: Tag },
  { type: "toggle", label: "Afficher les prix TTC", description: "Les prix incluent la TVA", enabled: true, icon: Eye },
];

const notificationSettings: SettingRow[] = [
  { type: "toggle", label: "Email pour nouveaux rendez-vous", description: "Recevoir un email lors d'un nouveau RDV", enabled: true, icon: Mail },
  { type: "toggle", label: "Email pour paiements reçus", description: "Notification lors d'un encaissement", enabled: true, icon: CreditCard },
  { type: "toggle", label: "Email pour patients en attente", description: "Alerte quand un patient attend", enabled: false, icon: Users },
  { type: "toggle", label: "Notifications SMS patients", description: "Envoyer des SMS aux patients (rappels)", enabled: true, icon: Smartphone },
  { type: "toggle", label: "Son d'alerte en salle d'attente", description: "Jouer un son lors de l'appel d'un patient", enabled: true, icon: Bell },
];

const securitySettings: SettingRow[] = [
  { type: "toggle", label: "Double authentification", description: "Exiger un code supplémentaire à la connexion", enabled: false, icon: ShieldCheck },
  { type: "select", label: "Durée de session", value: "60 minutes", icon: Clock },
  { type: "toggle", label: "Verrouillage après échecs", description: "Bloquer le compte après 5 tentatives", enabled: true, icon: Shield },
  { type: "action", label: "Changer le mot de passe", description: "Modifier votre mot de passe actuel", buttonLabel: "Modifier", icon: Lock },
  { type: "action", label: "Historique des connexions", description: "Voir les dernières connexions", buttonLabel: "Voir", icon: Eye },
];

const backupSettings: SettingRow[] = [
  { type: "toggle", label: "Sauvegarde automatique", description: "Sauvegarder quotidiennement à 02:30", enabled: true, icon: DatabaseBackup },
  { type: "select", label: "Fréquence des sauvegardes", value: "Quotidienne", icon: Calendar },
  { type: "select", label: "Rétention des sauvegardes", value: "30 jours", icon: Timer },
  { type: "action", label: "Sauvegarder maintenant", description: "Créer une sauvegarde immédiate", buttonLabel: "Sauvegarder", icon: CloudUpload },
  { type: "action", label: "Restaurer une sauvegarde", description: "Restaurer à un point précédent", buttonLabel: "Restaurer", icon: RefreshCcw },
  { type: "action", label: "Exporter les données", description: "Télécharger toutes les données en CSV", buttonLabel: "Exporter", icon: Download },
];

const panelClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.05)] transition hover:shadow-md 2xl:p-5";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function ToggleSwitch({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={cx("relative inline-flex h-6 w-11 shrink-0 rounded-full transition", enabled ? "bg-[#0F766E]" : "bg-slate-300")}
    >
      <span className={cx("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition", enabled ? "left-6" : "left-1")} />
    </button>
  );
}

function FormInput({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#64748B]">{label}</span>
      <input
        defaultValue={value}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-teal-700/10"
      />
    </label>
  );
}

function SettingsTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <nav className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-sm" aria-label="Paramètres">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onTabChange(tab.label)}
              className={cx(
                "inline-flex h-10 items-center gap-2 rounded-xl border-b-2 px-3 text-sm font-bold transition",
                active ? "border-[#0F766E] bg-teal-50 text-teal-700" : "border-transparent text-slate-600 hover:bg-slate-50",
              )}
            >
              <tab.icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SettingRowItem({ row }: { row: SettingRow }) {
  const [enabled, setEnabled] = useState(row.type === "toggle" ? row.enabled : false);
  const Icon = row.icon;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 transition hover:bg-slate-50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#0F172A]">{row.label}</p>
        {"description" in row && row.description ? <p className="line-clamp-2 text-xs font-medium text-[#64748B]">{row.description}</p> : null}
      </div>
      {row.type === "toggle" ? (
        <ToggleSwitch enabled={enabled} onChange={() => setEnabled((value) => !value)} label={row.label} />
      ) : row.type === "action" ? (
        <button type="button" className={cx("h-9 rounded-lg border px-3 text-sm font-bold transition", row.danger ? "border-red-200 bg-white text-[#EF4444] hover:bg-red-50" : "border-slate-200 bg-white text-[#0F766E] hover:bg-teal-50")}>
          {row.buttonLabel}
        </button>
      ) : (
        <button type="button" className="flex h-9 min-w-0 max-w-[150px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
          <span className="truncate">{row.value}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#64748B]" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function SettingsCard({ title, rows }: { title: string; rows: SettingRow[] }) {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((row) => <SettingRowItem key={row.label} row={row} />)}
      </div>
    </article>
  );
}

function ClinicInformationCard({ clinicInfo }: { clinicInfo: ClinicInfo }) {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Informations du cabinet</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-[160px_1fr]">
        <div className="flex justify-center lg:justify-start">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <Badge className="h-16 w-16 text-[#0F766E]" aria-hidden="true" />
            <button type="button" className="absolute -bottom-2 -right-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F766E] shadow-md" aria-label="Modifier le logo">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Nom du cabinet" value={clinicInfo.name} />
          <FormInput label="Spécialité" value={clinicInfo.specialty} />
          <FormInput label="Téléphone" value={clinicInfo.phone} />
          <FormInput label="Email" value={clinicInfo.email} />
          <div className="sm:col-span-2"><FormInput label="Adresse" value={clinicInfo.address} /></div>
          <div className="sm:col-span-2"><FormInput label="Site web optionnel" value={clinicInfo.website} /></div>
          <div className="sm:col-span-2 sm:flex sm:justify-end">
            <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto">
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function UsersCard({ users }: { users: User[] }) {
  const roleLabels: Record<string, string> = {
    admin: "Administrateur",
    dentist: "Dentiste",
    receptionist: "Réceptionniste",
    assistant: "Assistant(e)",
  };

  const roleColors: Record<string, string> = {
    admin: "bg-purple-50 text-purple-700",
    dentist: "bg-blue-50 text-blue-700",
    receptionist: "bg-teal-50 text-teal-700",
    assistant: "bg-orange-50 text-orange-700",
  };

  return (
    <article className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#0F172A]">Utilisateurs du cabinet</h2>
        <button type="button" className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-3 text-sm font-bold text-white transition hover:bg-[#115E59]">
          <UserPlus className="h-4 w-4" />
          Ajouter
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {users.length === 0 ? (
          <p className="py-4 text-center text-sm font-semibold text-[#64748B]">Aucun utilisateur trouvé.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 transition hover:bg-slate-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0F172A]">{user.name}</p>
                <p className="truncate text-xs font-medium text-[#64748B]">{user.email}</p>
              </div>
              <span className={cx("rounded-full px-2.5 py-1 text-xs font-bold", roleColors[user.role] || "bg-slate-100 text-slate-700")}>
                {roleLabels[user.role] || user.role}
              </span>
              <span className={cx("h-2.5 w-2.5 rounded-full", user.is_active ? "bg-green-500" : "bg-red-400")} />
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function ProfileCard() {
  return (
    <article className={cx(panelClass, "text-center")}>
      <h2 className="text-left text-lg font-semibold text-[#0F172A]">Profil du cabinet</h2>
      <div className="mt-4 flex flex-col items-center">
        <div className="relative">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-2xl font-bold text-white shadow-lg">
            {getInitials("Dr Benali")}
          </span>
          <button type="button" className="absolute bottom-0 right-0 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F766E] shadow-md" aria-label="Modifier le profil">
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-4 text-lg font-bold text-[#0F172A]">Dr Benali</h3>
        <p className="text-sm font-semibold text-[#64748B]">Administrateur principal</p>
        <p className="mt-3 text-sm font-semibold text-[#0F172A]">dr.benali@dentadz.dz</p>
        <p className="text-sm font-semibold text-[#64748B]">0555 12 34 56</p>
        <button type="button" className="mt-4 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F766E] transition hover:bg-teal-50">
          Modifier le profil
        </button>
      </div>
    </article>
  );
}

function ShortcutsCard() {
  const shortcuts = [
    { label: "Modèles d'ordonnances", icon: FileText },
    { label: "Catégories de traitements", icon: Stethoscope },
    { label: "Moyens de paiement", icon: CreditCard },
    { label: "Pharmacies", icon: Building2 },
    { label: "Assurances", icon: ShieldCheck },
  ];

  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Raccourcis utiles</h2>
      <div className="mt-4 space-y-2">
        {shortcuts.map((shortcut) => (
          <button key={shortcut.label} type="button" className="flex w-full items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 text-left transition hover:bg-slate-50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
              <shortcut.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#0F172A]">{shortcut.label}</span>
            <ChevronRight className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
          </button>
        ))}
      </div>
    </article>
  );
}

function BackupCard() {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Sauvegardes récentes</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div><dt className="font-bold text-[#64748B]">Dernière sauvegarde</dt><dd className="mt-1 font-bold text-[#0F172A]">10 Juin 2026 à 02:30</dd></div>
        <div><dt className="font-bold text-[#64748B]">Prochaine sauvegarde</dt><dd className="mt-1 font-bold text-[#0F172A]">11 Juin 2026 à 02:30</dd></div>
      </dl>
      <button type="button" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F766E] transition hover:bg-teal-50">
        <CloudUpload className="h-4 w-4" />
        Sauvegarder maintenant
      </button>
    </article>
  );
}

function SystemInfoCard() {
  return (
    <article className={panelClass}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Informations système</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3"><dt className="font-semibold text-[#64748B]">Version de l'application</dt><dd className="font-bold text-[#0F172A]">v2.4.0</dd></div>
        <div className="flex items-center justify-between gap-3"><dt className="font-semibold text-[#64748B]">Base de données</dt><dd className="font-bold text-[#0F172A]">MySQL 8.0</dd></div>
        <div>
          <div className="flex items-center justify-between gap-3"><dt className="font-semibold text-[#64748B]">Espace utilisé</dt><dd className="font-bold text-[#0F172A]">2.45 GB / 10 GB</dd></div>
          <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0F766E]" style={{ width: "24%" }} /></div>
          <p className="mt-1 text-xs font-bold text-[#64748B]">24% utilisé</p>
        </div>
      </dl>
    </article>
  );
}

export default function ParametresPage() {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(defaultClinicInfo);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Général");

  useEffect(() => {
    Promise.all([
      api<ClinicSetting[]>("/clinic-settings"),
      api<User[]>("/dentists").catch(() => [] as User[]),
    ])
      .then(([settings, dentists]) => {
        const map: Record<string, string> = {};
        for (const s of settings) {
          map[s.key] = s.value;
        }
        setClinicInfo({
          name: map["clinic_name"] || "",
          specialty: map["clinic_specialty"] || "",
          phone: map["clinic_phone"] || "",
          email: map["clinic_email"] || "",
          address: map["clinic_address"] || "",
          website: map["clinic_website"] || "",
        });
        setUsers(dentists);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F766E]" />
        <span className="ml-3 text-sm font-semibold text-[#64748B]">Chargement des paramètres…</span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center justify-center py-32">
        <TriangleAlert className="h-8 w-8 text-red-500" />
        <span className="ml-3 text-sm font-semibold text-red-500">{error}</span>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0">
          {activeTab === "Général" && (
            <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
              <SettingsCard title="Préférences générales" rows={generalPreferences} />
              <SettingsCard title="Préférences médicales" rows={[
                { type: "select", label: "Système de numérotation dentaire", value: "FDI (Système international)", icon: Hash },
                { type: "select", label: "Unités de mesure", value: "Métrique (mm, cm, kg)", icon: Ruler },
                { type: "toggle", label: "Afficher les allergies patients", description: "Alerter en cas d'allergie connue", enabled: true, icon: TriangleAlert },
                { type: "select", label: "Modèles d'ordonnances par défaut", value: "Modèle standard", icon: FileText },
              ]} />
              <SettingsCard title="Autres paramètres" rows={[
                { type: "select", label: "Nombre de résultats par page", value: "10", icon: List },
                { type: "toggle", label: "Mode maintenance", description: "Désactiver temporairement l'accès au système", enabled: false, icon: Wrench },
                { type: "action", label: "Suppression des données", description: "Supprimer définitivement des données", buttonLabel: "Gérer", danger: true, icon: Trash2 },
              ]} />
            </div>
          )}

          {activeTab === "Cabinet" && (
            <ClinicInformationCard clinicInfo={clinicInfo} />
          )}

          {activeTab === "Utilisateurs" && (
            <UsersCard users={users} />
          )}

          {activeTab === "Rendez-vous" && (
            <SettingsCard title="Paramètres des rendez-vous" rows={appointmentSettings} />
          )}

          {activeTab === "Paiements" && (
            <SettingsCard title="Paramètres des paiements" rows={paymentSettings} />
          )}

          {activeTab === "Notifications" && (
            <SettingsCard title="Paramètres des notifications" rows={notificationSettings} />
          )}

          {activeTab === "Sécurité" && (
            <SettingsCard title="Paramètres de sécurité" rows={securitySettings} />
          )}

          {activeTab === "Sauvegarde" && (
            <SettingsCard title="Paramètres de sauvegarde" rows={backupSettings} />
          )}
        </section>
        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          {activeTab === "Cabinet" && <ProfileCard />}
          {activeTab === "Sauvegarde" && <BackupCard />}
          <ShortcutsCard />
          <SystemInfoCard />
        </aside>
      </div>
    </section>
  );
}
