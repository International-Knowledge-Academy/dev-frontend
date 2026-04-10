// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetCategory from "hooks/categories/useGetCategory";
import useUpdateCategory from "hooks/categories/useUpdateCategory";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import SelectField from "components/form/SelectField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";

const TYPE_OPTIONS = [
  { value: "training",            label: "Training & Development" },
  { value: "international_youth", label: "International & Youth Programs" },
  { value: "research",            label: "Research & Knowledge Services" },
];

const CategoryEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { category, loading: loadingCategory, error: loadError } = useGetCategory(uid);
  const { updateCategory, loading: updating, error, fieldErrors } = useUpdateCategory();

  const [form, setForm] = useState({
    name:          "",
    description:   "",
    type:          "training",
    display_order: 0,
    is_active:     true,
  });

  useEffect(() => {
    if (category) {
      setForm({
        name:          category.name,
        description:   category.description,
        type:          category.type,
        display_order: category.display_order,
        is_active:     category.is_active,
      });
    }
  }, [category]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateCategory(uid, {
      ...form,
      display_order: Number(form.display_order),
    });
    if (updated) {
      addToast("Category updated successfully", "success");
      navigate("/admin/categories");
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
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
    <div className="">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
          <h1 className="text-base font-bold text-navy-800 dark:text-white">Edit Category</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Updating{" "}
            <span className="font-semibold text-navy-700 dark:text-white">{category?.name}</span>
          </p>
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
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/categories")}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditPage;
