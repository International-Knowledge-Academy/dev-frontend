// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateCategory from "hooks/categories/useCreateCategory";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import Button from "components/ui/buttons/Button";

const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createCategory, loading, error, fieldErrors } = useCreateCategory();

  const [form, setForm] = useState({ name: "", summary: "" });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createCategory(form);
    if (created) {
      addToast("Category created successfully", "success");
      navigate("/admin/categories");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Create Category</h1>
          <p className="text-xs text-gray-400 mt-0.5">Add a new category</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
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

          <TextareaField
            label="Summary"
            field="summary"
            placeholder="Brief description of this category..."
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/categories")}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-slate-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={loading ? "Creating..." : "Create Category"}
              disabled={loading || !form.name.trim()}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreatePage;
