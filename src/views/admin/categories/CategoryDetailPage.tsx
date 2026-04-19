// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdCategory } from "react-icons/md";
import useGetCategory from "hooks/categories/useGetCategory";

const CategoryDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { category, loading, error } = useGetCategory(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading category...
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Category not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdCategory size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate">{category.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{category.uid}</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5">
          <p className="text-xs text-gray-400 mb-1">Category Name</p>
          <p className="text-sm font-medium text-navy-800 truncate">{category.name}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="flex-1 rounded-md lg:rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/categories/${uid}/edit`)}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit Category
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryDetailPage;
