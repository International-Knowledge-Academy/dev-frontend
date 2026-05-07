// @ts-nocheck
import ReactApexChart from "react-apexcharts";
import {
  MdWorkspacePremium, MdAssignment, MdSchool, MdLocationOn,
  MdCategory, MdPeople, MdPayment, MdLayers, MdTrendingUp,
  MdPending, MdCheckCircle, MdRefresh,
} from "react-icons/md";
import { DollarSign, Clock } from "lucide-react";
import useDashboard from "hooks/dashboard/useDashboard";
import useAuth from "hooks/auth/useAuth";

/* ─── Config maps ─────────────────────────────────────────────────────────── */

const SUMMARY_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  total_programs:         { label: "Total Programs",     icon: MdWorkspacePremium, color: "text-navy-600",   bg: "bg-navy-50"   },
  total_registrations:    { label: "Registrations",      icon: MdAssignment,       color: "text-indigo-600", bg: "bg-indigo-50" },
  total_trainers:         { label: "Trainers",           icon: MdSchool,           color: "text-green-600",  bg: "bg-green-50"  },
  total_locations:        { label: "Locations",          icon: MdLocationOn,       color: "text-gold-600",   bg: "bg-gold-50"   },
  total_categories:       { label: "Categories",         icon: MdCategory,         color: "text-orange-500", bg: "bg-orange-50" },
  total_fields:           { label: "Fields",             icon: MdLayers,           color: "text-purple-600", bg: "bg-purple-50" },
  total_users:            { label: "Users",              icon: MdPeople,           color: "text-cyan-600",   bg: "bg-cyan-50"   },
  total_payments:         { label: "Payments",           icon: MdPayment,          color: "text-teal-600",   bg: "bg-teal-50"   },
  active_programs:        { label: "Active Programs",    icon: MdWorkspacePremium, color: "text-navy-600",   bg: "bg-navy-50"   },
  assigned_programs:      { label: "My Programs",        icon: MdWorkspacePremium, color: "text-navy-600",   bg: "bg-navy-50"   },
  assigned_registrations: { label: "My Registrations",  icon: MdAssignment,       color: "text-indigo-600", bg: "bg-indigo-50" },
  pending_registrations:  { label: "Pending",            icon: MdPending,          color: "text-amber-600",  bg: "bg-amber-50"  },
  approved_registrations: { label: "Approved",           icon: MdCheckCircle,      color: "text-green-600",  bg: "bg-green-50"  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "text-amber-600"  },
  approved:  { label: "Approved",  color: "text-green-600"  },
  rejected:  { label: "Rejected",  color: "text-red-500"    },
  completed: { label: "Completed", color: "text-navy-700"   },
  cancelled: { label: "Cancelled", color: "text-slate-400"  },
  ongoing:   { label: "Ongoing",   color: "text-blue-600"   },
  upcoming:  { label: "Upcoming",  color: "text-sky-600"    },
};

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  approved:  "bg-green-50 text-green-600 border-green-200",
  rejected:  "bg-red-50 text-red-500 border-red-200",
  completed: "bg-navy-50 text-navy-700 border-navy-200",
  cancelled: "bg-slate-100 text-slate-400 border-slate-200",
};

const CHART_COLORS = ["#F59E0B","#22C55E","#EF4444","#1E3A5F","#94A3B8","#3B82F6","#0EA5E9"];

const formatKey  = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-xl bg-slate-100 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { data, loading, error, refetch } = useDashboard();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={refetch} className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-800 font-medium">
          <MdRefresh size={16} /> Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const summaryEntries = Object.entries(data.summary ?? {});
  const statusEntries  = Object.entries(data.registrations_by_status ?? {});
  const totalByStatus  = statusEntries.reduce((s, [, v]) => s + v, 0);

  const chartSeries  = statusEntries.map(([, v]) => v);
  const chartLabels  = statusEntries.map(([k]) => STATUS_CONFIG[k]?.label ?? formatKey(k));
  const chartOptions = {
    chart:      { type: "donut", background: "transparent" },
    labels:     chartLabels,
    colors:     CHART_COLORS,
    legend:     { show: false },
    dataLabels: { enabled: false },
    stroke:     { width: 2 },
    plotOptions: { pie: { donut: { size: "72%", labels: { show: true, total: { show: true, label: "Total", fontSize: "13px", color: "#64748b", formatter: () => totalByStatus.toString() }, value: { fontSize: "26px", fontWeight: 700, color: "#1e3a5f" } } } } },
    tooltip:    { theme: "light" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Greeting banner ── */}
      <div className="relative bg-navy-800 rounded-2xl px-7 py-6 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-navy-700/50 to-transparent pointer-events-none" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <p className="text-navy-300 text-sm mb-1">
            {greeting()}, <span className="text-gold-400 font-semibold">{user?.name ?? "Manager"}</span>
          </p>
          <h1 className="text-white text-2xl font-extrabold leading-tight">
            Account Manager Dashboard
          </h1>
          <p className="text-navy-400 text-xs mt-1.5">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {summaryEntries.map(([key, value]) => {
          const cfg  = SUMMARY_CONFIG[key];
          const Icon = cfg?.icon ?? MdTrendingUp;
          return (
            <div key={key} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${cfg?.bg ?? "bg-slate-50"} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={cfg?.color ?? "text-slate-500"} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-navy-800 leading-none tabular-nums">
                  {value?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">{cfg?.label ?? formatKey(key)}</p>
              </div>
            </div>
          );
        })}

        {/* Revenue */}
        {data.revenue != null && (
          <div className="bg-emerald-600 rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <DollarSign size={20} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white leading-none tabular-nums">
                ${Number(data.revenue).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-100 mt-1.5">Total Revenue</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Registrations by status ── */}
      {statusEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
            Registrations by Status
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Donut */}
            <div className="flex-shrink-0 -my-2">
              <ReactApexChart
                type="donut"
                series={chartSeries}
                options={chartOptions}
                width={200}
                height={200}
              />
            </div>

            {/* Breakdown bars */}
            <div className="flex-1 w-full space-y-3">
              {statusEntries.map(([status, count], i) => {
                const cfg = STATUS_CONFIG[status];
                const pct = totalByStatus > 0 ? Math.round((count / totalByStatus) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-sm text-slate-600">{cfg?.label ?? formatKey(status)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy-800 tabular-nums">{count}</span>
                        <span className="text-xs text-slate-400 w-8 text-right tabular-nums">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent registrations ── */}
      {data.recent_registrations?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-navy-50 flex items-center justify-center">
                <Clock size={14} className="text-navy-600" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Registrations</p>
            </div>
            <span className="text-xs text-slate-400">{data.recent_registrations.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Participant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Program</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recent_registrations.map((reg) => (
                  <tr key={reg.uid} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-bold flex-shrink-0">
                          {reg.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <span className="font-medium text-navy-800 truncate max-w-[140px]">{reg.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 truncate max-w-[200px]">{reg.program_name}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[reg.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatDate(reg.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
