// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateCategory from "hooks/categories/useCreateCategory";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import ToggleInput from "components/form/toggle/ToggleInput";

const TYPE_OPTIONS = [
  { value: "training",            label: "Training & Development" },
  { value: "international_youth", label: "International & Youth Programs" },
  { value: "research",            label: "Research & Knowledge Services" },
];

const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createCategory, loading, error, fieldErrors } = useCreateCategory();

  const [form, setForm] = useState({
    name:          "",
    description:   "",
    type:          "training",
    display_order: 0,
    is_active:     true,
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createCategory({
      ...form,
      display_order: Number(form.display_order),
    });
    if (created) {
      addToast("Category created successfully", "success");
      navigate("/admin/categories");
    }
  };

  return (
    <div className="">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
          <h1 className="text-base font-bold text-navy-800 dark:text-white">Create Category</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new educational category</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-2 gap-4">
          {error && (
            <div className="col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <InputField
            label="Category Name"
            field="name"
            placeholder="e.g. Leadership Training"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <SelectField
            label="Type"
            field="type"
            options={TYPE_OPTIONS}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="col-span-2">
            <InputField
              label="Description"
              field="description"
              placeholder="Brief description of this category"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <InputField
            label="Display Order"
            field="display_order"
            type="number"
            placeholder="0"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="col-span-2">
            <ToggleInput
              label="Active"
              field="is_active"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Actions */}
          <div className="col-span-2 flex gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreatePage;
