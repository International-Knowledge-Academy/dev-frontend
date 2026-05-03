// @ts-nocheck
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import useCreateField from "hooks/fields/useCreateField";
import useUpdateField from "hooks/fields/useUpdateField";
import useCategories from "hooks/categories/useCategories";
import { useToast } from "context/ToastContext";
import MediaUploadField from "components/form/filesUpload/MediaUploadField";
import type { Field } from "types/field";

interface FieldFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  field?: Field | null;
}

const FieldFormModal = ({ open, onClose, onSuccess, field }: FieldFormModalProps) => {
  const isEdit = !!field;
  const { addToast } = useToast();

  const { createField, loading: creating, error: createError, fieldErrors: createFieldErrors } = useCreateField();
  const { updateField, loading: updating, error: updateError, fieldErrors: updateFieldErrors, reset } = useUpdateField();
  const { categories } = useCategories({ page: 1 });

  const loading     = isEdit ? updating  : creating;
  const error       = isEdit ? updateError : createError;
  const fieldErrors = isEdit ? updateFieldErrors : createFieldErrors;

  const defaultForm = {
    name:         "",
    description:  "",
    category_uid: "",
    hex_color:    "#000000",
    text_color:   "#ffffff",
    thumbnail:    "",
    video:        "",
    is_active:    true,
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) return;
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
    } else {
      setForm(defaultForm);
    }
    reset?.();
  }, [open, field]);

  if (!open) return null;

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const inputCls = (key: string) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-navy-800 outline-none transition focus:ring-2 focus:ring-navy-300 ${
      fieldErrors[key] ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"
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

    let result;
    if (isEdit) {
      result = await updateField(field.uid, payload);
    } else {
      result = await createField(payload);
    }

    if (result) {
      addToast(isEdit ? "Field updated successfully" : "Field created successfully", "success");
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-navy-800">
            {isEdit ? "Edit Field" : "Add Field"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <MdClose size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Technology"
              required
              className={inputCls("name")}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of this field..."
              rows={3}
              className={`${inputCls("description")} resize-none`}
            />
            {fieldErrors.description && <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Category</label>
            <select
              value={form.category_uid}
              onChange={(e) => set("category_uid", e.target.value)}
              className={inputCls("category_uid")}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.uid} value={cat.uid}>{cat.name}</option>
              ))}
            </select>
            {fieldErrors.category_uid && <p className="mt-1 text-xs text-red-500">{fieldErrors.category_uid}</p>}
          </div>

          {/* hex_color */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.hex_color}
                onChange={(e) => set("hex_color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-slate-50 flex-shrink-0"
              />
              <input
                type="text"
                value={form.hex_color}
                onChange={(e) => set("hex_color", e.target.value)}
                placeholder="#000000"
                className={inputCls("hex_color")}
              />
            </div>
            {fieldErrors.hex_color && <p className="mt-1 text-xs text-red-500">{fieldErrors.hex_color}</p>}
          </div>

          {/* text_color */}
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.text_color}
                onChange={(e) => set("text_color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-slate-50 flex-shrink-0"
              />
              <input
                type="text"
                value={form.text_color}
                onChange={(e) => set("text_color", e.target.value)}
                placeholder="#ffffff"
                className={inputCls("text_color")}
              />
            </div>
            {fieldErrors.text_color && <p className="mt-1 text-xs text-red-500">{fieldErrors.text_color}</p>}
          </div>

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

          {/* is_active toggle */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <span className="text-sm font-medium text-navy-700">Active</span>
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-navy-700" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldFormModal;
