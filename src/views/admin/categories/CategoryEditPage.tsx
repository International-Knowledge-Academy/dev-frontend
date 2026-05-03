// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetCategory from "hooks/categories/useGetCategory";
import useUpdateCategory from "hooks/categories/useUpdateCategory";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import Button from "components/ui/buttons/Button";

const CategoryEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { category, loading: loadingCategory, error: loadError } = useGetCategory(uid);
  const { updateCategory, loading: updating, error, fieldErrors } = useUpdateCategory();

  const [form, setForm] = useState({ name: "", summary: "" });

  useEffect(() => {
    if (category) setForm({ name: category.name, summary: category.summary ?? "" });
  }, [category]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateCategory(uid, form);
    if (updated) {
      addToast("Category updated successfully", "success");
      navigate("/admin/categories");
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading category...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Edit Category</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Updating <span className="font-semibold text-navy-700">{category?.name}</span>
          </p>
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
              textColor="text-slate-600"
              borderColor="border-slate-200"
              hoverBgColor="hover:bg-slate-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating || !form.name.trim()}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditPage;
