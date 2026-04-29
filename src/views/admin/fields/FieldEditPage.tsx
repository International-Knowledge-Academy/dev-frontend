// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetField from "hooks/fields/useGetField";
import useUpdateField from "hooks/fields/useUpdateField";
import useCategories from "hooks/categories/useCategories";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";
import MediaUploadField from "components/form/filesUpload/MediaUploadField";

const FieldEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { field, loading: loadingField, error: loadError } = useGetField(uid);
  const { updateField, loading: updating, error, fieldErrors } = useUpdateField();
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

  useEffect(() => {
    if (field) {
      setForm({
        name:         field.name ?? "",
        description:  field.description ?? "",
        category_uid: field.category?.uid ?? "",
        hex_color:    field.hex_color ?? "#000000",
        text_color:   field.text_color ?? "#ffffff",
        thumbnail:    field.thumbnail ?? "",
        video:        field.video ?? "",
        is_active:    field.is_active ?? true,
      });
    }
  }, [field]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const inputCls = (key: string) =>
    `w-full rounded-md lg:rounded-lg border px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300 ${
      fieldErrors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = { name: form.name, is_active: form.is_active };
    if (form.description !== undefined) payload.description  = form.description;
    if (form.category_uid)              payload.category_uid = form.category_uid;
    if (form.hex_color)                 payload.hex_color    = form.hex_color;
    if (form.text_color)                payload.text_color   = form.text_color;
    if (form.thumbnail !== undefined)   payload.thumbnail    = form.thumbnail;
    if (form.video !== undefined)       payload.video        = form.video;

    const updated = await updateField(uid, payload);
    if (updated) {
      addToast("Field updated successfully", "success");
      navigate("/admin/fields");
    }
  };

  if (loadingField) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading field...
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-base font-bold text-navy-800">Edit Field</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Updating <span className="font-semibold text-navy-700">{field?.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

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
            <label className="block text-sm font-medium text-navy-800 mb-2">
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
            <label className="block text-sm font-medium text-navy-800 mb-2">
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

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.hex_color}
                  onChange={(e) => updateFormData("hex_color", e.target.value)}
                  className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-gray-50 flex-shrink-0"
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

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.text_color}
                  onChange={(e) => updateFormData("text_color", e.target.value)}
                  className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-gray-50 flex-shrink-0"
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
          </div>

          <MediaUploadField
            label="Thumbnail"
            type="image"
            folder="fields/thumbnails"
            value={form.thumbnail}
            onChange={(url) => updateFormData("thumbnail", url)}
            error={fieldErrors.thumbnail}
          />

          <MediaUploadField
            label="Video"
            type="video"
            folder="fields/videos"
            value={form.video}
            onChange={(url) => updateFormData("video", url)}
            error={fieldErrors.video}
          />

          <ToggleInput
            label="Active"
            field="is_active"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/fields")}
              className="flex-1 py-2.5"
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
              disabled={updating || !form.name.trim()}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldEditPage;
