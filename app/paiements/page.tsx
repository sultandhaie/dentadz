"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, ArrowLeftRight, Banknote, Calendar, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CreditCard, Download, Eye, FilePlus, Landmark,
  MessageCircle, MoreVertical, Plus, Printer, Search, Smartphone, Trash2,
  Wallet, X,
} from "lucide-react";
import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type PaymentStatus = "Payé" | "Partiel" | "Impayé" | "En retard" | "Annulé";
type PaymentMethod = "Cash" | "BaridiMob" | "CCP" | "Virement" | "Carte" | "—";

interface ApiPayment {
  id: number;
  payment_code: string;
  patient_id: number;
  appointment_id: number | null;
  amount: number;
  method: string;
  status: string;
  invoice_number: string | null;
  notes: string | null;
  payment_date: string;
  patient?: { id: number; first_name: string; last_name: string; phone: string; balance: number };
  appointment?: { id: number; treatment: string; dentist?: { name: string } };
}

type Payment = {
  id: string;
  invoice: string;
  patient: string;
  phone: string;
  treatment: string;
  total: number;
  paid: number;
  remaining: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  dentist: string;
};

type Stat = { title: string; value: string; label: string; icon: IconComponent; accent: string; };

function mapApiPayment(p: ApiPayment): Payment {
  const patientName = p.patient ? `${p.patient.first_name} ${p.patient.last_name}` : "Patient inconnu";
  const total = p.appointment ? p.amount : p.amount;
  return {
    id: p.payment_code || `PAY-${String(p.id).padStart(3, "0")}`,
    invoice: p.invoice_number || p.payment_code || `PAY-${String(p.id).padStart(3, "0")}`,
    patient: patientName,
    phone: p.patient?.phone || "",
    treatment: p.appointment?.treatment || p.notes || "Traitement",
    total: p.amount,
    paid: p.status === "Payé" ? p.amount : p.status === "Partiel" ? p.amount : 0,
    remaining: p.status === "Payé" ? 0 : p.status === "Partiel" ? 0 : p.amount,
    method: (p.method as PaymentMethod) || "—",
    status: p.status === "Payé" ? "Payé" : p.status === "Partiel" ? "Partiel" : p.status === "Annulé" ? "Annulé" : "Impayé",
    date: p.payment_date ? new Date(p.payment_date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "",
    dentist: p.appointment?.dentist?.name || "Dentiste",
  };
}

const panelClass = "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.05)] 2xl:p-5";

function cx(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); }
function formatDA(amount: number) { return `${new Intl.NumberFormat("fr-DZ").format(amount).replace(/\s/g, ".")} DA`; }
function getInitials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function getProgress(payment: Payment) { return payment.total > 0 ? Math.round((payment.paid / payment.total) * 100) : 0; }

function getStatusClasses(status: PaymentStatus) {
  const classes: Record<PaymentStatus, string> = { Payé: "border-green-200 bg-green-50 text-green-700", Partiel: "border-blue-200 bg-blue-50 text-blue-700", Impayé: "border-orange-200 bg-orange-50 text-orange-700", "En retard": "border-red-200 bg-red-50 text-red-700", Annulé: "border-slate-200 bg-slate-100 text-slate-700" };
  return classes[status];
}

function getMethodClasses(method: PaymentMethod) {
  const classes: Record<PaymentMethod, string> = { Cash: "bg-green-50 text-green-700", BaridiMob: "bg-indigo-50 text-indigo-700", CCP: "bg-blue-50 text-blue-700", Virement: "bg-slate-100 text-slate-700", "Carte": "bg-teal-50 text-teal-700", "—": "bg-slate-50 text-slate-400" };
  return classes[method] || classes["—"];
}

function MethodIcon({ method }: { method: PaymentMethod }) {
  const className = "h-3.5 w-3.5";
  switch (method) {
    case "Cash": return <Banknote className={className} aria-hidden="true" />;
    case "BaridiMob": return <Smartphone className={className} aria-hidden="true" />;
    case "CCP": return <Landmark className={className} aria-hidden="true" />;
    case "Virement": return <ArrowLeftRight className={className} aria-hidden="true" />;
    case "Carte": return <CreditCard className={className} aria-hidden="true" />;
    default: return null;
  }
}

