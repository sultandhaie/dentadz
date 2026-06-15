"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartBar, ChartPie, ChevronDown } from "lucide-react";

const revenueDataYear = [
  { month: "Jan", value: 280000 },
  { month: "Fév", value: 310000 },
  { month: "Mar", value: 390000 },
  { month: "Avr", value: 350000 },
  { month: "Mai", value: 420000 },
  { month: "Juin", value: 460000 },
];

const revenueDataMonth = [
  { month: "Sem 1", value: 95000 },
  { month: "Sem 2", value: 110000 },
  { month: "Sem 3", value: 135000 },
  { month: "Sem 4", value: 120000 },
];

const treatmentsDataMonth = [
  { name: "Détartrage", value: 35, color: "#0F766E" },
  { name: "Plombage", value: 25, color: "#2563EB" },
  { name: "Extraction", value: 18, color: "#F59E0B" },
  { name: "Orthodontie", value: 12, color: "#7C3AED" },
  { name: "Blanchiment", value: 10, color: "#22C55E" },
];

const treatmentsDataWeek = [
  { name: "Détartrage", value: 40, color: "#0F766E" },
  { name: "Plombage", value: 20, color: "#2563EB" },
  { name: "Extraction", value: 25, color: "#F59E0B" },
  { name: "Orthodontie", value: 5, color: "#7C3AED" },
  { name: "Blanchiment", value: 10, color: "#22C55E" },
];

const cardClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.10)] 2xl:p-5";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function formatCurrency(value: number) {
  return `${value.toLocaleString("fr-DZ")} DA`;
}

export default function DashboardCharts() {
  const [revenuePeriod, setRevenuePeriod] = useState<"year" | "month">("year");
  const [treatmentPeriod, setTreatmentPeriod] = useState<"month" | "week">("month");

  const revenueData = revenuePeriod === "year" ? revenueDataYear : revenueDataMonth;
  const treatmentsData = treatmentPeriod === "month" ? treatmentsDataMonth : treatmentsDataWeek;

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <section className="grid gap-4 xl:grid-cols-2 2xl:gap-6" aria-label="Analyses">
      <article className={cardClass}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between 2xl:mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F766E] to-[#2563EB] text-white shadow-lg shadow-teal-700/20">
              <ChartBar className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Revenus de l’activité (DA)
              </h2>
              <p className="text-sm text-[#64748B]">
                {revenuePeriod === "year" ? "Encaissements mensuels de l’année" : "Encaissements hebdomadaires du mois"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRevenuePeriod((prev) => (prev === "year" ? "month" : "year"))}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50 cursor-pointer"
          >
            <span>{revenuePeriod === "year" ? "Cette année" : "Ce mois"}</span>
            <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
          </button>
        </div>

        <div className="h-56 min-w-0 xl:h-60 2xl:h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ left: 0, right: 6 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  tickFormatter={(value) => `${Number(value) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#CCFBF1", opacity: 0.35 }}
                  contentStyle={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Revenus"]}
                  labelStyle={{ color: "#0F172A", fontWeight: 700 }}
                />
                <Bar dataKey="value" fill="#0F766E" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-end gap-3 rounded-2xl bg-slate-50 p-4">
              {revenueData.map((item) => (
                <span
                  key={item.month}
                  className="flex-1 rounded-t-xl bg-teal-100"
                  style={{ height: `${(item.value / 460000) * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </article>

      <article className={cardClass}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between 2xl:mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#F59E0B] text-white shadow-lg shadow-blue-700/20">
              <ChartPie className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Traitements populaires
              </h2>
              <p className="text-sm text-[#64748B]">
                {treatmentPeriod === "mois" ? "Répartition des actes ce mois" : "Répartition des actes cette semaine"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTreatmentPeriod((prev) => (prev === "mois" ? "week" : "mois"))}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:bg-blue-50 cursor-pointer"
          >
            <span>{treatmentPeriod === "mois" ? "Ce mois" : "Cette semaine"}</span>
            <ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_170px] md:items-center 2xl:grid-cols-[minmax(0,1fr)_190px]">
          <div className="h-56 min-w-0 xl:h-60 2xl:h-72">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "14px",
                      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
                    }}
                    formatter={(value) => [`${value}%`, "Part"]}
                  />
                  <Pie
                    data={treatmentsData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={66}
                    outerRadius={102}
                    paddingAngle={3}
                    stroke="#ffffff"
                    strokeWidth={4}
                  >
                    {treatmentsData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50">
                <div className="h-40 w-40 rounded-full border-[28px] border-teal-100 border-r-blue-100 border-t-amber-100" />
              </div>
            )}
          </div>

          <ul className="space-y-3">
            {treatmentsData.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-[#0F172A]">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-[#64748B]">
                  {item.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}
