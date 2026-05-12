// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake, Globe, Plus, RefreshCw, Pencil, Trash2,
  AlertTriangle, X, Filter,
} from "lucide-react";
import usePartnerships from "hooks/partnerships/usePartnerships";
import useDeletePartnership from "hooks/partnerships/useDeletePartnership";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import SearchInput from "components/form/SearchInput";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import type { Partnership } from "types/partnerships";

const PARTNERSHIP_TYPE_LABELS: Record<string, string> = {
  certification: "Certification",
  academic:      "Academic",
  corporate:     "Corporate",
  government:    "Government",
  technology:    "Technology",
  media:         "Media",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-navy-50 border border-navy-100">
      <Icon size={18} className="text-navy-600" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-extrabold tabular-nums leading-none text-navy-800">{value}</p>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</p>
    </div>
  </div>
);

const PartnershipsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { partnerships, count, loading, error, params, setParams, refetch } = usePartnerships();
  const { deletePartnership, loading: deleting } = useDeletePartnership();

  const [deleteTarget, setDeleteTarget] = useState<Partnership | null>(null);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const hasAnyFilter = !!params.search;
  const clearFilters = () => setParams({ search: undefined });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deletePartnership(deleteTarget.uid);
    if (ok) {
      addToast("Partnership deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete partnership. Please try again.", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Partnerships"
        subtitle="Manage your organisation's partnerships and alliances"
        actions={
          <Button
            variant="dark-navy"
            text="Add Partnership"
            icon={<Plus size={15} />}
            onClick={() => navigate("/account-manager/partnerships/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Handshake} label="Total Partnerships" value={count} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search partnerships..."
            className="flex-1 max-w-xs"
          />

          <div className="hidden sm:block">
            <IconButton
              onClick={refetch}
              icon={<RefreshCw size={15} />}
              bgColor="bg-white"
              textColor="text-slate-500"
              borderColor="border-slate-200"
              hoverTextColor="hover:text-slate-700"
              hoverBorderColor="hover:border-slate-300"
              className="p-2 flex-shrink-0"
            />
          </div>

          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} /> Clear all
            </button>
          )}

          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{partnerships.length}</span>{" "}
              of <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative sm:hidden flex-shrink-0 p-2 rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
          >
            <Filter size={16} />
          </button>
        </div>

        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
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
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{partnerships.length}</span>{" "}
                  of <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching partnerships..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : partnerships.length === 0 ? (
              <EmptyState
                icon={<Handshake />}
                title="No partnerships yet"
                description="Add your first partnership to get started."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["Logo", "Name", "Type", "Website", "Actions"].map((label) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {partnerships.map((p) => (
                      <tr
                        key={p.uid}
                        onClick={() => navigate(`/account-manager/partnerships/${p.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Logo */}
                        <td className="px-5 py-3.5">
                          {p.logo ? (
                            <img
                              src={p.logo}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-contain border border-slate-100 bg-white"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0">
                              {p.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                          )}
                        </td>

                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-navy-800 truncate max-w-[200px] block">
                            {p.name}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-50 text-navy-700 border border-navy-100 capitalize">
                            {PARTNERSHIP_TYPE_LABELS[p.partnership_type] ?? p.partnership_type}
                          </span>
                        </td>

                        {/* Website */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          {p.website_url ? (
                            <a
                              href={p.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-navy-600 hover:text-navy-800 hover:underline transition truncate max-w-[220px]"
                            >
                              <Globe size={13} className="flex-shrink-0" />
                              <span className="truncate">{p.website_url.replace(/^https?:\/\//, "")}</span>
                            </a>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/account-manager/partnerships/${p.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
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
        title="Delete Partnership"
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

export default PartnershipsPage;
