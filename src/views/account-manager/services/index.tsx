// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, RefreshCw, AlertTriangle, X, Filter,
  Trash2, Pencil, CheckCircle, XCircle, FileText,
  Plus, Users,
} from "lucide-react";
import useServices from "hooks/services/useServices";
import useDeleteService from "hooks/services/useDeleteService";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import PageHeader from "components/ui/PageHeader";
import IconButton from "components/ui/buttons/IconButton";
import SearchInput from "components/form/SearchInput";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import type { Service } from "types/additionalService";

/* ─── Stat card ──────────────────────────────────────────────────────────── */
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

/* ─── Page ───────────────────────────────────────────────────────────────── */
const ServicesPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { services, count, loading, error, params, setParams, refetch } = useServices();
  const { deleteService, loading: deleting } = useDeleteService();

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const activeCount = services.filter((s) => s.is_active).length;
  const hasSearch   = !!params.search;
  const totalPages  = Math.ceil(count / 10);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteService(deleteTarget.uid);
    if (ok) {
      addToast("Service deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Manage services offered by the academy"
        className="mb-4 px-0 sm:px-0"
        actions={
          <button
            type="button"
            onClick={() => navigate("/account-manager/services/create")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md lg:rounded-lg bg-navy-800 text-white text-xs font-semibold hover:bg-navy-700 transition"
          >
            <Plus size={14} /> Add Service
          </button>
        }
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Package}      label="Total Services"  value={count}       />
        <StatCard icon={CheckCircle}  label="Active Services" value={activeCount} accent />
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
            placeholder="Search services..."
            className="flex-1"
          />

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

          {hasSearch && (
            <button
              type="button"
              onClick={() => setParams({ search: undefined })}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} /> Clear
            </button>
          )}

          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{services.length}</span>{" "}
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
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
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
                Showing <span className="font-semibold text-slate-600">{services.length}</span>{" "}
                of <span className="font-semibold text-slate-600">{count}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching services..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : services.length === 0 ? (
              <EmptyState
                icon={<Package />}
                title="No services yet"
                description="Services will appear here once they are added."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Service",      icon: <Package     size={13} /> },
                        { label: "Summary",      icon: <FileText    size={13} /> },
                        { label: "Registration", icon: <Users       size={13} /> },
                        { label: "Status",       icon: <CheckCircle size={13} /> },
                        { label: "Actions",      icon: null },
                      ].map(({ label, icon }) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400"
                        >
                          <span className="flex items-center gap-1.5">{icon}{label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {services.map((service) => (
                      <tr
                        key={service.uid}
                        onClick={() => navigate(`/account-manager/services/${service.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Service name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {service.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate max-w-[180px]" title={service.name}>
                              {service.name}
                            </span>
                          </div>
                        </td>

                        {/* Summary */}
                        <td className="px-5 py-3.5">
                          {service.summary ? (
                            <span className="text-slate-500 truncate max-w-[240px] block" title={service.summary}>
                              {service.summary}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Registration */}
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-50 text-navy-700 border border-navy-100">
                            <Users size={11} />
                            {service.registration ?? 0}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          {service.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                              <CheckCircle size={11} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                              <XCircle size={11} /> Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/account-manager/services/${service.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(service)}
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

            {/* Pagination */}
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
        title="Delete Service"
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

export default ServicesPage;
