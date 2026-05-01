// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetField from "hooks/fields/useGetField";
import useUpdateField from "hooks/fields/useUpdateField";
import useAllCategories from "hooks/categories/useAllCategories";
import { getMediaUrl } from "types/field";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SelectField from "components/form/SelectField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";
import MediaUploadField from "components/form/filesUpload/MediaUploadField";

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{children}</p>
);

const FieldEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { field, loading: loadingField, error: loadError } = useGetField(uid);
  const { updateField, loading: updating, error, fieldErrors }  = useUpdateField();
  const { categories } = useAllCategories();

  const [form, setForm] = useState({
    name:         "",
    description:  "",
    category_uid: "",
    hex_color:    "#1e3a5f",
    text_color:   "#ffffff",
    thumbnail:    "",
    video:        "",
    is_active:    true,
  });

  useEffect(() => {
    if (field) {
      setForm({
        name:         field.name         ?? "",
        description:  field.description  ?? "",
        category_uid: field.category?.uid ?? "",
        hex_color:    field.hex_color    ?? "#1e3a5f",
        text_color:   field.text_color   ?? "#ffffff",
        thumbnail:    getMediaUrl(field.thumbnail),
        video:        getMediaUrl(field.video),
        is_active:    field.is_active    ?? true,
      });
    }
  }, [field]);

  const set = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = { name: form.name, is_active: form.is_active };
    if (form.description !== undefined) payload.description  = form.description;
    if (form.category_uid)              payload.category_uid = form.category_uid;
    if (form.hex_color)                 payload.hex_color    = form.hex_color;
    if (form.text_color)                payload.text_color   = form.text_color;
    payload.thumbnail = form.thumbnail || "";
    payload.video     = form.video     || "";

    const updated = await updateField(uid, payload);
    if (updated) {
      addToast("Field updated successfully", "success");
      navigate("/admin/fields");
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.uid, label: c.name }));

  if (loadingField) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading field...</div>;
  }

  if (loadError) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h1 className="text-base font-bold text-navy-800">Edit Field</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Updating <span className="font-semibold text-navy-700">{field?.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Basic info */}
          <div className="space-y-4">
            <SectionLabel>Basic Info</SectionLabel>
            <InputField
              label="Name"
              field="name"
              placeholder="e.g. Technology"
              formData={form}
              errors={fieldErrors}
              updateFormData={set}
            />
            <TextareaField
              label="Description"
              field="description"
              placeholder="Brief description of this field..."
              rows={3}
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={set}
            />
            <SelectField
              label="Category"
              field="category_uid"
              options={categoryOptions}
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={set}
            />
          </div>

          {/* Colors */}
          <div>
            <SectionLabel>Colors</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.hex_color}
                    onChange={(e) => set("hex_color", e.target.value)}
                    className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={form.hex_color}
                    onChange={(e) => set("hex_color", e.target.value)}
                    placeholder="#000000"
                    className="flex-1 rounded-md lg:rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300"
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
                    onChange={(e) => set("text_color", e.target.value)}
                    className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={form.text_color}
                    onChange={(e) => set("text_color", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 rounded-md lg:rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300"
                  />
                </div>
                {fieldErrors.text_color && <p className="mt-1 text-xs text-red-500">{fieldErrors.text_color}</p>}
              </div>
            </div>

            {/* Color preview */}
            <div
              className="mt-3 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-semibold transition"
              style={{ backgroundColor: form.hex_color, color: form.text_color }}
            >
              Preview: {form.name || "Field Name"}
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <SectionLabel>Media</SectionLabel>
            <MediaUploadField
              label="Thumbnail"
              type="image"
              folder="fields/thumbnails"
              value={form.thumbnail}
              onChange={(url) => set("thumbnail", url)}
              error={fieldErrors.thumbnail}
            />
            <MediaUploadField
              label="Video"
              type="video"
              folder="fields/videos"
              value={form.video}
              onChange={(url) => set("video", url)}
              error={fieldErrors.video}
            />
          </div>

          {/* Status */}
          <div>
            <SectionLabel>Status</SectionLabel>
            <ToggleInput
              label="Active"
              field="is_active"
              formData={form}
              errors={fieldErrors}
              updateFormData={set}
            />
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/fields")}
              className="flex-1 py-2.5"
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
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldEditPage;
