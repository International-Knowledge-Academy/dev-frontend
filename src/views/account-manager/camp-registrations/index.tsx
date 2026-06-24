// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tent, Clock, CheckCircle2, RefreshCw,
  Trash2, AlertTriangle, X, CalendarClock, Search, Pencil,
} from "lucide-react";
import useCampRegistrations from "hooks/campRegistrations/useCampRegistrations";
import useDeleteCampRegistration from "hooks/campRegistrations/useDeleteCampRegistration";
import useCamps from "hooks/camps/useCamps";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import PageHeader from "components/ui/PageHeader";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import FilterSelectField from "components/form/filter/FilterSelectField";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import type { CampRegistration } from "types/campRegistration";

const STATUS_COLORS = {
  pending:              "bg-amber-50 text-amber-600 border-amber-200",
  interview_scheduled:  "bg-blue-50 text-blue-600 border-blue-200",
  accepted:             "bg-green-50 text-green-600 border-green-200",
  rejected:             "bg-red-50 text-red-500 border-red-200",
};
const DOT_COLORS = {
  pending:              "bg-amber-400",
  interview_scheduled:  "bg-blue-500",
  accepted:             "bg-green-500",
  rejected:             "bg-red-400",
};
const STATUS_LABELS = {
  pending:              "Pending",
  interview_scheduled:  "Interview Scheduled",
  accepted:             "Accepted",
  rejected:             "Rejected",
};
import { GULF_COUNTRIES } from "constants/lists";
const NATIONALITY_LABELS = Object.fromEntries(GULF_COUNTRIES.map((c) => [c.code, c.name]));

