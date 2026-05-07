// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen, Pencil, Trash2, RefreshCw, AlertTriangle,
  Layers, ToggleLeft, Settings, ArrowLeft, Plus,
} from "lucide-react";
import useGetCategory from "hooks/categories/useGetCategory";
import useCategoryFields from "hooks/categories/useCategoryFields";
import useDeleteField from "hooks/fields/useDeleteField";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
import IconButton from "components/ui/buttons/IconButton";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import SearchInput from "components/form/SearchInput";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import type { Field } from "types/field";

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

const CategoryDetailPage = () => {
  const { uid }      = useParams<{ uid: string }>();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const { category, loading: loadingCat, error: catError } = useGetCategory(uid);
  const {
    fields, count, loading: loadingFields, error: fieldsError,
    params, setParams, refetch,
  } = useCategoryFields(uid);
  const { deleteField, loading: deleting } = useDeleteField();

  const [deleteTarget, setDeleteTarget] = useState<Field | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteField(deleteTarget.uid);
    if (ok) {
      addToast(`"${deleteTarget.name}" has been deleted`, "success");
      setDeleteTarget(null);
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  const activeCount   = fields.filter((f) => f.is_active).length;
  const programsTotal = fields.reduce((sum, f) => sum + (f.program_count ?? 0), 0);

  return (
    <>
      {/* Back + header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="p-2 rounded-md lg:rounded-lg border border-slate-200 text-slate-400 hover:text-navy-700 hover:border-slate-300 transition"
        >
          <ArrowLeft size={15} />
        </button>

        {loadingCat ? (
          <div className="h-6 w-48 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0">
              <BookOpen size={16} className="text-navy-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-navy-800 truncate">
                {category?.name ?? "Category"}
              </h1>
              {category?.summary && (
                <p className="text-xs text-slate-400 truncate">{category.summary}</p>
              )}
            </div>
          </div>
        )}

        {!loadingCat && (
          <Button
            variant="dark-navy"
            text="Edit Category"
            icon={<Pencil size={14} />}
            onClick={() => navigate(`/admin/categories/${uid}/edit`)}
          />
        )}
      </div>

      {catError && (
        <div className="mb-4 flex items-center justify-center p-5 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-500">{catError}</p>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Layers}     label="Total Fields"   value={count}        />
        <StatCard icon={ToggleLeft} label="Active Fields"  value={activeCount}  accent />
        <StatCard icon={BookOpen}   label="Total Programs" value={programsTotal} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search fields..."
            className="flex-1 max-w-xs"
          />

          <div className="flex-1" />

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

          {!loadingFields && (
            <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{fields.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}

          <Button
            variant="dark-navy"
            text="Add Field"
            icon={<Plus size={14} />}
            onClick={() => navigate(`/admin/fields/create?category=${uid}`)}
          />
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <PageHeader
          title="Fields"
          subtitle={`Training fields in ${category?.name ?? "this category"}`}
          bordered
          className="px-4 sm:px-6"
        />

        <div className="p-4 sm:p-6 pt-4">
          <div className="rounded-xl border border-slate-100 overflow-hidden">

            {loadingFields ? (
              <Loading text="Fetching fields..." />
            ) : fieldsError ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{fieldsError}</div>
            ) : fields.length === 0 ? (
              <EmptyState
                icon={<Layers size={28} />}
                title="No fields found"
                description="Add a field to get started with this category."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Name",     icon: <Layers    size={13} /> },
                        { label: "Status",   icon: <ToggleLeft size={13} /> },
                        { label: "Programs", icon: <BookOpen  size={13} /> },
                        { label: "Trainers", icon: <Settings  size={13} /> },
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
                    {fields.map((field) => (
                      <tr
                        key={field.uid}
                        onClick={() => navigate(`/admin/fields/${field.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm"
                              style={{ backgroundColor: field.hex_color || "#cbd5e1" }}
                            />
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              {field.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate" title={field.name}>
                              {field.name}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                            field.is_active
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${field.is_active ? "bg-green-500" : "bg-slate-300"}`} />
                            {field.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Programs */}
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-50 text-navy-700 border border-navy-100">
                            {field.program_count ?? 0}
                          </span>
                        </td>

                        {/* Trainers */}
                        <td className="px-5 py-3.5 text-slate-500 text-xs">
                          {field.trainers?.length > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gold-50 text-gold-600 border border-gold-200">
                              {field.trainers.length}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/fields/${field.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(field)}
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
        title="Delete Field"
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

export default CategoryDetailPage;
