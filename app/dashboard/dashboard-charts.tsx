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
import { ChartBar, ChartPie, ChevronDown, Loader2 } from "lucide-react";

interface RevenueChart {
  label: string;
  value: number;
}

interface TreatmentBreakdown {
  name: string;
  count: number;
  color: string;
}

const cardClass =
  "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.10)] 2xl:p-5";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function formatCurrency(value: number) {
  return `${value.toLocaleString("fr-DZ")} DA`;
}

export default function DashboardCharts({
  revenueChart,
  treatmentBreakdown,
}: {
  revenueChart: RevenueChart[];
  treatmentBreakdown: TreatmentBreakdown[];
}) {
  const [treatmentPeriod, setTreatmentPeriod] = useState<"month" | "week">("month");

  const totalTreatments = treatmentBreakdown.reduce((sum, t) => sum + t.count, 0);
  const treatmentsData = treatmentBreakdown.map((t) => ({
    name: t.name,
    value: totalTreatments > 0 ? Math.round((t.count / totalTreatments) * 100) : 0,
    color: t.color,
  }));

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const hasRevenue = revenueChart.length > 0;
  const hasTreatments = treatmentsData.length > 0;

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
                Revenus de l&apos;activité (DA)
              </h2>
              <p className="text-sm text-[#64748B]">
                Encaissements mensuels des 6 derniers mois
              </p>
            </div>
          </div>
        </div>

        <div className="h-56 min-w-0 xl:h-60 2xl:h-72">
          {!hasRevenue ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#0F766E]" />
            </div>
          ) : mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart} margin={{ left: 0, right: 6 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
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
              {revenueChart.map((item) => {
                const maxVal = Math.max(...revenueChart.map((r) => r.value), 1);
                return (
                  <span
                    key={item.label}
                    className="flex-1 rounded-t-xl bg-teal-100"
                    style={{ height: `${(item.value / maxVal) * 100}%` }}
                  />
                );
              })}
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
                Répartition des actes du cabinet
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_170px] md:items-center 2xl:grid-cols-[minmax(0,1fr)_190px]">
          <div className="h-56 min-w-0 xl:h-60 2xl:h-72">
            {!hasTreatments ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#0F766E]" />
              </div>
            ) : mounted ? (
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
