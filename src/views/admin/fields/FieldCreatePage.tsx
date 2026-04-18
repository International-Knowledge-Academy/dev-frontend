// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateField from "hooks/fields/useCreateField";
import useCategories from "hooks/categories/useCategories";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";

const FieldCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createField, loading, error, fieldErrors } = useCreateField();
  const { categories } = useCategories({ page: 1 });

  const [form, setForm] = useState({
    name:         "",
    description:  "",
    category_uid: "",
    hex_color:    "#000000",
    text_color:   "#ffffff",
    thumbnail:    "",
    video:        "",
    is_active:    true,
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const inputCls = (key: string) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300 dark:bg-navy-800 dark:text-white ${
      fieldErrors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      name:      form.name,
      is_active: form.is_active,
    };
    if (form.description)  payload.description  = form.description;
    if (form.category_uid) payload.category_uid = form.category_uid;
    if (form.hex_color)    payload.hex_color    = form.hex_color;
    if (form.text_color)   payload.text_color   = form.text_color;
    if (form.thumbnail)    payload.thumbnail    = form.thumbnail;
    if (form.video)        payload.video        = form.video;

    const created = await createField(payload);
    if (created) {
      addToast("Field created successfully", "success");
      navigate("/admin/fields");
    }
  };

  return (
    <div className="">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
          <h1 className="text-base font-bold text-navy-800 dark:text-white">Create Field</h1>
          <p className="text-xs text-gray-400 mt-0.5">Add a new field</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <InputField
            label="Name"
            field="name"
            placeholder="e.g. Technology"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Description */}
          <div>
            <label className="block text-p2 font-medium text-navy-900 mb-2">
              Description <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Brief description of this field..."
              rows={3}
              className={`${inputCls("description")} resize-none`}
            />
            {fieldErrors.description && <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-p2 font-medium text-navy-900 mb-2">
              Category <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <select
              value={form.category_uid}
              onChange={(e) => updateFormData("category_uid", e.target.value)}
              className={inputCls("category_uid")}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.uid} value={cat.uid}>{cat.name}</option>
              ))}
            </select>
            {fieldErrors.category_uid && <p className="mt-1 text-xs text-red-500">{fieldErrors.category_uid}</p>}
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-p2 font-medium text-navy-900 mb-2">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.hex_color}
                onChange={(e) => updateFormData("hex_color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-gray-50 flex-shrink-0"
              />
              <input
                type="text"
                value={form.hex_color}
                onChange={(e) => updateFormData("hex_color", e.target.value)}
                placeholder="#000000"
                className={inputCls("hex_color")}
              />
            </div>
            {fieldErrors.hex_color && <p className="mt-1 text-xs text-red-500">{fieldErrors.hex_color}</p>}
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-p2 font-medium text-navy-900 mb-2">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.text_color}
                onChange={(e) => updateFormData("text_color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-gray-50 flex-shrink-0"
              />
              <input
                type="text"
                value={form.text_color}
                onChange={(e) => updateFormData("text_color", e.target.value)}
                placeholder="#ffffff"
                className={inputCls("text_color")}
              />
            </div>
            {fieldErrors.text_color && <p className="mt-1 text-xs text-red-500">{fieldErrors.text_color}</p>}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-p2 font-medium text-navy-900 mb-2">
              Thumbnail URL <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.thumbnail}
              onChange={(e) => updateFormData("thumbnail", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputCls("thumbnail")}
            />
            {fieldErrors.thumbnail && <p className="mt-1 text-xs text-red-500">{fieldErrors.thumbnail}</p>}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-p2 font-medium text-navy-900 mb-2">
              Video URL <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.video}
              onChange={(e) => updateFormData("video", e.target.value)}
              placeholder="https://example.com/video.mp4"
              className={inputCls("video")}
            />
            {fieldErrors.video && <p className="mt-1 text-xs text-red-500">{fieldErrors.video}</p>}
          </div>

          {/* is_active toggle */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <span className="text-sm font-medium text-navy-700 dark:text-white">Active</span>
            <button
              type="button"
              onClick={() => updateFormData("is_active", !form.is_active)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-navy-700" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
            </button>
          </div>

          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/fields")}
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
              text={loading ? "Creating..." : "Create Field"}
              disabled={loading || !form.name.trim()}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldCreatePage;
