// @ts-nocheck
import ReactApexChart from "react-apexcharts";
import {
  MdWorkspacePremium, MdAssignment, MdSchool, MdLocationOn,
  MdCategory, MdPeople, MdPayment, MdLayers, MdTrendingUp,
  MdPending, MdCheckCircle, MdRefresh,
} from "react-icons/md";
import { DollarSign, Clock } from "lucide-react";
import useDashboard from "hooks/dashboard/useDashboard";

/* ─── Config ──────────────────────────────────────────────────────────────── */

const SUMMARY_CONFIG = {
  total_programs:         { label: "Total Programs",    icon: MdWorkspacePremium, color: "text-navy-600",   bg: "bg-navy-50"   },
  total_registrations:    { label: "Registrations",     icon: MdAssignment,       color: "text-indigo-600", bg: "bg-indigo-50" },
  total_trainers:         { label: "Trainers",          icon: MdSchool,           color: "text-green-600",  bg: "bg-green-50"  },
  total_locations:        { label: "Locations",         icon: MdLocationOn,       color: "text-amber-500",  bg: "bg-amber-50"  },
  total_categories:       { label: "Categories",        icon: MdCategory,         color: "text-orange-500", bg: "bg-orange-50" },
  total_fields:           { label: "Fields",            icon: MdLayers,           color: "text-purple-600", bg: "bg-purple-50" },
  total_users:            { label: "Users",             icon: MdPeople,           color: "text-sky-600",    bg: "bg-sky-50"    },
  total_payments:         { label: "Payments",          icon: MdPayment,          color: "text-teal-600",   bg: "bg-teal-50"   },
  active_programs:        { label: "Active Programs",   icon: MdWorkspacePremium, color: "text-navy-600",   bg: "bg-navy-50"   },
  pending_registrations:  { label: "Pending",           icon: MdPending,          color: "text-amber-600",  bg: "bg-amber-50"  },
  approved_registrations: { label: "Approved",          icon: MdCheckCircle,      color: "text-green-600",  bg: "bg-green-50"  },
};

const STATUS_COLORS = {
  pending:   "#F59E0B",
  approved:  "#22C55E",
  rejected:  "#EF4444",
  completed: "#1E3A5F",
  cancelled: "#94A3B8",
  ongoing:   "#3B82F6",
  upcoming:  "#0EA5E9",
};

const STATUS_LABELS = {
  pending:   "Pending",
  approved:  "Approved",
  rejected:  "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
  ongoing:   "Ongoing",
  upcoming:  "Upcoming",
};

const STATUS_BADGE = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  approved:  "bg-green-50 text-green-600 border-green-200",
  rejected:  "bg-red-50 text-red-500 border-red-200",
  completed: "bg-navy-50 text-navy-700 border-navy-200",
  cancelled: "bg-slate-100 text-slate-400 border-slate-200",
};

const ROLE_COLORS = ["#1E3A5F", "#F59E0B", "#22C55E", "#EF4444", "#0EA5E9", "#94A3B8"];

