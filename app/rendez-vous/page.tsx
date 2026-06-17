"use client";

import type { ComponentType, SVGProps } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, Calendar, CalendarDays, Check, CheckCircle,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Clock3,
  DoorOpen, Eye, MoreVertical, Pencil, Phone, Plus, Stethoscope, Upload,
  User, UserRound, X,
} from "lucide-react";
import { api } from "../../lib/api";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type AppointmentStatus = "Confirmé" | "En attente" | "Arrivé" | "En consultation" | "Terminé" | "Annulé" | "Absent" | "Reporté";

type Stat = { label: string; value: string; trend: string; icon: IconComponent; accent: string };

interface ApiAppointment {
  id: number;
  appointment_code: string;
  patient_id: number;
  dentist_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  treatment: string;
  status: AppointmentStatus;
  color: string;
  notes: string;
  room: string;
  patient?: { id: number; first_name: string; last_name: string; phone: string; patient_code: string };
  dentist?: { id: number; name: string };
}

type Appointment = {
  id: string;
  apiId: number;
  day: "Dim" | "Lun" | "Mar" | "Mer" | "Jeu" | "Ven" | "Sam";
  time: string;
  endTime: string;
  patient: string;
  patientCode: string;
  treatment: string;
  dentist: string;
  status: AppointmentStatus;
  color: "blue" | "orange" | "teal" | "purple" | "green" | "red";
  phone: string;
  room: string;
  notes: string;
  appointmentDate: string;
};

type CalendarView = "jour" | "semaine" | "mois";

type PlanningRow = {
  time: string;
  patient: string;
  treatment: string;
  dentist: string;
  status: AppointmentStatus;
  apiId: number;
};

interface StatsData {
  total_today: number;
  confirmed: number;
  en_attente: number;
  en_consultation: number;
  termine: number;
  annules: number;
}

const dayKeys = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] as const;

const statusColorMap: Record<AppointmentStatus, Appointment["color"]> = {
  Confirmé: "blue",
  "En attente": "orange",
  Arrivé: "teal",
  "En consultation": "purple",
  Terminé: "green",
  Annulé: "red",
  Absent: "red",
  Reporté: "orange",
};

