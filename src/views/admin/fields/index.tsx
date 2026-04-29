// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdEdit, MdDelete, MdRefresh,
  MdLayers, MdSettings, MdToggleOn, MdWarning,
} from "react-icons/md";
import useFields from "hooks/fields/useFields";
import useDeleteField from "hooks/fields/useDeleteField";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import type { Field } from "types/field";

const FieldsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { fields, count, loading, error, params, setParams, refetch } = useFields();
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

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 max-w-5xl mx-auto">

        <div className="pt-5 px-4 sm:px-6 pb-1 space-y-3">

          {/* Row 1: Search */}
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search fields..."
          />

          {/* Row 2: Filters + Add + Count */}
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelectField
              value={params.is_active === undefined ? "all" : String(params.is_active)}
              onChange={(val) => setParams({ is_active: val === "all" ? undefined : val === "true" })}
              icon={MdToggleOn}
              defaultOption="All"
              options={[
                { value: "true",  label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
            />
            <IconButton
              onClick={refetch}
              icon={<MdRefresh size={18} />}
              bgColor="bg-white"
              textColor="text-gray-500"
              borderColor="border-slate-200"
              hoverTextColor="hover:text-gray-700"
              hoverBorderColor="hover:border-slate-300"
              className="p-2.5"
            />
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="dark-navy"
                text="Add Field"
                icon={<MdAdd />}
                onClick={() => navigate("/admin/fields/create")}
              />
              <span className="text-sm text-gray-400 whitespace-nowrap">{count} fields</span>
            </div>
          </div>

        </div>

        <Divider />

        {/* Table */}
        <div className="pb-5 px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <Loading text="Fetching fields..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : fields.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-sm text-gray-400">No fields found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {[
                        { label: "Name",     icon: <MdLayers   size={14} /> },
                        { label: "Category", icon: <MdLayers   size={14} /> },
                        { label: "Status",   icon: <MdToggleOn size={14} /> },
                        { label: "Programs", icon: <MdLayers   size={14} /> },
                        { label: "Actions",  icon: <MdSettings size={14} /> },
                      ].map(({ label, icon }) => (
                        <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                          <span className="flex items-center gap-1.5">{icon}{label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fields.map((field) => (
                      <tr
                        key={field.uid}
                        onClick={() => navigate(`/admin/fields/${field.uid}`)}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm"
                              style={{ backgroundColor: field.hex_color || "#cbd5e1" }}
                            />
                            <span className="font-medium text-navy-800 truncate" title={field.name}>{field.name}</span>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-5 py-3.5 text-gray-500 truncate" title={field.category?.name}>
                          {field.category?.name ?? <span className="text-gray-300 italic">—</span>}
                        </td>
                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            field.is_active
                              ? "bg-green-50 text-green-600 border-green-600"
                              : "bg-red-50 text-red-500 border-red-500"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${field.is_active ? "bg-green-500" : "bg-red-400"}`} />
                            {field.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {/* Programs */}
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700">
                            {field.program_count ?? 0}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/fields/${field.uid}/edit`)}
                              className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <MdEdit size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(field)}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <MdDelete size={16} />
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
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-100">
                <p className="text-xs text-gray-400">
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
        icon={<MdWarning size={20} className="text-red-500" />}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default FieldsPage;