function getPaidAmountClasses(payment: Payment) { if (payment.paid === payment.total) return "text-green-700"; if (payment.paid === 0) return "text-red-600"; return "text-blue-700"; }
function getRemainingAmountClasses(payment: Payment) { if (payment.remaining === 0) return "text-[#0F172A]"; if (payment.status === "En retard") return "text-red-600"; return "text-orange-600"; }

function StatusBadge({ status }: { status: PaymentStatus }) { return (<span className={cx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", getStatusClasses(status))}>{status}</span>); }
function Avatar({ name, className }: { name: string; className?: string }) { return (<span className={cx("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-md shadow-slate-900/10", className)}>{getInitials(name)}</span>); }
function MethodBadge({ method }: { method: PaymentMethod }) { return (<span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", getMethodClasses(method))}><MethodIcon method={method} />{method}</span>); }

function PageActions() {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
      <Link href="/paiements/nouveau" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl">
        <Plus className="h-4 w-4" aria-hidden="true" />Nouveau paiement
      </Link>
      <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50">
        <FilePlus className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />Créer facture
      </button>
      <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:bg-blue-50">
        <Download className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />Exporter
      </button>
    </div>
  );
}

function StatCard({ title, value, label, icon: Icon, accent }: Stat) {
  return (
    <article className="group min-h-32 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
          <p className="mt-2 truncate text-xl font-bold text-[#0F172A] 2xl:text-3xl">{value}</p>
          <p className="mt-1 text-xs font-bold text-[#64748B]">{label}</p>
        </div>
        <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg 2xl:h-11 2xl:w-11", accent)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function PaymentsTable({ payments, selectedPayment, onSelectPayment }: { payments: Payment[]; selectedPayment: Payment; onSelectPayment: (p: Payment) => void }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-xs font-bold text-[#64748B]">
            {["Facture", "Patient", "Traitement", "Montant total", "Payé", "Reste", "Méthode", "Statut", "Date", "Actions"].map((head) => (<th key={head} className="border-b border-[#E2E8F0] px-3 py-3">{head}</th>))}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const selected = payment.id === selectedPayment.id;
            return (
              <tr key={payment.id} onClick={() => onSelectPayment(payment)} className={cx("cursor-pointer transition hover:bg-slate-50/70", selected && "bg-teal-50/50 shadow-[inset_3px_0_0_#0F766E]")}>
                <td className="border-b border-slate-100 px-3 py-3"><button type="button" className="font-bold text-[#2563EB] hover:underline">{payment.invoice}</button></td>
                <td className="border-b border-slate-100 px-3 py-3"><div className="flex items-center gap-2.5"><Avatar name={payment.patient} className="h-9 w-9 text-xs" /><div className="min-w-0"><p className="truncate font-bold text-[#0F172A]">{payment.patient}</p><p className="text-xs font-medium text-[#64748B]">{payment.phone}</p></div></div></td>
                <td className="max-w-[170px] border-b border-slate-100 px-3 py-3 font-semibold text-[#0F172A]"><span className="line-clamp-2">{payment.treatment}</span></td>
                <td className="border-b border-slate-100 px-3 py-3 font-bold text-[#0F172A]">{formatDA(payment.total)}</td>
                <td className={cx("border-b border-slate-100 px-3 py-3 font-bold", getPaidAmountClasses(payment))}>{formatDA(payment.paid)}</td>
                <td className={cx("border-b border-slate-100 px-3 py-3 font-bold", getRemainingAmountClasses(payment))}>{formatDA(payment.remaining)}</td>
                <td className="border-b border-slate-100 px-3 py-3"><MethodBadge method={payment.method} /></td>
                <td className="border-b border-slate-100 px-3 py-3"><StatusBadge status={payment.status} /></td>
                <td className="border-b border-slate-100 px-3 py-3 font-medium text-[#64748B]">{payment.date}</td>
                <td className="border-b border-slate-100 px-3 py-3"><div className="flex items-center gap-1">
                  <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]" aria-label={`Voir ${payment.invoice}`}><Eye className="h-4 w-4" aria-hidden="true" /></button>
                  <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] transition hover:bg-slate-50 hover:text-[#0F766E]" aria-label={`Plus d'actions ${payment.invoice}`}><MoreVertical className="h-4 w-4" aria-hidden="true" /></button>
                </div></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PaymentMobileCard({ payment, selected, onSelect }: { payment: Payment; selected: boolean; onSelect: (p: Payment) => void }) {
  return (
    <article className={cx("rounded-xl border bg-white p-4 transition hover:border-[#0F766E]/40", selected ? "border-[#0F766E] bg-teal-50/30" : "border-[#E2E8F0]")} onClick={() => onSelect(payment)}>
      <div className="flex items-start justify-between gap-3">
        <div><button type="button" className="text-sm font-bold text-[#2563EB]">{payment.invoice}</button><h3 className="mt-1 font-bold text-[#0F172A]">{payment.patient}</h3><p className="text-xs font-semibold text-[#64748B]">{payment.phone}</p></div>
        <StatusBadge status={payment.status} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[#0F172A]">{payment.treatment}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
        <p className="font-semibold text-[#64748B]">Total<br /><span className="font-bold text-[#0F172A]">{formatDA(payment.total)}</span></p>
        <p className="font-semibold text-[#64748B]">Payé<br /><span className={cx("font-bold", getPaidAmountClasses(payment))}>{formatDA(payment.paid)}</span></p>
        <p className="font-semibold text-[#64748B]">Reste<br /><span className={cx("font-bold", getRemainingAmountClasses(payment))}>{formatDA(payment.remaining)}</span></p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><MethodBadge method={payment.method} /><span className="text-xs font-bold text-[#64748B]">{payment.date}</span></div>
      <div className="mt-3 grid grid-cols-[1fr_1fr_40px] gap-2">
        <button type="button" className="h-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0F172A]">Voir</button>
        <button type="button" className="h-10 rounded-xl bg-[#0F766E] text-sm font-bold text-white">Ajouter paiement</button>
        <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#64748B]" aria-label={`Plus d'actions ${payment.invoice}`}><MoreVertical className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </article>
  );
}

function PaymentDetailsPanel({ payment }: { payment: Payment }) {
  const progress = getProgress(payment);
  return (
    <aside className={cx(panelClass, "xl:sticky xl:top-4 xl:self-start")}>
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm font-bold text-[#64748B]">Détails du paiement</p><h2 className="mt-2 text-xl font-bold text-[#0F172A]">{payment.invoice}</h2></div>
        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-slate-50" aria-label="Fermer"><X className="h-4 w-4" aria-hidden="true" /></button>
      </div>
      <div className="mt-3"><StatusBadge status={payment.status} /></div>
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3">
        <Avatar name={payment.patient} />
        <div className="min-w-0"><p className="truncate font-bold text-[#0F172A]">{payment.patient}</p><p className="truncate text-sm font-semibold text-[#64748B]">{payment.treatment}</p></div>
      </div>
      <dl className="mt-5 space-y-3">
        {[["Montant total", formatDA(payment.total), "text-[#0F172A]"], ["Payé", formatDA(payment.paid), getPaidAmountClasses(payment)], ["Reste à payer", formatDA(payment.remaining), getRemainingAmountClasses(payment)], ["Statut", payment.status, "text-[#0F172A]"], ["Méthode", payment.method, "text-[#0F172A]"], ["Date", payment.date, "text-[#0F172A]"], ["Dentiste", payment.dentist, "text-[#0F172A]"]].map(([label, value, color]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm"><dt className="font-semibold text-[#64748B]">{label}</dt><dd className={cx("text-right font-bold", color)}>{value}</dd></div>
        ))}
      </dl>
      <section className="mt-5 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-4">
        <div className="flex items-center justify-between gap-3 text-sm font-bold"><span className="text-[#0F172A]">{progress}% payé</span><span className="text-[#64748B]">{formatDA(payment.paid)} / {formatDA(payment.total)}</span></div>
        <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${progress}%` }} /></div>
      </section>
      <div className="mt-5 grid gap-2">
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-[#115E59]"><Plus className="h-4 w-4" aria-hidden="true" />Ajouter paiement</button>
        {[["Imprimer reçu", Printer, "text-[#0F766E]"], ["Télécharger facture", Download, "text-[#2563EB]"], ["Envoyer rappel WhatsApp", MessageCircle, "text-green-700"]].map(([label, Icon, color]) => {
          const ActionIcon = Icon as IconComponent;
          return (<button key={label as string} type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"><ActionIcon className={cx("h-4 w-4", color as string)} aria-hidden="true" />{label as string}</button>);
        })}
        <button type="button" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#EF4444] transition hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden="true" />Annuler facture</button>
      </div>
    </aside>
  );
}

function Pagination({ meta, currentPage, onPageChange }: { meta: { last_page: number; total: number; per_page: number }; currentPage: number; onPageChange: (page: number) => void }) {
  return (
    <footer className="grid gap-3 border-t border-[#E2E8F0] px-4 py-4 2xl:grid-cols-[1fr_auto_auto] 2xl:items-center 2xl:justify-between">
      <p className="text-sm font-semibold text-[#64748B] 2xl:whitespace-nowrap">Affichage {((currentPage - 1) * meta.per_page) + 1} - {Math.min(currentPage * meta.per_page, meta.total)} sur {meta.total} paiements</p>
      <div className="flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2">
        {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map((page) => (
          <button key={page} type="button" onClick={() => onPageChange(page)} className={cx("inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition", page === currentPage ? "border-[#0F766E] bg-[#0F766E] text-white" : "border-slate-200 bg-white text-[#64748B] hover:bg-slate-50")}>{page}</button>
        ))}
      </div>
    </footer>
  );
}

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ last_page: 1, total: 0, per_page: 15 });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = (page: number = 1) => {
    const token = localStorage.getItem("auth_token") || "";
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    Promise.all([
      fetch(`${base}/payments?page=${page}&per_page=15`, { headers }).then(r => r.json()),
      fetch(`${base}/payments/stats`, { headers }).then(r => r.json()),
    ]).then(([paymentsData, statsData]) => {
      const mapped = (paymentsData?.data || []).map(mapApiPayment);
      setPayments(mapped);
      setSelectedPayment(mapped[0] || null);
      setMeta(paymentsData?.meta || { last_page: 1, total: 0, per_page: 15 });
      setCurrentPage(page);
      setStats([
        { title: "Revenus du mois", value: formatDA(statsData.total_this_month || 0), label: "Ce mois", icon: Wallet, accent: "from-[#0F766E] to-[#2DD4BF]" },
        { title: "Total reçu", value: formatDA(statsData.total_received || 0), label: "Total payé", icon: CreditCard, accent: "from-[#2563EB] to-[#60A5FA]" },
        { title: "En attente", value: formatDA(statsData.total_pending || 0), label: "À encaisser", icon: AlertCircle, accent: "from-[#F59E0B] to-[#FDBA74]" },
        { title: "Transactions", value: String(meta.total || payments.length), label: "Total", icon: CheckCircle2, accent: "from-[#22C55E] to-[#86EFAC]" },
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(1); }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" /></div>;
  }

  return (
    <section className="space-y-5">
      <div className="flex justify-end"><PageActions /></div>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques paiements">
        {stats.map((stat) => (<StatCard key={stat.title} {...stat} />))}
      </section>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-5">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto md:block">
              <PaymentsTable payments={payments} selectedPayment={selectedPayment || payments[0]} onSelectPayment={setSelectedPayment} />
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {payments.map((payment) => (<PaymentMobileCard key={payment.id} payment={payment} selected={payment.id === selectedPayment?.id} onSelect={setSelectedPayment} />))}
            </div>
            <Pagination meta={meta} currentPage={currentPage} onPageChange={fetchPayments} />
          </article>
        </section>
        {selectedPayment && <PaymentDetailsPanel payment={selectedPayment} />}
      </div>
    </section>
  );
}
