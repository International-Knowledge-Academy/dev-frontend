// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, MessageSquare, Plus, RefreshCw, Pencil, Trash2,
  AlertTriangle, X, Filter, User, Mail, Briefcase,
} from "lucide-react";
import useFeedbacks from "hooks/feedbacks/useFeedbacks";
import useDeleteFeedback from "hooks/feedbacks/useDeleteFeedback";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import type { Feedback } from "types/feedback";

const BASE = "/account-manager/feedbacks";

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={s <= rating ? "text-gold-400 fill-gold-400" : "text-slate-200 fill-slate-200"}
      />
    ))}
  </div>
);

const StatCard = ({
  icon: Icon, label, value, accent = false,
}: {
  icon: React.ElementType; label: string; value: number | string; accent?: boolean;
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

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const ManagerFeedbacksPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { feedbacks, count, loading, error, params, setParams, refetch } = useFeedbacks();
  const { deleteFeedback, loading: deleting } = useDeleteFeedback();

  const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null);
  const [filtersOpen, setFiltersOpen]   = useState(false);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.rating ?? 0), 0) / feedbacks.length).toFixed(1)
    : "—";

  const hasAnyFilter = !!params.search;
  const clearAllFilters = () => setParams({ search: undefined });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteFeedback(deleteTarget.uid);
    if (ok) {
      addToast("Feedback deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete feedback. Please try again.", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Feedbacks"
        subtitle="Manage client testimonials and program reviews"
        actions={
          <Button
            variant="dark-navy"
            text="Add Feedback"
            icon={<Plus size={15} />}
            onClick={() => navigate(`${BASE}/create`)}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={MessageSquare} label="Total Feedbacks" value={count} />
        <StatCard icon={Star}          label="Avg Rating"      value={avgRating} accent />
      </div>

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
            placeholder="Search by name, email..."
            className="flex-1 max-w-xs"
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
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} /> Clear all
            </button>
          )}
          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{feedbacks.length}</span>{" "}
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
                  <button type="button" onClick={clearAllFilters} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition">
                    <X size={12} /> Clear all
                  </button>
                )}
              </div>
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{feedbacks.length}</span>{" "}
                  of <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching feedbacks..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : feedbacks.length === 0 ? (
              <EmptyState
                icon={<MessageSquare />}
                title="No feedbacks found"
                description="No feedbacks match your search. Try adjusting filters or add a new feedback."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Client",   icon: <User      size={13} /> },
                        { label: "Email",    icon: <Mail      size={13} /> },
                        { label: "Program",  icon: <Briefcase size={13} /> },
                        { label: "Rating",   icon: <Star      size={13} /> },
                        { label: "Position", icon: <Briefcase size={13} /> },
                        { label: "Date",     icon: null },
                        { label: "Actions",  icon: null },
                      ].map(({ label, icon }) => (
                        <th key={label} className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                          <span className="flex items-center gap-1.5">{icon}{label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {feedbacks.map((fb) => (
                      <tr
                        key={fb.uid}
                        onClick={() => navigate(`${BASE}/${fb.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {fb.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate max-w-[160px]" title={fb.name}>{fb.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 truncate max-w-[180px]">{fb.email}</td>
                        <td className="px-5 py-3.5">
                          {fb.program
                            ? <span className="text-navy-700 font-medium truncate max-w-[160px] block" title={fb.program.name}>{fb.program.name}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5"><StarDisplay rating={fb.rating} /></td>
                        <td className="px-5 py-3.5 text-slate-500 truncate max-w-[140px]">
                          {fb.position || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{formatDate(fb.created_at)}</td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`${BASE}/${fb.uid}/edit`)} className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition" title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteTarget(fb)} className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Delete">
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
                  <PrevButton text="Previous" disabled={!params.page || params.page <= 1} onClick={() => setParams({ page: (params.page ?? 1) - 1 })} />
                  <NextButton text="Next" disabled={(params.page ?? 1) >= totalPages} onClick={() => setParams({ page: (params.page ?? 1) + 1 })} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Feedback"
        message={<>Are you sure you want to delete the feedback from{" "}<span className="font-semibold text-navy-800">{deleteTarget?.name}</span>? This action cannot be undone.</>}
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

export default ManagerFeedbacksPage;
