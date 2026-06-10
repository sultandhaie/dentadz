import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Cloud,
  CreditCard,
  FileText,
  Globe,
  Headphones,
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  MonitorSmartphone,
  PieChart,
  PlayCircle,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  TabletSmartphone,
  Users,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Feature = {
  title: string;
  text: string;
  icon: IconComponent;
};

type PricingPlan = {
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

type Testimonial = {
  name: string;
  location: string;
  text: string;
};

type FAQItem = {
  question: string;
  answer?: string;
};

const navLinks = ["Accueil", "Fonctionnalités", "Solutions", "Tarifs", "À propos", "FAQ", "Contact"];

const trustStats = [
  ["500+", "Cabinets utilisent DentaDZ"],
  ["10.000+", "Patients gérés"],
  ["25.000+", "Rendez-vous planifiés"],
  ["98%", "Clients satisfaits"],
  ["24/7", "Support disponible"],
];

const problems: Feature[] = [
  {
    title: "Rendez-vous difficiles à suivre",
    text: "Les annulations, retards et absences deviennent difficiles à gérer sans un système clair.",
    icon: CalendarDays,
  },
  {
    title: "Dossiers patients dispersés",
    text: "Les informations médicales, notes et traitements sont souvent séparés entre papier, téléphone et fichiers.",
    icon: Users,
  },
  {
    title: "Paiements non suivis",
    text: "Les acomptes, restes à payer et factures peuvent vite devenir compliqués à contrôler.",
    icon: CreditCard,
  },
  {
    title: "Manque de visibilité",
    text: "Sans statistiques, il est difficile de suivre la performance du cabinet.",
    icon: BarChart3,
  },
];

const features: Feature[] = [
  { title: "Gestion des patients", text: "Dossiers complets, historique médical, notes et documents.", icon: Users },
  { title: "Rendez-vous intelligents", text: "Planning intelligent, rappels automatiques et suivi des absences.", icon: CalendarDays },
  { title: "Salle d’attente", text: "Suivi en temps réel du flux patients et appel du prochain patient.", icon: ClipboardList },
  { title: "Plan dentaire", text: "Schéma dentaire, devis et traitement personnalisé.", icon: HeartPulse },
  { title: "Traitements", text: "Actes dentaires, catégories, durées, prix et coûts.", icon: Stethoscope },
  { title: "Paiements", text: "Factures, acomptes, restes à payer et reçus.", icon: CreditCard },
  { title: "Ordonnances", text: "Ordonnances professionnelles, médicaments et impression PDF.", icon: FileText },
  { title: "Rapports", text: "Statistiques complètes, revenus, performances et paiements.", icon: PieChart },
  { title: "Utilisateurs", text: "Multi-utilisateurs, rôles et permissions.", icon: ShieldCheck },
  { title: "Paramètres", text: "Personnalisation, préférences et sauvegardes.", icon: LayoutDashboard },
];

const localAdvantages: Feature[] = [
  { title: "Devise DA", text: "Tarifs, factures et rapports adaptés au Dinar Algérien.", icon: CircleDollarSign },
  { title: "Cash, CCP, BaridiMob", text: "Suivi des moyens de paiement utilisés localement.", icon: CreditCard },
  { title: "Français / Arabe", text: "Interface prête pour les équipes francophones et arabophones.", icon: Globe },
  { title: "Numéros 05 / 06 / 07", text: "Fiches patients alignées avec les formats locaux.", icon: TabletSmartphone },
  { title: "Documents imprimables", text: "Factures, reçus et ordonnances prêts pour le cabinet.", icon: ReceiptText },
  { title: "Afrique/Alger", text: "Fuseau horaire et planning adaptés au quotidien du cabinet.", icon: MapPin },
  { title: "Rappels WhatsApp", text: "Communication simple avec les patients.", icon: MessageCircle },
  { title: "Multi-dentistes", text: "Organisation claire pour cabinets et cliniques.", icon: Stethoscope },
];

const workflowSteps = [
  ["Le patient arrive", "La réception l’ajoute à la salle d’attente ou confirme son rendez-vous."],
  ["Le dentiste consulte le dossier", "Historique, notes, traitements, allergies et plan dentaire sont disponibles."],
  ["Le traitement est ajouté", "Le dentiste enregistre l’acte, la dent concernée, le prix et les notes."],
  ["Paiement et ordonnance", "La réception génère le reçu, suit le solde et imprime l’ordonnance."],
  ["Le cabinet analyse", "Le propriétaire suit les revenus, performances et statistiques."],
];

const roles = [
  {
    title: "Dentiste",
    icon: Stethoscope,
    description: "Un espace clinique concentré sur le dossier patient, les actes et les décisions médicales.",
    items: ["Dossiers patients", "Plan dentaire", "Traitements", "Ordonnances"],
    previewTitle: "Plan dentaire",
    previewRows: ["Dent 36 · Couronne", "Allergies visibles", "Ordonnance prête"],
    metric: "12 soins aujourd’hui",
  },
  {
    title: "Réceptionniste",
    icon: CalendarDays,
    description: "Une interface opérationnelle pour fluidifier l’accueil, le planning et l’encaissement.",
    items: ["Rendez-vous", "Salle d’attente", "Paiements", "Factures"],
    previewTitle: "Planning du jour",
    previewRows: ["09:30 · Sara Khaldi", "10:00 · Ahmed Benali", "12 patients en attente"],
    metric: "18 RDV confirmés",
  },
  {
    title: "Administrateur",
    icon: BarChart3,
    description: "Une vue de pilotage pour suivre la performance, les équipes et la santé financière.",
    items: ["Rapports", "Paramètres", "Utilisateurs", "Résumé financier"],
    previewTitle: "Résumé financier",
    previewRows: ["420.000 DA encaissés", "175.000 DA à recevoir", "3 praticiens actifs"],
    metric: "+14% ce mois",
  },
];

const benefits: Feature[] = [
  { title: "Gagnez du temps chaque jour", text: "Moins de double saisie, plus de visibilité.", icon: Sparkles },
  { title: "Réduisez les erreurs administratives", text: "Dossiers, soldes et rendez-vous mieux suivis.", icon: ShieldCheck },
  { title: "Améliorez l’expérience patient", text: "Accueil plus fluide et documents professionnels.", icon: HeartPulse },
  { title: "Suivez vos paiements clairement", text: "Acomptes, restes et factures centralisés.", icon: CreditCard },
  { title: "Centralisez les données", text: "Tout le cabinet travaille sur une même base.", icon: Cloud },
  { title: "Donnez une image professionnelle", text: "Une interface moderne face aux patients.", icon: BadgeCheck },
];

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "3.000 DA",
    subtitle: "Pour cabinet individuel",
    features: ["1 dentiste", "Patients", "Rendez-vous", "Paiements simples", "Ordonnances", "Support par email"],
    cta: "Commencer",
  },
  {
    name: "Pro",
    price: "6.000 DA",
    subtitle: "Pour cabinet actif",
    features: ["Multi-utilisateurs", "Salle d’attente", "Plan dentaire", "Paiements et factures", "Rapports et statistiques", "Rappels WhatsApp / SMS", "Support prioritaire"],
    cta: "Demander une démo",
    popular: true,
  },
  {
    name: "Premium",
    price: "10.000 DA",
    subtitle: "Pour cliniques et équipes",
    features: ["Multi-dentistes", "Multi-cabinets", "Rapports avancés", "Personnalisation", "Support prioritaire", "Sauvegarde avancée", "Support 24/7"],
    cta: "Contacter l’équipe",
  },
];