const formatKey  = (k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }) => (
  <div className={`relative overflow-hidden rounded-xl bg-slate-100 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

/* ─── KPI Card ────────────────────────────────────────────────────────────── */
const KpiCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <p className="text-sm font-medium text-slate-500 leading-snug pr-2">{label}</p>
      <div className={`w-9 h-9 rounded-lg ${bg ?? "bg-slate-50"} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={color ?? "text-slate-500"} />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-navy-800 tabular-nums leading-none">
      {typeof value === "number" ? value.toLocaleString() : value}
    </p>
  </div>
);

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-72" />
          <Skeleton className="h-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-800 font-medium"
        >
          <MdRefresh size={16} /> Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const summaryEntries = Object.entries(data.summary ?? {});
  const statusEntries  = Object.entries(data.registrations_by_status ?? {});
  const roleEntries    = Object.entries(data.users_by_role ?? {});
  const totalByStatus  = statusEntries.reduce((s, [, v]) => s + v, 0);
  const totalByRole    = roleEntries.reduce((s, [, v]) => s + v, 0);
  const approvedCount  = data.registrations_by_status?.approved ?? 0;
  const approvalRate   = totalByStatus > 0 ? Math.round((approvedCount / totalByStatus) * 100) : 0;
  const maxStatusVal   = Math.max(...statusEntries.map(([, v]) => v), 0);

  /* ── Bar chart ── */
  const barSeries = [{
    name: "Registrations",
    data: statusEntries.map(([k, v]) => ({
      x: STATUS_LABELS[k] ?? formatKey(k),
      y: v,
      fillColor: v === maxStatusVal
        ? (STATUS_COLORS[k] ?? "#1E3A5F")
        : "#E2E8F0",
    })),
  }];
  const barOptions = {
    chart:       { type: "bar", toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "48%", distributed: true } },
    dataLabels:  { enabled: false },
    xaxis: {
      type: "category",
      axisBorder: { show: false },
      axisTicks:  { show: false },
      labels:     { style: { colors: "#94a3b8", fontSize: "12px", fontWeight: 500 } },
    },
    yaxis:  { labels: { style: { colors: "#94a3b8", fontSize: "12px" } }, min: 0 },
    grid:   { borderColor: "#f1f5f9", strokeDashArray: 4, xaxis: { lines: { show: false } } },
    colors: statusEntries.map(([k, v]) =>
      v === maxStatusVal ? (STATUS_COLORS[k] ?? "#1E3A5F") : "#E2E8F0"
    ),
    tooltip: { theme: "light", y: { formatter: (v) => `${v} registrations` } },
    legend:  { show: false },
  };

  /* ── Gauge ── */
  const gaugeOptions = {
    chart: { type: "radialBar", background: "transparent" },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle:    135,
        hollow: { size: "65%", background: "transparent" },
        track:  { background: "#f1f5f9", strokeWidth: "100%" },
        dataLabels: {
          name:  { show: true, fontSize: "12px", color: "#94a3b8", offsetY: 20 },
          value: { show: true, fontSize: "28px", fontWeight: 800, color: "#1e3a5f", offsetY: -14, formatter: (v) => `${v}%` },
        },
      },
    },
    labels:  ["Approval Rate"],
    colors:  ["#22C55E"],
    stroke:  { lineCap: "round" },
  };

  return (
    <div className="space-y-5">

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {summaryEntries.map(([key, value]) => {
          const cfg = SUMMARY_CONFIG[key];
          return (
            <KpiCard
              key={key}
              label={cfg?.label ?? formatKey(key)}
              value={value}
              icon={cfg?.icon ?? MdTrendingUp}
              color={cfg?.color}
              bg={cfg?.bg}
            />
          );
        })}

        {data.revenue != null && (
          <div className="bg-emerald-600 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-emerald-100">Total Revenue</p>
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <DollarSign size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white tabular-nums leading-none">
              ${Number(data.revenue).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ── Charts row ── */}
      {(statusEntries.length > 0 || roleEntries.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Column bar chart */}
          {statusEntries.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-1">
                <p className="text-base font-bold text-navy-800">Registrations by Status</p>
                <span className="text-xs text-slate-400 tabular-nums">{totalByStatus.toLocaleString()} total</span>
              </div>
              <p className="text-xs text-slate-400 mb-5">Breakdown across all registration stages</p>
              <ReactApexChart type="bar" series={barSeries} options={barOptions} height={230} />
            </div>
          )}

          {/* Users by role */}
          {roleEntries.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <p className="text-base font-bold text-navy-800">Users by Role</p>
                <span className="text-xs font-semibold text-slate-400 tabular-nums">{totalByRole.toLocaleString()}</span>
              </div>

              {/* Top 3 role blocks */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {roleEntries.slice(0, 3).map(([role, count], i) => (
                  <div
                    key={role}
                    className="text-center p-2.5 rounded-lg"
                    style={{ backgroundColor: `${ROLE_COLORS[i % ROLE_COLORS.length]}18` }}
                  >
                    <p
                      className="text-lg font-extrabold tabular-nums leading-none"
                      style={{ color: ROLE_COLORS[i % ROLE_COLORS.length] }}
                    >
                      {count.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 capitalize leading-tight">{formatKey(role)}</p>
                  </div>
                ))}
              </div>

              {/* Segmented bar */}
              <div className="flex h-2 rounded-full overflow-hidden gap-px mb-4">
                {roleEntries.map(([role, count], i) => (
                  <div
                    key={role}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${totalByRole > 0 ? (count / totalByRole) * 100 : 0}%`,
                      backgroundColor: ROLE_COLORS[i % ROLE_COLORS.length],
                    }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-2.5 flex-1">
                {roleEntries.map(([role, count], i) => {
                  const pct = totalByRole > 0 ? Math.round((count / totalByRole) * 100) : 0;
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ROLE_COLORS[i % ROLE_COLORS.length] }}
                        />
                        <span className="text-xs text-slate-500 capitalize">{formatKey(role)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-navy-800 tabular-nums">{count.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 tabular-nums">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent registrations table */}
        {data.recent_registrations?.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-navy-800">Recent Registrations</p>
                <p className="text-xs text-slate-400 mt-0.5">Latest {data.recent_registrations.length} entries</p>
              </div>
              <Clock size={15} className="text-slate-300" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/60">
                    {["Participant", "Program", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recent_registrations.map((reg) => (
                    <tr key={reg.uid} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-bold flex-shrink-0">
                            {reg.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <span className="font-medium text-navy-800 truncate max-w-[130px]">{reg.full_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 truncate max-w-[160px]">{reg.program_name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[reg.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {STATUS_LABELS[reg.status] ?? reg.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatDate(reg.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approval rate gauge */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="mb-1">
            <p className="text-base font-bold text-navy-800">Approval Rate</p>
            <p className="text-xs text-slate-400 mt-0.5">Approved vs. all registrations</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ReactApexChart
              type="radialBar"
              series={[approvalRate]}
              options={gaugeOptions}
              height={220}
            />
          </div>
          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-green-600 tabular-nums">{approvedCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-slate-400 tabular-nums">
                {totalByStatus - approvedCount}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Other</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