const StatCard = ({ icon: Icon, label, value, accent = false }) => (
  <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-gold-50 border border-gold-200" : "bg-navy-50 border border-navy-100"}`}>
      <Icon size={18} className={accent ? "text-gold-500" : "text-navy-600"} />
    </div>
    <div className="min-w-0">
      <p className={`text-2xl font-extrabold tabular-nums leading-none ${accent ? "text-gold-500" : "text-navy-800"}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</p>
    </div>
  </div>
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const CampRegistrationsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { registrations, count, next, previous, loading, error, params, setParams, refetch } =
    useCampRegistrations();
  const { deleteCampRegistration, loading: deleting } = useDeleteCampRegistration();
  const { camps } = useCamps();
  const campNameMap = Object.fromEntries(camps.map((c) => [c.uid, c.name]));

  const [deleteTarget, setDeleteTarget] = useState<CampRegistration | null>(null);

  const activeFilterCount = [params.nationality, params.registration_type, params.source, params.status]
    .filter(Boolean).length;

  const clearAllFilters = () =>
    setParams({ nationality: "", registration_type: "", source: "", status: "", page: 1 });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteCampRegistration(deleteTarget.uid);
    if (ok) { addToast("Registration deleted.", "success"); refetch(); }
    else     { addToast("Failed to delete.", "error"); }
    setDeleteTarget(null);
  };

  const pending   = registrations.filter((r) => r.status === "pending").length;
  const accepted  = registrations.filter((r) => r.status === "accepted").length;
  const interview = registrations.filter((r) => r.status === "interview_scheduled").length;

  return (
    <div>
      <PageHeader
        title="Club Registrations"
        subtitle="Manage club registration submissions"
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={Tent}          label="Total"     value={count} />
        <StatCard icon={Clock}         label="Pending"   value={pending} />
        <StatCard icon={CalendarClock} label="Interview" value={interview} accent />
        <StatCard icon={CheckCircle2}  label="Accepted"  value={accepted} accent />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={params.search ?? ""}
              onChange={(e) => setParams({ search: e.target.value })}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition text-navy-800 placeholder-slate-400"
            />
          </div>

          {activeFilterCount > 0 && (
            <button type="button" onClick={clearAllFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition">
              <X size={12} /> Clear all
            </button>
          )}

          <button type="button" onClick={refetch}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition ml-auto">
            <RefreshCw size={15} />
          </button>

          {!loading && (
            <span className="text-xs text-slate-400 whitespace-nowrap">
              Showing <span className="font-semibold text-slate-600">{registrations.length}</span>{" "}
              of <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
          <FilterSelectField
            label="Status"
            value={params.status ?? ""}
            onChange={(v) => setParams({ status: v as any })}
            options={[
              { value: "pending",             label: "Pending" },
              { value: "interview_scheduled", label: "Interview Scheduled" },
              { value: "accepted",            label: "Accepted" },
              { value: "rejected",            label: "Rejected" },
            ]}
          />
          <FilterSelectField
            label="Type"
            value={params.registration_type ?? ""}
            onChange={(v) => setParams({ registration_type: v as any })}
            options={[
              { value: "self",  label: "Self" },
              { value: "child", label: "Child" },
            ]}
          />
          <FilterSelectField
            label="Source"
            value={params.source ?? ""}
            onChange={(v) => setParams({ source: v as any })}
            options={[
              { value: "website",  label: "Website" },
              { value: "whatsapp", label: "WhatsApp" },
              { value: "referral", label: "Referral" },
            ]}
          />
          <FilterSelectField
            label="Nationality"
            value={params.nationality ?? ""}
            onChange={(v) => setParams({ nationality: v as any })}
            options={[
              { value: "KW", label: "Kuwait" },
              { value: "OM", label: "Oman" },
              { value: "QA", label: "Qatar" },
              { value: "SA", label: "Saudi Arabia" },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Loading camp registrations..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : registrations.length === 0 ? (
              <EmptyState icon={<Tent />} title="No registrations yet" description="Club registration submissions will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["Participant", "Club", "Type", "Nationality", "Source", "Status", "Submitted", "Edit", "Del"].map((h) => (
                        <th key={h} className={`px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap ${h === "Edit" || h === "Del" ? "w-10" : ""}`}>
                          {h === "Edit" || h === "Del" ? "" : h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {registrations.map((reg) => (
                      <tr
                        key={reg.uid}
                        onClick={() => navigate(`/account-manager/club-registrations/${reg.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-700 font-bold text-xs flex-shrink-0">
                              {reg.participant.first_name[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-navy-800 truncate max-w-[160px]">
                                {reg.participant.first_name} {reg.participant.last_name}
                              </p>
                              <p className="text-xs text-slate-400 truncate max-w-[160px]">{reg.participant.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 text-sm">
                          <span className="truncate max-w-[140px] block" title={campNameMap[reg.camp]}>
                            {campNameMap[reg.camp] ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="capitalize text-slate-600 text-sm">{reg.registration_type}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-sm">
                          {NATIONALITY_LABELS[reg.participant.nationality] ?? reg.participant.nationality}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="capitalize text-slate-500 text-sm">{reg.source}</span>
                        </td>
                        <td className="px-5 py-3.5" title={STATUS_LABELS[reg.status]}>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border max-w-[140px] overflow-hidden ${STATUS_COLORS[reg.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLORS[reg.status]}`} />
                            <span className="truncate">{STATUS_LABELS[reg.status]}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {formatDate(reg.submitted_at)}
                        </td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            title="Edit registration"
                            onClick={() => navigate(`/account-manager/club-registrations/${reg.uid}/edit`)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-navy-600 hover:bg-navy-50 transition"
                          >
                            <Pencil size={14} />
                          </button>
                        </td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(reg)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {(previous || next) && (
            <div className="flex items-center justify-between mt-4">
              <PrevButton disabled={!previous} onClick={() => setParams({ page: (params.page ?? 1) - 1 })} />
              <span className="text-xs text-slate-400">Page {params.page ?? 1}</span>
              <NextButton disabled={!next} onClick={() => setParams({ page: (params.page ?? 1) + 1 })} />
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Registration"
        message={`Delete registration for ${deleteTarget?.participant.first_name} ${deleteTarget?.participant.last_name}? This cannot be undone.`}
        icon={<AlertTriangle size={22} className="text-red-500" />}
        confirmLabel="Delete"
        confirmClassName="bg-red-500 hover:bg-red-600 text-white"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CampRegistrationsPage;
