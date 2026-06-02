// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag, Plus, RefreshCw, Pencil, Trash2, AlertTriangle, AlignLeft,
} from "lucide-react";
import useCategories from "hooks/categories/useCategories";
import useDeleteCategory from "hooks/categories/useDeleteCategory";
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
import type { Category } from "types/category";

/* ─── Stat card ─────────────────────────────────────────────────────────── */

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

/* ─── Main page ─────────────────────────────────────────────────────────── */

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { categories, count, loading, error, params, setParams, refetch } = useCategories();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteCategory(deleteTarget.uid);
    if (ok) {
      addToast(`"${deleteTarget.name}" has been deleted`, "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete category. Please try again.", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      {/* Page header */}
      <PageHeader
        title="Categories"
        subtitle="Manage your training categories"
        actions={
          <Button
            variant="dark-navy"
            text="Add Category"
            icon={<Plus size={15} />}
            onClick={() => navigate("/account-manager/categories/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Tag} label="Total Categories" value={count} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search categories..."
            className="flex-1 max-w-xs"
          />

          <div className="w-px h-5 bg-slate-200" />

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

          <div className="flex-1" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{categories.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching categories..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : categories.length === 0 ? (
              <EmptyState
                icon={<Tag />}
                title="No categories found"
                description="No categories match your search. Try adjusting it or add a new category."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Category", icon: <Tag       size={13} /> },
                        { label: "Summary",  icon: <AlignLeft size={13} /> },
                        { label: "Actions",  icon: null },
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
                    {categories.map((cat) => (
                      <tr
                        key={cat.uid}
                        onClick={() => navigate(`/account-manager/categories/${cat.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {cat.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate" title={cat.name}>
                              {cat.name}
                            </span>
                          </div>
                        </td>

                        {/* Summary */}
                        <td className="px-5 py-3.5 max-w-xs">
                          <span className="text-slate-500 truncate block" title={cat.summary ?? ""}>
                            {cat.summary || <span className="text-slate-300 italic">—</span>}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/account-manager/categories/${cat.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(cat)}
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
        title="Delete Category"
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

export default CategoriesPage;
