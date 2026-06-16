"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import {
  Check,
  Clock3,
  Cloud,
  Eye,
  EyeOff,
  Headphones,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    title: "Sécurisé",
    description: "Données protégées et sauvegardées",
    icon: ShieldCheck,
  },
  {
    title: "Accessible partout",
    description: "Sur tous vos appareils, 24h/24",
    icon: Cloud,
  },
  {
    title: "Gain de temps",
    description: "Automatisez et simplifiez votre quotidien",
    icon: Clock3,
  },
  {
    title: "Support rapide",
    description: "Une équipe disponible 7j/7",
    icon: Headphones,
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ToothLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-2xl overflow-hidden",
        size === "sm" && "h-11 w-11",
        size === "md" && "h-12 w-12 xl:h-14 xl:w-14",
        size === "lg" && "h-16 w-16",
      )}
    >
      <img src="/logo.png" alt="DentaDZ Logo" className="h-full w-full object-contain" />
    </span>
  );
}

function AuthLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <ToothLogo size={compact ? "sm" : "md"} />
      <span>
        <span className={cx("block font-bold leading-5 text-[#0F172A]", compact ? "text-lg" : "text-xl xl:text-2xl")}>
          Denta<span className="text-[#0F766E]">DZ</span>
        </span>
        <span className="block text-xs font-semibold text-[#64748B]">
          Cabinet Dentaire Intelligent
        </span>
      </span>
    </Link>
  );
}

function BenefitItem({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal-100 bg-white text-[#0F766E] shadow-sm">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-semibold text-[#0F172A]">{title}</span>
        <span className="mt-1 block text-sm text-[#64748B]">{description}</span>
      </span>
    </div>
  );
}

function LoginPromoPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-[#E2E8F0] bg-gradient-to-br from-cyan-50 via-white to-teal-50 px-10 xl:flex xl:items-center xl:px-20 lg:flex lg:px-12">
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="absolute bottom-12 right-10 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl" />
      <div className="absolute left-8 top-8 grid grid-cols-6 gap-2 opacity-20">
        {Array.from({ length: 36 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
        ))}
      </div>
      <div className="absolute bottom-10 right-8 text-[#0F766E]/10">
        <svg viewBox="0 0 160 160" className="h-52 w-52" fill="none" aria-hidden="true">
          <path
            d="M80 18c12-7 36-9 54 10 19 20 16 55 1 80-8 14-10 29-13 44-3 18-6 34-19 34-10 0-13-13-16-25-2-9-4-17-7-17s-5 8-7 17c-3 12-6 25-16 25-13 0-16-16-19-34-3-15-5-30-13-44-15-25-18-60 1-80C44 9 68 11 80 18Z"
            stroke="currentColor"
            strokeWidth="10"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl space-y-8">
        <AuthLogo />
        <div>
          <h1 className="text-4xl font-bold leading-tight text-slate-950 xl:text-5xl">
            La gestion complète
            <br />
            de votre cabinet dentaire,
            <br />
            <span className="relative text-[#0F766E]">
              simple et intelligente.
              <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#F59E0B]/30" />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            DentaDZ vous aide à gérer vos patients, rendez-vous, traitements,
            paiements, ordonnances et rapports dans une seule plateforme sécurisée.
          </p>
        </div>

        <div className="grid gap-5">
          {benefits.map((benefit) => (
            <BenefitItem key={benefit.title} {...benefit} />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="h-7 w-7 rounded-full bg-[conic-gradient(#22C55E_0_68%,#EF4444_68%_82%,#FFFFFF_82%_100%)]" />
            </span>
            <span>
              <span className="block font-bold text-[#0F172A]">
                Conçu pour les cabinets dentaires en Algérie
              </span>
              <span className="mt-1 block text-sm font-semibold text-[#64748B]">
                Devise DA • BaridiMob • CCP • Français / Arabe
              </span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function LoginFormCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api<{ user: { name: string; role: string }; token: string; redirect: string }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      router.push(data.redirect || "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8 flex justify-center lg:hidden">
        <AuthLogo compact />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:rounded-[2rem] sm:p-10 lg:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-950">
            Bienvenue sur <span className="text-[#0F766E]">DentaDZ</span>
          </h2>
          <p className="mt-3 text-slate-500">
            Connectez-vous à votre compte pour continuer
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-600/10"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="password" className="block text-sm font-semibold text-[#0F172A]">
                Mot de passe
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-[#0F766E] hover:text-[#0B5F59]">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-12 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-600/10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-slate-100 hover:text-[#0F172A]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={rememberMe}
              onClick={() => setRememberMe((value) => !value)}
              className={cx(
                "flex h-5 w-5 items-center justify-center rounded-md border transition",
                rememberMe ? "border-[#0F766E] bg-[#0F766E] text-white" : "border-slate-300 bg-white text-transparent",
              )}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="text-sm font-medium text-[#64748B]">Se souvenir de moi</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition-all hover:-translate-y-0.5 hover:from-teal-800 hover:to-teal-700 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="h-5 w-5" aria-hidden="true" />
            )}
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-semibold text-[#64748B]">ou</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-[#0F172A] transition hover:bg-slate-50"
          >
            <span className="text-lg font-bold">
              <span className="text-[#2563EB]">G</span>
            </span>
            Se connecter avec Google
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#64748B]">
          Vous n&apos;avez pas de compte ?{" "}
          <Link href="/demo" className="font-semibold text-[#0F766E] hover:text-[#0B5F59]">
            Demander une démo
          </Link>
        </p>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-[#64748B]">
          <ShieldCheck className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Connexion sécurisée • Données protégées
        </p>
      </div>
    </div>
  );
}

function AuthFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs font-semibold text-[#64748B] sm:flex-row sm:text-left">
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Vos données sont sécurisées et conformes aux normes de confidentialité.
        </p>
        <p>© 2026 DentaDZ. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
        <LoginPromoPanel />
        <main className="flex items-center justify-center bg-white px-6 py-10 sm:px-8 lg:bg-slate-50/40 lg:px-12">
          <LoginFormCard />
        </main>
      </div>
      <AuthFooter />
    </section>
  );
}
