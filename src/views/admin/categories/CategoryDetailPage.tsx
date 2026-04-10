// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdCategory, MdDescription, MdSchool,
  MdSettings, MdToggleOn, MdSortByAlpha,
} from "react-icons/md";
import useGetCategory from "hooks/categories/useGetCategory";

const typeLabel: Record<string, string> = {
  training:            "Training & Development",
  international_youth: "International & Youth",
  research:            "Research & Knowledge",
};

const typeBadgeClass: Record<string, string> = {
  training:            "bg-blue-50 text-blue-700 border-blue-200",
  international_youth: "bg-purple-50 text-purple-700 border-purple-200",
  research:            "bg-amber-50 text-amber-700 border-amber-200",
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-navy-700">
    <div className="w-9 h-9 rounded-xl bg-navy-50 dark:bg-navy-900 flex items-center justify-center text-navy-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 dark:text-white break-words">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6 mb-1 px-6">{title}</p>
);

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
    <div className="space-y-4">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-navy-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdCategory size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 dark:text-white leading-snug">{category.name}</h1>
            <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${typeBadgeClass[category.type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
              {typeLabel[category.type] ?? category.type_display ?? category.type}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 ${
            category.is_active
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-500 border-red-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${category.is_active ? "bg-green-500" : "bg-red-400"}`} />
            {category.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details */}
        <SectionTitle title="Details" />
        <div className="px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdCategory size={18} />}
            label="Name"
            value={category.name}
          />
          <InfoRow
            icon={<MdSettings size={18} />}
            label="Type"
            value={
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${typeBadgeClass[category.type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                {typeLabel[category.type] ?? category.type_display ?? category.type}
              </span>
            }
          />
          <InfoRow
            icon={<MdSortByAlpha size={18} />}
            label="Display Order"
            value={
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700 dark:bg-navy-700 dark:text-white">
                {category.display_order}
              </span>
            }
          />
          <InfoRow
            icon={<MdSchool size={18} />}
            label="Course Count"
            value={
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700 dark:bg-navy-700 dark:text-white">
                {category.course_count}
              </span>
            }
          />
          <InfoRow
            icon={<MdToggleOn size={18} />}
            label="Status"
            value={
              <span className={`font-semibold ${category.is_active ? "text-green-500" : "text-red-500"}`}>
                {category.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
        </div>

        {/* Description */}
        {category.description && (
          <>
            <SectionTitle title="Description" />
            <div className="px-6">
              <InfoRow
                icon={<MdDescription size={18} />}
                label="Description"
                value={<span className="whitespace-pre-wrap">{category.description}</span>}
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-navy-700 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/categories/${uid}/edit`)}
            className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
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
