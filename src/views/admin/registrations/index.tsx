// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList, UserCheck, Clock, RefreshCw,
  Pencil, Trash2, AlertTriangle, X, Filter,
} from "lucide-react";
import useRegistrations from "hooks/registrations/useRegistrations";
import useDeleteRegistration from "hooks/registrations/useDeleteRegistration";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import type { Registration } from "types/registration";

const STATUS_COLORS = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  approved:  "bg-green-50 text-green-600 border-green-200",
  rejected:  "bg-red-50 text-red-500 border-red-200",
  completed: "bg-navy-50 text-navy-700 border-navy-200",
  cancelled: "bg-slate-50 text-slate-400 border-slate-200",
};

const DOT_COLORS = {
  pending:   "bg-amber-400",
  approved:  "bg-green-500",
  rejected:  "bg-red-400",
  completed: "bg-navy-600",
  cancelled: "bg-slate-300",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-gold-50 border border-gold-200" : "bg-navy-50 border border-navy-100"}`}>
      <Icon size={18} className={accent ? "text-gold-500" : "text-navy-600"} />
    </div>
    <div className="min-w-0">
      <p className={`text-2xl font-extrabold tabular-nums leading-none ${accent ? "text-gold-500" : "text-navy-800"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</p>
    </div>
  </div>
);

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending",   label: "Pending" },
  { value: "approved",  label: "Approved" },
  { value: "rejected",  label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const TYPE_OPTIONS = [
  { value: "",          label: "All Types" },
  { value: "personal",  label: "Personal" },
  { value: "corporate", label: "Corporate" },
];

const RegistrationsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { registrations, count, loading, error, params, setParams, refetch } = useRegistrations();
  const { deleteRegistration, loading: deleting } = useDeleteRegistration();

  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [filtersOpen, setFiltersOpen]   = useState(false);

  const totalApproved = registrations.filter((r) => r.status === "approved").length;
  const totalPending  = registrations.filter((r) => r.status === "pending").length;

  const activeFilterCount = [
    !!(params as any).status,
    !!(params as any).registration_type,
  ].filter(Boolean).length;

  const hasAnyFilter = activeFilterCount > 0 || !!params.search;

  const clearAllFilters = () =>
    setParams({ search: undefined, ordering: undefined } as any);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteRegistration(deleteTarget.uid);
    if (ok) {
      addToast("Registration deleted", "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete registration", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Registrations"
        subtitle="Manage program registrations"
        className="mb-4 px-0 sm:px-0"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={ClipboardList} label="Total" value={count}         />
        <StatCard icon={Clock}         label="Pending" value={totalPending} accent />
        <StatCard icon={UserCheck}     label="Approved" value={totalApproved} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy-700 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-200" />
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search registrations..."
            className="flex-1 max-w-xs"
          />
          <div className="hidden sm:flex items-center gap-2">
            <FilterSelectField
              value={(params as any).status ?? ""}
              onChange={(val) => setParams({ status: val || undefined } as any)}
              icon={ClipboardList}
              defaultOption="All Statuses"
              options={STATUS_OPTIONS.slice(1)}
            />
            <FilterSelectField
              value={(params as any).registration_type ?? ""}
              onChange={(val) => setParams({ registration_type: val || undefined } as any)}
              icon={UserCheck}
              defaultOption="All Types"
              options={TYPE_OPTIONS.slice(1)}
            />
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-200" />
          <IconButton
            onClick={refetch}
            icon={<RefreshCw size={15} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="hidden sm:flex p-2 flex-shrink-0"
          />
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} />
              Clear all
            </button>
          )}
          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{registrations.length}</span> of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative sm:hidden flex-shrink-0 p-2 rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-navy-700 text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <FilterSelectField
              value={(params as any).status ?? ""}
              onChange={(val) => setParams({ status: val || undefined } as any)}
              icon={ClipboardList}
              defaultOption="All Statuses"
              options={STATUS_OPTIONS.slice(1)}
            />
            <FilterSelectField
              value={(params as any).registration_type ?? ""}
              onChange={(val) => setParams({ registration_type: val || undefined } as any)}
              icon={UserCheck}
              defaultOption="All Types"
              options={TYPE_OPTIONS.slice(1)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={refetch}
                  icon={<RefreshCw size={14} />}
                  bgColor="bg-white"
                  textColor="text-slate-500"
                  borderColor="border-slate-200"
                  hoverTextColor="hover:text-slate-700"
                  hoverBorderColor="hover:border-slate-300"
                  className="p-2"
                />
                {hasAnyFilter && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    <X size={12} />
                    Clear all
                  </button>
                )}
              </div>
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{registrations.length}</span> of{" "}
                  <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching registrations..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : registrations.length === 0 ? (
              <EmptyState
                icon={<ClipboardList />}
                title="No registrations found"
                description="No registrations match your search or filters."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["Participant", "Program", "Type", "Price", "Status", "Date", "Actions"].map((label) => (
                        <th key={label} className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {registrations.map((reg) => (
                      <tr
                        key={reg.uid}
                        onClick={() => navigate(`/admin/registrations/${reg.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {reg.full_name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-navy-800 truncate" title={reg.full_name}>
                                {reg.full_name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">{reg.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 truncate max-w-[160px]">
                          {reg.program?.name ?? "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 capitalize">
                            {reg.registration_type ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 tabular-nums">
                          {reg.program?.price ? `$${reg.program.price}` : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_COLORS[reg.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[reg.status] ?? "bg-slate-300"}`} />
                            <span className="capitalize">{reg.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {reg.registration_date
                            ? new Date(reg.registration_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/registrations/${reg.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(reg)}
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
                <p className="text-xs text-slate-400">Page {params.page ?? 1} of {totalPages}</p>
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
        title="Delete Registration"
        message={
          <>
            Are you sure you want to delete the registration for{" "}
            <span className="font-semibold text-navy-800">{deleteTarget?.full_name}</span>?{" "}
            This action cannot be undone.
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

export default RegistrationsPage;