const panelClass = "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] 2xl:p-5";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function getStatusClasses(status: AppointmentStatus) {
  const classes: Record<AppointmentStatus, string> = {
    Confirmé: "bg-blue-50 text-blue-700 border-blue-200",
    "En attente": "bg-orange-50 text-orange-700 border-orange-200",
    Arrivé: "bg-teal-50 text-teal-700 border-teal-200",
    "En consultation": "bg-purple-50 text-purple-700 border-purple-200",
    Terminé: "bg-green-50 text-green-700 border-green-200",
    Annulé: "bg-red-50 text-red-700 border-red-200",
    Absent: "bg-rose-50 text-rose-700 border-rose-200",
    Reporté: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return classes[status];
}

function getAppointmentCardClasses(color: Appointment["color"]) {
  const classes = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    orange: "border-orange-200 bg-orange-50 text-orange-800",
    teal: "border-teal-200 bg-teal-50 text-teal-800",
    purple: "border-purple-200 bg-purple-50 text-purple-800",
    green: "border-green-200 bg-green-50 text-green-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };
  return classes[color];
}

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);
  return Array.from({ length: 6 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function mapApiAppointment(a: ApiAppointment): Appointment {
  const rawDate = String(a.appointment_date);
  const dateStr = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate.split(" ")[0];
  const d = new Date(dateStr + "T00:00:00");
  const dayIndex = d.getDay();
  const startTime = a.start_time?.includes(" ") ? a.start_time.split(" ")[1]?.slice(0, 5) : a.start_time?.slice(0, 5);
  const endTime = a.end_time?.includes(" ") ? a.end_time.split(" ")[1]?.slice(0, 5) : a.end_time?.slice(0, 5);
  return {
    id: a.appointment_code || `RDV-${String(a.id).padStart(6, "0")}`,
    apiId: a.id,
    day: dayKeys[dayIndex],
    time: startTime || "09:00",
    endTime: endTime || "10:00",
    patient: a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : "Patient inconnu",
    patientCode: a.patient?.patient_code || "",
    treatment: a.treatment,
    dentist: a.dentist?.name || "Dentiste",
    status: a.status,
    color: statusColorMap[a.status] || "blue",
    phone: a.patient?.phone || "",
    room: a.room || "",
    notes: a.notes || "",
    appointmentDate: dateStr,
  };
}

const timeRows = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cx("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] via-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-md shadow-slate-900/10", className)} aria-label={name}>
      {getInitials(name)}
    </span>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold", getStatusClasses(status))}>
      {status}
    </span>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#0F766E]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</p>
        <p className="text-sm font-bold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, tone, onClick }: { label: string; icon: IconComponent; tone: "teal" | "blue" | "red" | "slate"; onClick?: () => void }) {
  const tones = {
    teal: "bg-[#0F766E] text-white shadow-lg shadow-teal-700/20",
    blue: "border border-blue-200 bg-blue-50 text-[#2563EB]",
    red: "border border-red-200 bg-red-50 text-[#EF4444]",
    slate: "border border-slate-200 bg-slate-50 text-[#0F172A]",
  };
  return (
    <button type="button" onClick={onClick} className={cx("inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md", tones[tone])}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

function IconButton({ label, icon: Icon, onClick }: { label: string; icon: IconComponent; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#0F766E]/40 hover:bg-teal-50 hover:text-[#0F766E]" aria-label={label}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="inline-flex h-10 w-full items-center justify-between appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3 pr-8 text-sm font-bold text-[#0F172A] outline-none transition hover:border-[#0F766E]/40 hover:bg-teal-50 focus:border-[#0F766E] focus:ring-2 focus:ring-teal-600/10 cursor-pointer">
        <option value="">{label}</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
    </div>
  );
}

function PageActions() {
  return (
    <section className="flex sm:justify-end">
      <div className="grid gap-2 sm:flex sm:justify-end">
        <Link href="/rendez-vous/nouveau" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#2563EB] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau rendez-vous
        </Link>
        <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#0F766E]/40 hover:bg-teal-50">
          <Upload className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          Exporter
        </button>
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <article className="group rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.10)] 2xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#64748B]">{stat.label}</p>
          <p className="mt-2 text-xl font-bold text-[#0F172A] 2xl:mt-3 2xl:text-3xl">{stat.value}</p>
        </div>
        <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105 2xl:h-11 2xl:w-11", stat.accent)}>
          <stat.icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs font-bold text-[#64748B] 2xl:mt-4">{stat.trend}</p>
    </article>
  );
}

function CalendarToolbar({ currentWeekStart, onPrevWeek, onNextWeek, dentists, treatments, filterDentist, filterTreatment, onFilterDentist, onFilterTreatment, calendarView, onCalendarViewChange, monthDate }: { currentWeekStart: Date; onPrevWeek: () => void; onNextWeek: () => void; dentists: string[]; treatments: string[]; filterDentist: string; filterTreatment: string; onFilterDentist: (v: string) => void; onFilterTreatment: (v: string) => void; calendarView: CalendarView; onCalendarViewChange: (v: CalendarView) => void; monthDate: Date }) {
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const periodLabel = calendarView === "mois" ? `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}` : `${monthNames[currentWeekStart.getMonth()]} ${currentWeekStart.getFullYear()}`;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <IconButton label="Semaine précédente" icon={ChevronLeft} onClick={onPrevWeek} />
          <IconButton label="Semaine suivante" icon={ChevronRight} onClick={onNextWeek} />
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50">
            {periodLabel}<ChevronDown className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-3 rounded-xl border border-[#E2E8F0] bg-slate-50 p-1 text-sm font-bold">
          {(["Jour", "Semaine", "Mois"] as const).map((label) => {
            const view = label.toLowerCase() as CalendarView;
            return (
              <button type="button" key={label} onClick={() => onCalendarViewChange(view)} className={cx("rounded-lg px-3 py-2 transition", calendarView === view ? "bg-white text-[#0F766E] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]")}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <FilterSelect label="Tous les dentistes" value={filterDentist} options={dentists} onChange={onFilterDentist} />
        <FilterSelect label="Tous les traitements" value={filterTreatment} options={treatments} onChange={onFilterTreatment} />
      </div>
    </div>
  );
}

function WeeklyCalendar({ appointments, weekDates, onPrevWeek, onNextWeek, onSelectAppointment, dentists, treatments, filterDentist, filterTreatment, onFilterDentist, onFilterTreatment, calendarView, onCalendarViewChange, monthDate, selectedDate, onSelectDate }: { appointments: Appointment[]; weekDates: Date[]; onPrevWeek: () => void; onNextWeek: () => void; onSelectAppointment: (a: Appointment) => void; dentists: string[]; treatments: string[]; filterDentist: string; filterTreatment: string; onFilterDentist: (v: string) => void; onFilterTreatment: (v: string) => void; calendarView: CalendarView; onCalendarViewChange: (v: CalendarView) => void; monthDate: Date; selectedDate: string; onSelectDate: (d: string) => void }) {
  const todayStr = formatDate(new Date());
  const dayAbbr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <article className={panelClass}>
      <CalendarToolbar currentWeekStart={weekDates[0]} onPrevWeek={onPrevWeek} onNextWeek={onNextWeek} dentists={dentists} treatments={treatments} filterDentist={filterDentist} filterTreatment={filterTreatment} onFilterDentist={onFilterDentist} onFilterTreatment={onFilterTreatment} calendarView={calendarView} onCalendarViewChange={onCalendarViewChange} monthDate={monthDate} />

      {calendarView === "jour" && (() => {
        const dayDate = new Date(selectedDate + "T00:00:00");
        const dayLabel = `${dayAbbr[dayDate.getDay()]} ${dayDate.getDate()} ${monthNames[dayDate.getMonth()]}`;
        return (
          <div className="mt-4 overflow-x-auto 2xl:mt-5">
            <div className="min-w-[400px] overflow-hidden rounded-2xl border border-[#E2E8F0]">
              <div className="grid grid-cols-[70px_1fr] bg-slate-50">
                <div className="border-b border-r border-[#E2E8F0] px-3 py-3 text-xs font-bold uppercase text-[#64748B]">Heure</div>
                <div className="border-b border-[#E2E8F0] px-3 py-3 text-center text-sm font-bold text-[#0F172A]">
                  {selectedDate === todayStr ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[#0F766E] ring-1 ring-teal-100">
                      Aujourd'hui<span className="rounded-full bg-[#0F766E] px-2 py-0.5 text-xs text-white">{dayDate.getDate()}</span>
                    </span>
                  ) : dayLabel}
                </div>
              </div>
              {timeRows.map((time) => {
                const cellAppointments = appointments.filter((a) => a.appointmentDate === selectedDate && a.time.slice(0, 2) === time.slice(0, 2));
                return (
                  <div key={time} className="grid min-h-16 grid-cols-[70px_1fr] border-b border-[#E2E8F0] last:border-b-0">
                    <div className="border-r border-[#E2E8F0] bg-slate-50/60 px-3 py-3 text-xs font-bold text-[#64748B]">{time}</div>
                    <div className="group p-1.5 transition hover:bg-teal-50/40">
                      {cellAppointments.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {cellAppointments.map((appt) => (
                            <AppointmentCalendarCard key={appt.id} appointment={appt} onSelect={onSelectAppointment} />
                          ))}
                        </div>
                      ) : (
                        <Link href={`/rendez-vous/nouveau?date=${selectedDate}&heure=${time}`} className="hidden text-xs font-bold text-[#0F766E] opacity-0 transition group-hover:inline group-hover:opacity-100 cursor-pointer">+ Ajouter RDV</Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {calendarView === "semaine" && (
        <div className="mt-4 overflow-x-auto 2xl:mt-5">
          <div className="min-w-[820px] overflow-hidden rounded-2xl border border-[#E2E8F0]">
            <div className="grid grid-cols-[70px_repeat(6,minmax(125px,1fr))] bg-slate-50">
              <div className="border-b border-r border-[#E2E8F0] px-3 py-3 text-xs font-bold uppercase text-[#64748B]">Heure</div>
              {weekDates.map((date, i) => {
                const isToday = formatDate(date) === todayStr;
                const dayLabel = dayAbbr[date.getDay()];
                const dayNum = date.getDate();
                return (
                  <div key={i} className="border-b border-r border-[#E2E8F0] px-3 py-3 text-center text-sm font-bold text-[#0F172A] last:border-r-0">
                    {isToday ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[#0F766E] ring-1 ring-teal-100">
                        {dayLabel}<span className="rounded-full bg-[#0F766E] px-2 py-0.5 text-xs text-white">{dayNum}</span>
                      </span>
                    ) : `${dayLabel} ${dayNum}`}
                  </div>
                );
              })}
            </div>
            {timeRows.map((time) => (
              <div key={time} className="grid min-h-16 grid-cols-[70px_repeat(6,minmax(125px,1fr))] border-b border-[#E2E8F0] last:border-b-0">
                <div className="border-r border-[#E2E8F0] bg-slate-50/60 px-3 py-3 text-xs font-bold text-[#64748B]">{time}</div>
                {weekDates.map((date, i) => {
                  const dateStr = formatDate(date);
                  const cellAppointments = appointments.filter((a) => a.appointmentDate === dateStr && a.time.slice(0, 2) === time.slice(0, 2));
                  return (
                    <div key={`${i}-${time}`} className="group min-h-16 border-r border-[#E2E8F0] p-1.5 transition hover:bg-teal-50/40 last:border-r-0">
                      {cellAppointments.length > 0 ? (
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-32">
                          {cellAppointments.map((appt) => (
                            <AppointmentCalendarCard key={appt.id} appointment={appt} onSelect={onSelectAppointment} />
                          ))}
                        </div>
                      ) : (
                        <Link href={`/rendez-vous/nouveau?date=${dateStr}&heure=${time}`} className="hidden text-xs font-bold text-[#0F766E] opacity-0 transition group-hover:inline group-hover:opacity-100 cursor-pointer">+ Ajouter RDV</Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {calendarView === "mois" && (() => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
        const monthDayAbbr = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
        return (
          <div className="mt-4 2xl:mt-5">
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#E2E8F0]">
              {monthDayAbbr.map((d) => (
                <div key={d} className="bg-slate-50 px-2 py-2.5 text-center text-xs font-bold uppercase text-[#64748B]">{d}</div>
              ))}
              {Array.from({ length: totalCells }, (_, i) => {
                const dayNum = i - startDay + 1;
                const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const dateStr = isCurrentMonth ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}` : "";
                const dayAppts = isCurrentMonth ? appointments.filter((a) => a.appointmentDate === dateStr) : [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                return (
                  <div key={i} className={cx("relative min-h-[90px] bg-white p-1.5 transition", isToday && "ring-2 ring-inset ring-[#0F766E]/30", isSelected && "bg-teal-50/50")}>
                    {isCurrentMonth && (
                      <button type="button" onClick={() => { onSelectDate(dateStr); onCalendarViewChange("jour"); }} className={cx("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition cursor-pointer", isToday ? "bg-[#0F766E] text-white" : "text-[#0F172A] hover:bg-teal-50")}>
                        {dayNum}
                      </button>
                    )}
                    {dayAppts.length > 0 && (
                      <div className="mt-1 flex flex-col gap-0.5">
                        {dayAppts.slice(0, 3).map((appt) => (
                          <button key={appt.id} type="button" onClick={() => onSelectAppointment(appt)} className={cx("w-full cursor-pointer rounded px-1 py-0.5 text-left text-[10px] font-bold leading-tight truncate transition hover:opacity-80", getAppointmentCardClasses(appt.color))}>
                            {appt.time} {appt.patient.split(" ")[0]}
                          </button>
                        ))}
                        {dayAppts.length > 3 && <span className="px-1 text-[10px] font-bold text-[#64748B]">+{dayAppts.length - 3}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </article>
  );
}

function AppointmentCalendarCard({ appointment, onSelect }: { appointment: Appointment; onSelect: (a: Appointment) => void }) {
  return (
    <button type="button" onClick={() => onSelect(appointment)} className={cx("w-full cursor-pointer rounded-lg border p-1.5 text-left text-[11px] leading-tight shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", getAppointmentCardClasses(appointment.color))}>
      <p className="font-bold">{appointment.time}</p>
      <p className="truncate font-bold">{appointment.patient}</p>
      <p className="truncate opacity-75">{appointment.treatment}</p>
    </button>
  );
}

function AppointmentDetails({ appointment, router, onUpdateStatus }: { appointment: Appointment | null; router: ReturnType<typeof useRouter>; onUpdateStatus: (appointment: Appointment, status: string) => void }) {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = useCallback(async (newStatus: string) => {
    if (!appointment || updating) return;
    setUpdating(true);
    try {
      await api(`/appointments/${appointment.apiId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdateStatus(appointment, newStatus);
    } catch {
      //
    } finally {
      setUpdating(false);
    }
  }, [appointment, updating, onUpdateStatus]);

  if (!appointment) return null;

  return (
    <article className={panelClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Détails du rendez-vous</h2>
          <p className="mt-1 text-sm font-medium text-[#64748B]">{appointment.id}</p>
        </div>
        <span className="h-3 w-3 rounded-full bg-[#2563EB] ring-4 ring-blue-50" />
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-teal-50 p-3.5 2xl:mt-5 2xl:p-4">
        <Avatar name={appointment.patient} className="h-12 w-12 text-sm 2xl:h-14 2xl:w-14 2xl:text-base" />
        <div>
          <h3 className="text-base font-bold text-[#0F172A] 2xl:text-lg">{appointment.patient}</h3>
          <p className="text-sm font-semibold text-[#64748B]">#{appointment.id}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2.5 2xl:mt-5 2xl:gap-3">
        <DetailItem icon={Calendar} label="Date" value={appointment.appointmentDate} />
        <DetailItem icon={Clock} label="Heure" value={`${appointment.time} - ${appointment.endTime}`} />
        <DetailItem icon={UserRound} label="Dentiste" value={appointment.dentist} />
        <DetailItem icon={Stethoscope} label="Traitement" value={appointment.treatment} />
        <DetailItem icon={CheckCircle} label="Statut" value={appointment.status} />
        {appointment.phone && <DetailItem icon={Phone} label="Téléphone" value={appointment.phone} />}
        {appointment.room && <DetailItem icon={DoorOpen} label="Salle" value={appointment.room} />}
      </div>
      {appointment.notes && (
        <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 p-3.5 2xl:mt-5 2xl:p-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Notes</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">{appointment.notes}</p>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2 2xl:mt-5">
        {(appointment.status === "En attente" || appointment.status === "Annulé" || appointment.status === "Absent" || appointment.status === "Reporté") && (
          <ActionButton label="Confirmer" icon={Check} tone="teal" onClick={() => handleUpdate("Confirmé")} />
        )}
        {appointment.status === "Confirmé" && (
          <ActionButton label="Arrivé" icon={CheckCircle2} tone="teal" onClick={() => handleUpdate("Arrivé")} />
        )}
        {appointment.status === "Arrivé" && (
          <ActionButton label="Commencer" icon={CheckCircle2} tone="blue" onClick={() => handleUpdate("En consultation")} />
        )}
        {appointment.status === "En consultation" && (
          <ActionButton label="Terminer" icon={CheckCircle2} tone="blue" onClick={() => handleUpdate("Terminé")} />
        )}
        {(appointment.status === "En attente" || appointment.status === "Confirmé" || appointment.status === "Arrivé" || appointment.status === "En consultation" || appointment.status === "Reporté") && (
          <ActionButton label="Annuler" icon={X} tone="red" onClick={() => handleUpdate("Annulé")} />
        )}
        <ActionButton label="Voir dossier patient" icon={User} tone="slate" onClick={() => router.push(`/patients/${appointment.patientCode}`)} />
      </div>
    </article>
  );
}

function MiniCalendar({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (date: string) => void }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const miniCalendarDays = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const dateStr = isCurrentMonth ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}` : "";
    return {
      label: isCurrentMonth ? String(dayNum) : String(dayNum <= 0 ? dayNum + 31 : dayNum - daysInMonth),
      muted: !isCurrentMonth,
      selected: isCurrentMonth && dateStr === selectedDate,
      dateStr,
    };
  });
  return (
    <article className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <IconButton label="Mois précédent" icon={ChevronLeft} />
        <h2 className="text-base font-bold text-[#0F172A]">{monthNames[month]} {year}</h2>
        <IconButton label="Mois suivant" icon={ChevronRight} />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#64748B]">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (<span key={day} className="py-2">{day}</span>))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {miniCalendarDays.map((day, index) => (
          <button type="button" key={`${day.label}-${index}`} disabled={day.muted} onClick={() => { if (!day.muted) onSelectDate(day.dateStr); }} className={cx("relative flex h-9 items-center justify-center rounded-xl text-sm font-bold transition", day.selected ? "bg-[#0F766E] text-white shadow-md shadow-teal-700/20" : day.muted ? "text-slate-300" : "text-[#0F172A] hover:bg-teal-50 cursor-pointer")}>
            {day.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function PlanningTable({ selectedDate, planningRows, appointments, onSelectAppointment, onUpdateStatus }: { selectedDate: string; planningRows: PlanningRow[]; appointments: Appointment[]; onSelectAppointment: (a: Appointment) => void; onUpdateStatus: (appointment: Appointment, status: string) => void }) {
  const isToday = selectedDate === formatDate(new Date());
  const dateLabel = isToday ? "Aujourd'hui" : selectedDate.split("-").reverse().join("/");
  return (
    <article className={panelClass}>
      <div className="mb-3 flex items-center justify-between gap-3 2xl:mb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]"><Calendar className="h-5 w-5" aria-hidden="true" /></span>
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">Planning du jour</h2>
            <p className="text-xs font-bold text-[#64748B]">{dateLabel}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-[#64748B]">{planningRows.length} RDV</span>
      </div>
      {planningRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-[#64748B]"><Calendar className="h-7 w-7" /></span>
          <p className="mt-3 text-sm font-bold text-[#0F172A]">Aucun rendez-vous</p>
          <p className="mt-1 text-xs font-semibold text-[#64748B]">Pas de rendez-vous prévus pour cette date.</p>
          <Link href="/rendez-vous/nouveau" className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:shadow-xl">
            <Plus className="h-4 w-4" /> Ajouter un rendez-vous
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-[#64748B]">
                  {["Heure", "Patient", "Traitement", "Dentiste", "Statut", "Actions"].map((head) => (<th key={head} className="border-b border-[#E2E8F0] pb-3 pr-4">{head}</th>))}
                </tr>
              </thead>
              <tbody>
                {planningRows.map((row, index) => (
                  <tr key={`${row.time}-${row.patient}-${index}`} className="cursor-pointer transition hover:bg-slate-50" onClick={() => onSelectAppointment(appointments[index])}>
                    <td className="border-b border-slate-100 py-4 pr-4 font-bold text-[#0F172A]">{row.time}</td>
                    <td className="border-b border-slate-100 py-4 pr-4">
                      <div className="flex items-center gap-3"><Avatar name={row.patient} className="h-9 w-9 text-xs" /><span className="font-bold text-[#0F172A]">{row.patient}</span></div>
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-medium text-[#64748B]">{row.treatment}</td>
                    <td className="border-b border-slate-100 py-4 pr-4 font-semibold text-[#0F172A]">{row.dentist}</td>
                    <td className="border-b border-slate-100 py-4 pr-4"><StatusBadge status={row.status} /></td>
                    <td className="border-b border-slate-100 py-4">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <IconButton label={`Voir ${row.patient}`} icon={Eye} onClick={() => onSelectAppointment(appointments[index])} />
                        {(row.status === "En attente" || row.status === "Annulé" || row.status === "Absent" || row.status === "Reporté") && (
                          <IconButton label={`Confirmer ${row.patient}`} icon={CheckCircle} onClick={() => onUpdateStatus(appointments[index], "Confirmé")} />
                        )}
                        {row.status === "Confirmé" && (
                          <IconButton label={`Arrivé ${row.patient}`} icon={CheckCircle2} onClick={() => onUpdateStatus(appointments[index], "Arrivé")} />
                        )}
                        {row.status === "Arrivé" && (
                          <IconButton label={`Commencer ${row.patient}`} icon={CheckCircle2} onClick={() => onUpdateStatus(appointments[index], "En consultation")} />
                        )}
                        {row.status === "En consultation" && (
                          <IconButton label={`Terminer ${row.patient}`} icon={CheckCircle2} onClick={() => onUpdateStatus(appointments[index], "Terminé")} />
                        )}
                        {(row.status === "En attente" || row.status === "Confirmé" || row.status === "Arrivé" || row.status === "En consultation" || row.status === "Reporté") && (
                          <IconButton label={`Annuler ${row.patient}`} icon={X} onClick={() => onUpdateStatus(appointments[index], "Annulé")} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MobileAppointmentCards planningRows={planningRows} appointments={appointments} onSelectAppointment={onSelectAppointment} onUpdateStatus={onUpdateStatus} />
        </>
      )}
    </article>
  );
}

function MobileAppointmentCards({ planningRows, appointments, onSelectAppointment, onUpdateStatus }: { planningRows: PlanningRow[]; appointments: Appointment[]; onSelectAppointment: (a: Appointment) => void; onUpdateStatus: (appointment: Appointment, status: string) => void }) {
  return (
    <div className="grid gap-3 md:hidden">
      {planningRows.map((row, index) => (
        <article key={`${row.time}-${row.patient}-${index}`} className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-[#0F172A]">{row.time}</p>
              <h3 className="mt-1 font-bold text-[#0F172A]">{row.patient}</h3>
              <p className="text-sm font-medium text-[#64748B]">{row.treatment}</p>
              <p className="mt-1 text-sm font-semibold text-[#0F766E]">{row.dentist}</p>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => onSelectAppointment(appointments[index])} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A]"><Eye className="h-4 w-4" />Voir</button>
            {(row.status === "En attente" || row.status === "Annulé" || row.status === "Absent" || row.status === "Reporté") && (
              <button type="button" onClick={() => onUpdateStatus(appointments[index], "Confirmé")} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white"><CheckCircle className="h-4 w-4" />Confirmer</button>
            )}
            {row.status === "Confirmé" && (
              <button type="button" onClick={() => onUpdateStatus(appointments[index], "Arrivé")} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4" />Arrivé</button>
            )}
            {row.status === "Arrivé" && (
              <button type="button" onClick={() => onUpdateStatus(appointments[index], "En consultation")} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4" />Commencer</button>
            )}
            {row.status === "En consultation" && (
              <button type="button" onClick={() => onUpdateStatus(appointments[index], "Terminé")} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4" />Terminer</button>
            )}
            {(row.status === "En attente" || row.status === "Confirmé" || row.status === "Arrivé" || row.status === "En consultation" || row.status === "Reporté") && (
              <button type="button" onClick={() => onUpdateStatus(appointments[index], "Annulé")} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-600"><X className="h-4 w-4" />Annuler</button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function RendezVousPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statsData, setStatsData] = useState<StatsData>({ total_today: 0, confirmed: 0, en_attente: 0, en_consultation: 0, termine: 0, annules: 0 });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [filterDentist, setFilterDentist] = useState("");
  const [filterTreatment, setFilterTreatment] = useState("");
  const [calendarView, setCalendarView] = useState<CalendarView>("semaine");
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + offset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const weekDates = getWeekDates(weekStart);

  const fetchData = useCallback(async () => {
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        api<{ data: ApiAppointment[] }>("/appointments?per_page=100"),
        api<StatsData>("/appointments/stats"),
      ]);
      const mapped = (appointmentsRes.data || []).map(mapApiAppointment);
      setAppointments(mapped);
      setStatsData(statsRes);
      if (mapped.length > 0 && !selectedAppointment) {
        setSelectedAppointment(mapped[0]);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    fetchData();
  }, []);

  const stats: Stat[] = [
    { label: "Rendez-vous aujourd'hui", value: String(statsData.total_today), trend: "Aujourd'hui", icon: CalendarDays, accent: "from-[#2563EB] to-[#60A5FA]" },
    { label: "Confirmés", value: String(statsData.confirmed), trend: "Aujourd'hui", icon: CheckCircle2, accent: "from-[#22C55E] to-[#86EFAC]" },
    { label: "En attente", value: String(statsData.en_attente), trend: "À confirmer", icon: Clock3, accent: "from-[#F59E0B] to-[#FDBA74]" },
    { label: "Terminés", value: String(statsData.termine), trend: "Aujourd'hui", icon: AlertTriangle, accent: "from-[#EF4444] to-[#FB7185]" },
  ];

  const todayStr = formatDate(new Date());

  const uniqueDentists = [...new Set(appointments.map((a) => a.dentist))].sort();
  const uniqueTreatments = [...new Set(appointments.map((a) => a.treatment))].sort();

  const filteredAppointments = appointments.filter((a) => {
    if (filterDentist && a.dentist !== filterDentist) return false;
    if (filterTreatment && a.treatment !== filterTreatment) return false;
    return true;
  });

  const selectedAppointments = filteredAppointments.filter((a) => a.appointmentDate === selectedDate);
  const planningRows: PlanningRow[] = selectedAppointments.map((a) => ({
    time: a.time,
    patient: a.patient,
    treatment: a.treatment,
    dentist: a.dentist,
    status: a.status,
    apiId: a.apiId,
  }));

  const handlePrevWeek = () => {
    if (calendarView === "mois") {
      setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (calendarView === "jour") {
      setSelectedDate((prev) => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() - 1); return formatDate(d); });
    } else {
      const prev = new Date(weekStart);
      prev.setDate(prev.getDate() - 7);
      setWeekStart(prev);
    }
  };

  const handleNextWeek = () => {
    if (calendarView === "mois") {
      setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (calendarView === "jour") {
      setSelectedDate((prev) => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() + 1); return formatDate(d); });
    } else {
      const next = new Date(weekStart);
      next.setDate(next.getDate() + 7);
      setWeekStart(next);
    }
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleUpdateStatus = useCallback(async (appointment: Appointment, newStatus: string) => {
    try {
      await api(`/appointments/${appointment.apiId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      const mappedStatus = newStatus as AppointmentStatus;
      const newColor = statusColorMap[mappedStatus] || "blue";
      const update = (a: Appointment) => a.apiId === appointment.apiId ? { ...a, status: mappedStatus, color: newColor } : a;
      setAppointments((prev) => prev.map(update));
      setSelectedAppointment((prev) => prev && prev.apiId === appointment.apiId ? { ...prev, status: mappedStatus, color: newColor } : prev);
    } catch {
      //
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <PageActions />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistiques rendez-vous">
        {stats.map((stat) => (<StatCard key={stat.label} stat={stat} />))}
      </section>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-5">
        <section className="space-y-4 2xl:space-y-5">
          <WeeklyCalendar appointments={filteredAppointments} weekDates={weekDates} onPrevWeek={handlePrevWeek} onNextWeek={handleNextWeek} onSelectAppointment={handleSelectAppointment} dentists={uniqueDentists} treatments={uniqueTreatments} filterDentist={filterDentist} filterTreatment={filterTreatment} onFilterDentist={setFilterDentist} onFilterTreatment={setFilterTreatment} calendarView={calendarView} onCalendarViewChange={setCalendarView} monthDate={monthDate} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <PlanningTable selectedDate={selectedDate} planningRows={planningRows} appointments={selectedAppointments} onSelectAppointment={handleSelectAppointment} onUpdateStatus={handleUpdateStatus} />
        </section>
        <aside className="space-y-4 2xl:space-y-5">
          <AppointmentDetails appointment={selectedAppointment} router={router} onUpdateStatus={handleUpdateStatus} />
          <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </aside>
      </div>
    </section>
  );
}