const securityFeatures: Feature[] = [
  { title: "Accès par rôle", text: "Chaque profil voit uniquement ce dont il a besoin.", icon: Users },
  { title: "Sauvegardes régulières", text: "Protection contre les pertes de données.", icon: Cloud },
  { title: "Historique des actions", text: "Suivi des opérations importantes.", icon: ClipboardList },
  { title: "Données centralisées", text: "Une source fiable pour tout le cabinet.", icon: LockKeyhole },
  { title: "Connexion sécurisée", text: "Accès protégé pour les équipes.", icon: ShieldCheck },
  { title: "Export contrôlé", text: "Documents et rapports exportés proprement.", icon: FileText },
];

const testimonials: Testimonial[] = [
  {
    name: "Dr Amine B.",
    location: "Cabinet dentaire, Sétif",
    text: "L’interface est très claire, surtout pour la réception et le suivi des paiements.",
  },
  {
    name: "Dr Sarah K.",
    location: "Cabinet dentaire, Alger",
    text: "Les ordonnances, le plan dentaire et les paiements sont parfaitement bien gérés.",
  },
  {
    name: "Cabinet El Yasmine",
    location: "Oran",
    text: "La salle d’attente et les rappels WhatsApp nous ont énormément aidés.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "Est-ce que DentaDZ fonctionne en français et arabe ?",
    answer: "Oui, la plateforme est pensée pour une utilisation français / arabe selon les besoins du cabinet.",
  },
  { question: "Est-ce que je peux utiliser BaridiMob et CCP ?" },
  { question: "Est-ce que les ordonnances sont imprimables ?" },
  { question: "Est-ce adapté aux petits cabinets ?" },
  { question: "Est-ce que les données sont sauvegardées ?" },
  { question: "Puis-je accéder à DentaDZ depuis mon téléphone ?" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className={cx("text-sm font-bold uppercase tracking-wide", light ? "text-teal-100" : "text-[#0F766E]")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cx("mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl", light ? "text-white" : "text-[#0F172A]")}>
        {title}
      </h2>
      {subtitle ? (
        <p className={cx("mt-4 text-base leading-7 sm:text-lg", light ? "text-teal-50" : "text-[#64748B]")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#2563EB] text-white shadow-lg shadow-teal-700/20">
        <Stethoscope className="h-6 w-6" aria-hidden="true" />
      </span>
      <span>
        <span className={cx("block text-lg font-bold leading-5", light ? "text-white" : "text-[#0F172A]")}>
          Denta<span className="text-[#0F766E]">DZ</span>
        </span>
        <span className={cx("block text-xs font-semibold", light ? "text-slate-400" : "text-[#64748B]")}>Cabinet Dentaire Intelligent</span>
      </span>
    </Link>
  );
}

function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link}
              href={link === "Accueil" ? "/" : `#${link.toLowerCase().replaceAll(" ", "-")}`}
              className={cx(
                "relative text-sm font-bold text-[#64748B] transition hover:text-[#0F766E]",
                link === "Accueil" && "text-[#0F172A]",
              )}
            >
              {link}
              {link === "Accueil" ? <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-[#0F766E]" /> : null}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button type="button" className="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-[#0F172A]">
            <Globe className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
            FR
            <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
          </button>
          <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
            Se connecter
          </Link>
          <Link href="#demo" className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5">
            Demander une démo
          </Link>
        </div>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0F172A] lg:hidden" aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function DashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-10 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0F172A] shadow-xl lg:block">
        +18 Rendez-vous aujourd’hui
      </div>
      <div className="absolute -right-4 bottom-16 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0F766E] shadow-xl lg:block">
        420.000 DA Revenus du mois
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
        <div className="grid min-h-[520px] grid-cols-[86px_1fr] bg-slate-50">
          <aside className="bg-[#0F172A] p-3 text-white">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              {[LayoutDashboard, Users, CalendarDays, CreditCard, BarChart3].map((Icon, index) => (
                <span key={index} className={cx("flex h-10 w-10 items-center justify-center rounded-xl", index === 0 ? "bg-white text-[#0F766E]" : "bg-white/10 text-white/70")}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              ))}
            </div>
          </aside>
          <main className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#64748B]">Bonjour Dr Benali</p>
                <h3 className="text-xl font-bold text-[#0F172A]">Vue générale du cabinet</h3>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">En ligne</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Rendez-vous", "18", CalendarDays],
                ["Patients", "124", Users],
                ["Revenus", "420k DA", WalletIcon],
                ["Salle d’attente", "12", ClipboardList],
              ].map(([label, value, Icon]) => {
                const StatIcon = Icon as IconComponent;
                return (
                  <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#64748B]">{label as string}</p>
                      <StatIcon className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-xl font-bold text-[#0F172A]">{value as string}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-[#0F172A]">Planning du jour</p>
                {["Sara Khaldi", "Ahmed Benali", "Lina Cherif"].map((name, index) => (
                  <div key={name} className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 p-2">
                    <span className="text-sm font-bold text-[#0F172A]">{name}</span>
                    <span className="text-xs font-bold text-[#64748B]">{9 + index}:30</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-4 text-sm font-bold text-[#0F172A]">Revenus</p>
                <div className="flex h-32 items-end gap-2">
                  {[42, 58, 47, 76, 64, 88].map((height, index) => (
                    <span key={index} className="flex-1 rounded-t-lg bg-gradient-to-t from-[#0F766E] to-[#2DD4BF]" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0F172A]">Répartition traitements</p>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[conic-gradient(#0F766E_0_45%,#2563EB_45%_76%,#F59E0B_76%_100%)]" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function WalletIcon(props: SVGProps<SVGSVGElement>) {
  return <CreditCard {...props} />;
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#CCFBF1_0,transparent_34%),linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,118,110,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-bold text-[#0F766E]">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Pensé pour les cabinets dentaires algériens
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            La gestion complète de votre <span className="relative text-[#0F766E]">cabinet dentaire<span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-orange-300/50" /></span>, simple et intelligente.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748B]">
            DentaDZ centralise patients, rendez-vous, traitements, plans dentaires, paiements, ordonnances et rapports dans une seule plateforme moderne, simple et sécurisée.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-5 text-sm font-bold text-white shadow-xl shadow-teal-700/20 transition hover:-translate-y-0.5">
              Demander une démo gratuite
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#fonctionnalités" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
              <PlayCircle className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
              Voir les fonctionnalités
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["100% Cloud", "Accessible partout", Cloud],
              ["Sécurisé", "Données protégées", ShieldCheck],
              ["Support rapide", "7j/7", Headphones],
              ["Conçu en Algérie", "DA, BaridiMob, CCP", MapPin],
            ].map(([title, text, Icon]) => {
              const BadgeIcon = Icon as IconComponent;
              return (
                <div key={title as string} className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                  <BadgeIcon className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold text-[#0F172A]">{title as string}</p>
                  <p className="text-xs font-semibold text-[#64748B]">{text as string}</p>
                </div>
              );
            })}
          </div>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}

function TrustStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-white shadow-2xl shadow-teal-700/20 sm:grid-cols-2 lg:grid-cols-5">
        {trustStats.map(([value, label]) => (
          <div key={label} className="border-white/20 p-6 sm:border-r">
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm font-semibold text-white/80">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, tone = "teal" }: { feature: Feature; tone?: "teal" | "red" }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <span className={cx("flex h-11 w-11 items-center justify-center rounded-xl", tone === "red" ? "bg-orange-50 text-[#EF4444]" : "bg-teal-50 text-[#0F766E]")}>
        <feature.icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-[#0F172A]">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">{feature.text}</p>
    </article>
  );
}

function ProblemSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Votre cabinet mérite mieux que les carnets, Excel et WhatsApp"
          subtitle="Les cabinets dentaires modernes ont besoin d’un système clair pour organiser les rendez-vous, les dossiers patients et les paiements."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => <FeatureCard key={problem.title} feature={problem} tone="red" />)}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solutions" className="bg-[#F8FAFC] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase text-[#0F766E]">Solution complète</p>
          <h2 className="mt-3 text-3xl font-bold text-[#0F172A] sm:text-4xl">Une seule plateforme pour tout votre cabinet</h2>
          <p className="mt-4 text-lg leading-8 text-[#64748B]">DentaDZ centralise toute l’activité de votre cabinet dans une interface rapide, claire et facile à utiliser.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Gestion complète des patients", "Calendrier des rendez-vous", "Salle d’attente en temps réel", "Plan dentaire interactif", "Paiements et factures", "Ordonnances imprimables", "Rapports et statistiques"].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
          <p className="mt-6 inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-[#0F766E]">Interface simple pour dentiste, assistant et réceptionniste</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">Patient</p>
                <p className="font-bold text-[#0F172A]">Sara Khaldi</p>
              </div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-[#0F766E]">Plan actif</span>
            </div>
            <div className="mt-5 grid grid-cols-8 gap-2">
              {Array.from({ length: 32 }).map((_, index) => (
                <span key={index} className={cx("h-8 rounded-full border", index === 19 ? "border-[#0F766E] bg-teal-100" : "border-slate-200 bg-white")} />
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-bold text-[#0F172A]">Dent 36</p>
              <p className="mt-1 text-sm text-[#64748B]">Traitement: Couronne</p>
              <p className="mt-1 text-sm font-bold text-[#0F766E]">Prix: 6.000 DA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="fonctionnalités" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Toutes les fonctionnalités essentielles pour un cabinet moderne"
          subtitle="Tout ce dont vous avez besoin pour gérer les patients, les traitements, les paiements et l’administration."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => <FeatureCard key={feature.title} feature={feature} />)}
        </div>
      </div>
    </section>
  );
}

function AlgerianAdvantageSection() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-700 to-cyan-700 p-6 text-white shadow-2xl shadow-teal-700/20 sm:p-10">
          <SectionHeader
            light
            title="Conçu pour le marché algérien"
            subtitle="DentaDZ s’adapte aux habitudes de travail des cabinets dentaires en Algérie."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {localAdvantages.map((advantage) => (
              <article key={advantage.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <advantage.icon className="h-6 w-6 text-teal-100" aria-hidden="true" />
                <h3 className="mt-3 font-bold">{advantage.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/75">{advantage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Comment DentaDZ simplifie votre journée" />
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-5">
            {workflowSteps.map(([title, text], index) => (
              <article key={title} className="relative rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F766E] text-sm font-bold text-white">{index + 1}</span>
                <h3 className="mt-4 font-bold text-[#0F172A]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleSection() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Une interface claire pour chaque rôle" />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {roles.map((role) => (
            <article key={role.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                <role.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-[#0F172A]">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">{role.description}</p>
              <div className="mt-4 space-y-2">
                {role.items.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                    <Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#0F172A]">{role.previewTitle}</p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#0F766E] shadow-sm">
                    {role.metric}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {role.previewRows.map((row, index) => (
                    <div key={row} className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[11px] font-bold text-[#0F766E]">
                        {index + 1}
                      </span>
                      <span className="min-w-0 truncate text-xs font-bold text-[#0F172A]">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Pourquoi choisir DentaDZ ?" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => <FeatureCard key={benefit.title} feature={benefit} />)}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[["-40%", "Temps administratif"], ["+30%", "Meilleure organisation"], ["100%", "Dossiers centralisés"]].map(([value, label]) => (
            <div key={label} className="rounded-3xl bg-[#0F172A] p-6 text-white">
              <p className="text-4xl font-bold text-teal-300">{value}</p>
              <p className="mt-2 font-semibold text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="tarifs" className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Des offres simples pour chaque cabinet"
          subtitle="Choisissez l’offre adaptée à la taille de votre cabinet."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={cx("relative rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl", plan.popular ? "border-[#0F766E] ring-4 ring-teal-700/10" : "border-slate-200")}>
              {plan.popular ? <span className="absolute right-5 top-5 rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold text-white">Populaire</span> : null}
              <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
              <p className="mt-2 text-sm font-semibold text-[#64748B]">{plan.subtitle}</p>
              <p className="mt-6 text-4xl font-bold text-[#0F172A]">{plan.price}<span className="text-sm font-semibold text-[#64748B]"> / mois</span></p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                    <Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                    {feature}
                  </p>
                ))}
              </div>
              <Link href="#demo" className={cx("mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition", plan.popular ? "bg-gradient-to-r from-[#0F766E] to-[#2563EB] text-white shadow-lg shadow-teal-700/20" : "border border-slate-200 bg-white text-[#0F172A] hover:bg-slate-50")}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-[#0F172A]">Accessible sur tous vos appareils</p>
              <p className="text-sm font-semibold text-[#64748B]">Bureau, tablette et téléphone pour garder le cabinet synchronisé.</p>
            </div>
            <MonitorSmartphone className="h-12 w-12 text-[#0F766E]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0F766E] to-[#2563EB] text-white shadow-xl shadow-teal-700/20">
            <ShieldCheck className="h-10 w-10" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-3xl font-bold text-[#0F172A] sm:text-4xl">Vos données patients méritent une protection sérieuse</h2>
          <p className="mt-4 text-lg leading-8 text-[#64748B]">DentaDZ est conçu avec une structure sécurisée pour protéger les informations sensibles de votre cabinet et limiter l’accès selon les rôles.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {securityFeatures.map((feature) => <FeatureCard key={feature.title} feature={feature} />)}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Pensé avec les besoins réels des cabinets" />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />)}
              </div>
              <p className="mt-4 text-sm leading-7 text-[#0F172A]">“{testimonial.text}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] to-[#2563EB] font-bold text-white">{testimonial.name.slice(0, 2)}</span>
                <div>
                  <p className="font-bold text-[#0F172A]">{testimonial.name}</p>
                  <p className="text-sm font-semibold text-[#64748B]">{testimonial.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Questions fréquentes" />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-[#0F172A]">{faq.question}</h3>
                {index === 0 ? <Minus className="h-5 w-5 text-[#0F766E]" aria-hidden="true" /> : <Plus className="h-5 w-5 text-[#64748B]" aria-hidden="true" />}
              </div>
              {faq.answer ? <p className="mt-3 text-sm leading-6 text-[#64748B]">{faq.answer}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="demo" className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] p-8 text-white shadow-2xl shadow-teal-700/20 lg:grid-cols-[1fr_360px] lg:items-center lg:p-12">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Prêt à moderniser votre cabinet dentaire ?</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">Rejoignez les cabinets qui utilisent DentaDZ pour gérer leur activité en toute simplicité.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-[#0F766E] transition hover:-translate-y-0.5">Demander une démo gratuite</Link>
              <Link href="#contact" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-5 text-sm font-bold text-white transition hover:bg-white/10">Nous contacter</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <div className="rounded-2xl bg-white p-4 text-[#0F172A]">
              <p className="font-bold">Démo DentaDZ</p>
              <p className="mt-1 text-sm text-[#64748B]">Présentation personnalisée en 20 minutes.</p>
              <div className="mt-4 space-y-2">
                {["Analyse du cabinet", "Modules adaptés", "Plan de démarrage"].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-bold">
                    <Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketingFooter() {
  return (
    <footer id="contact" className="bg-[#020617] pt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-6 text-slate-400">La solution SaaS moderne pour les cabinets dentaires en Algérie.</p>
          <div className="mt-5 flex gap-2">
            {["f", "ig", "wa", "in"].map((social) => (
              <span key={social} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-teal-200">{social}</span>
            ))}
          </div>
        </div>
        {[
          ["Produit", "Fonctionnalités", "Tarifs", "Démo", "Sécurité", "Mise à jour"],
          ["Modules", "Patients", "Rendez-vous", "Paiements", "Ordonnances", "Rapports"],
          ["Contact", "contact@dentadz.dz", "0556 12 34 56", "Sétif, Algérie", "Lun - Sam: 8h - 18h"],
        ].map(([title, ...items]) => (
          <div key={title}>
            <h3 className="font-bold text-white">{title}</h3>
            <div className="mt-4 space-y-3">
              {items.map((item) => <p key={item} className="text-sm font-semibold text-slate-400">{item}</p>)}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm font-semibold text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 DentaDZ. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4">
            <span>Politique de confidentialité</span>
            <span>Conditions d’utilisation</span>
            <span>Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] font-sans text-[#0F172A]">
      <MarketingNavbar />
      <HeroSection />
      <TrustStats />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <AlgerianAdvantageSection />
      <WorkflowSection />
      <RoleSection />
      <BenefitsSection />
      <PricingSection />
      <SecuritySection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <MarketingFooter />
    </main>
  );
}
