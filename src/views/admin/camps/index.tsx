// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tent, Plus, RefreshCw, Pencil, Trash2, AlertTriangle,
  X, Filter, FileText, Users, Calendar, MapPin,
} from "lucide-react";
import useCamps from "hooks/camps/useCamps";
import useDeleteCamp from "hooks/camps/useDeleteCamp";
import { useToast } from "context/ToastContext";
import PageHeader from "components/ui/PageHeader";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import Loading from "components/loading/Loading";
import type { Camp } from "types/camp";

const STATUS_COLORS = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  open:      "bg-green-50 text-green-600 border-green-200",
  closed:    "bg-red-50 text-red-500 border-red-200",
  completed: "bg-slate-50 text-slate-500 border-slate-200",
};
const STATUS_DOT = {
  upcoming:  "bg-blue-400",
  open:      "bg-green-500",
  closed:    "bg-red-400",
  completed: "bg-slate-300",
};
const STATUS_LABELS = {
  upcoming:  "Upcoming",
  open:      "Open",
  closed:    "Closed",
  completed: "Completed",
};

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

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const CampsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { camps, count, next, previous, loading, error, params, setParams, refetch } = useCamps();
  const { deleteCamp, loading: deleting } = useDeleteCamp();
  const [deleteTarget, setDeleteTarget] = useState<Camp | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const openCount     = camps.filter((c) => c.status === "open").length;
  const upcomingCount = camps.filter((c) => c.status === "upcoming").length;
  const withBrochure  = camps.filter((c) => c.brochure).length;

  const activeFilterCount = [params.status].filter(Boolean).length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteCamp(deleteTarget.uid);
    if (ok) { addToast("Club deleted.", "success"); refetch(); }
    else     { addToast("Failed to delete club.", "error"); }
    setDeleteTarget(null);
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Clubs"
        subtitle="Manage club programs and brochures"
        actions={
          <Button
            variant="dark-navy"
            text="Add Club"
            icon={<Plus size={15} />}
            onClick={() => navigate("/admin/clubs/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={Tent}     label="Total Clubs"   value={count}        />
        <StatCard icon={Users}    label="Open"          value={openCount}     accent />
        <StatCard icon={Calendar} label="Upcoming"      value={upcomingCount} />
        <StatCard icon={FileText} label="With Brochure" value={withBrochure}  accent />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val, page: 1 })}
            placeholder="Search clubs..."
            className="flex-1 min-w-[180px] max-w-xs"
          />

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md lg:rounded-lg text-sm font-medium border transition ${
              showFilters || activeFilterCount > 0
                ? "bg-navy-50 border-navy-200 text-navy-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-navy-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {(params.search || activeFilterCount > 0) && (
            <button
              type="button"
              onClick={() => setParams({ search: "", status: "", page: 1 })}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
            >
              <X size={12} /> Clear
            </button>
          )}

          <IconButton
            onClick={refetch}
            icon={<RefreshCw size={15} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="p-2 flex-shrink-0 ml-auto"
          />

          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{camps.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
            <FilterSelectField
              label="Status"
              value={params.status ?? ""}
              onChange={(v) => setParams({ status: v as any, page: 1 })}
              options={[
                { value: "upcoming",  label: "Upcoming" },
                { value: "open",      label: "Open" },
                { value: "closed",    label: "Closed" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching clubs..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : camps.length === 0 ? (
              <EmptyState
                icon={<Tent />}
                title="No clubs found"
                description="No clubs match your search. Try clearing filters or add a new club."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Club",      icon: <Tent      size={13} /> },
                        { label: "Status",    icon: null },
                        { label: "Age ", icon: <Users     size={13} /> },
                        { label: "Location",  icon: <MapPin    size={13} /> },
                        { label: "Dates",     icon: <Calendar  size={13} /> },
                        { label: "Brochure",  icon: <FileText  size={13} /> },
                        { label: "Actions",   icon: null },
                      ].map(({ label, icon }) => (
                        <th key={label} className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                          <span className="flex items-center gap-1.5">{icon}{label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {camps.map((camp) => (
                      <tr
                        key={camp.uid}
                        onClick={() => navigate(`/admin/clubs/${camp.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {camp.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate max-w-[160px]" title={camp.name}>{camp.name}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_COLORS[camp.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[camp.status] ?? "bg-slate-300"}`} />
                            {STATUS_LABELS[camp.status] ?? camp.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          {camp.min_age != null && camp.max_age != null ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-50 text-navy-700 border border-navy-100 truncate max-w-[120px]">
                              {camp.min_age} – {camp.max_age} yrs
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-slate-500 text-sm truncate max-w-[120px]" title={camp.location}>
                          {camp.location ?? "—"}
                        </td>

                        <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                          {camp.start_date ? (
                            <span>{formatDate(camp.start_date)}{camp.end_date ? ` – ${formatDate(camp.end_date)}` : ""}</span>
                          ) : "—"}
                        </td>

                        <td className="px-5 py-3.5">
                          {camp.brochure ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Uploaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> None
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/clubs/${camp.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(camp)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Page {params.page ?? 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <PrevButton
                    text="Previous"
                    disabled={!params.page || params.page <= 1}
                    onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                  />
                  <NextButton
                    text="Next"
                    disabled={(params.page ?? 1) >= totalPages}
                    onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Club"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-navy-800">{deleteTarget?.name}</span>?
            {" "}This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default CampsPage;
