// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdEdit, MdDelete, MdRefresh, MdVisibility,
  MdCategory, MdSettings,
} from "react-icons/md";
import useCategories from "hooks/categories/useCategories";
import useDeleteCategory from "hooks/categories/useDeleteCategory";
import DeleteCategoryModal from "./components/DeleteCategoryModal";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import { useToast } from "context/ToastContext";
import type { Category } from "types/category";


const CategoriesPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { categories, count, loading, error, params, setParams, refetch } = useCategories();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const [deleteOpen, setDeleteOpen]         = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const openDelete = (category: Category) => { setSelectedCategory(category); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    const ok = await deleteCategory(selectedCategory.uid);
    if (ok) {
      setDeleteOpen(false);
      setSelectedCategory(null);
      addToast(`"${selectedCategory.name}" has been deleted`, "success");
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-100">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-5 px-6">
        <div className="flex items-center gap-3">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search categories..."
          />
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-gray-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-gray-700"
            hoverBorderColor="hover:border-slate-300"
            className="rounded-xl p-2.5"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="dark-navy"
            text="Add Category"
            icon={<MdAdd />}
            onClick={() => navigate("/admin/categories/create")}
          />
          <p className="text-sm text-gray-400 mt-0.5">{count} categories</p>
        </div>
      </div>

      <Divider />

      {/* Table */}
      <div className="pb-5 px-6">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:bg-navy-800 dark:border-navy-700">
          {loading ? (
            <Loading text="Fetching categories..." />
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">No categories found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-navy-700">
                    {[
                      { label: "Name",    icon: <MdCategory size={14} /> },
                      { label: "Actions", icon: <MdSettings size={14} /> },
                    ].map(({ label, icon }) => (
                      <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                        <span className="flex items-center gap-1.5">{icon}{label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-navy-700">
                  {categories.map((cat) => (
                    <tr key={cat.uid} className="hover:bg-gray-50 dark:hover:bg-navy-700 transition">
                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 flex-shrink-0">
                            <MdCategory size={16} />
                          </div>
                          <span className="font-medium text-navy-800 dark:text-white">{cat.name}</span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/categories/${cat.uid}`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-navy-700 transition"
                            title="View"
                          >
                            <MdVisibility size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/categories/${cat.uid}/edit`)}
                            className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
                            title="Edit"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(cat)}
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
            <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100">
              <p className="text-xs text-gray-400">
                Page {params.page ?? 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <PrevButton
                  text="Previous"
                  disabled={!params.page || params.page <= 1}
                  onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                  className="rounded-xl"
                />
                <NextButton
                  text="Next"
                  disabled={(params.page ?? 1) >= totalPages}
                  onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteCategoryModal
        open={deleteOpen}
        category={selectedCategory}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default CategoriesPage;
