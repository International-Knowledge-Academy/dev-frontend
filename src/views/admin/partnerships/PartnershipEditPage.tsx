// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import usePartnership from "hooks/partnerships/usePartnership";
import useUpdatePartnership from "hooks/partnerships/useUpdatePartnership";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField } from "components/form";
import ImageUploadField from "components/form/images/ImageUploadField";
import Button from "components/ui/buttons/Button";

const PARTNERSHIP_TYPE_OPTIONS = [
  { value: "certification", label: "Certification" },
  { value: "academic",      label: "Academic"      },
  { value: "corporate",     label: "Corporate"     },
  { value: "government",    label: "Government"    },
  { value: "technology",    label: "Technology"    },
  { value: "media",         label: "Media"         },
];

const PartnershipEditPage = () => {
  const { uid }    = useParams<{ uid: string }>();
  const navigate   = useNavigate();
  const { addToast } = useToast();

  const { partnership, loading: loadingPartnership, error: loadError } = usePartnership(uid);
  const { updatePartnership, loading: updating, error, fieldErrors } = useUpdatePartnership();
  const { upload, uploading, progress, reset: resetUpload } = usePresignedUpload();

  const [form, setForm] = useState({
    name:             "",
    partnership_type: "",
    website_url:      "",
  });
  const [logoFile,     setLogoFile]     = useState<File | null>(null);
  const [logoKey,      setLogoKey]      = useState<string | null>(null);
  const [existingUrl,  setExistingUrl]  = useState<string | null>(null);

  useEffect(() => {
    if (partnership) {
      setForm({
        name:             partnership.name             ?? "",
        partnership_type: partnership.partnership_type ?? "",
        website_url:      partnership.website_url      ?? "",
      });
      setExistingUrl(partnership.logo ?? null);
    }
  }, [partnership]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleLogoChange = async (file: File) => {
    setLogoFile(file);
    setExistingUrl(null);
    const result = await upload(file, { folder: "partnerships/logos", file_type: "image" });
    if (result) {
      setLogoKey(result.file_key);
      resetUpload();
    } else {
      setLogoFile(null);
      addToast("Failed to upload logo. Please try again.", "error");
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoKey(null);
  };

  const handleExistingRemove = () => {
    setExistingUrl(null);
    setLogoKey("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      name:             form.name,
      partnership_type: form.partnership_type,
      website_url:      form.website_url || undefined,
    };
    // Only include logo if it changed: new upload or explicitly cleared
    if (logoKey !== null) payload.logo = logoKey;

    const updated = await updatePartnership(uid, payload);
    if (updated) {
      addToast("Partnership updated successfully", "success");
      navigate(`/admin/partnerships/${uid}`);
    }
  };

  if (loadingPartnership) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading partnership...
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Partnership"
          subtitle={
            <>
              Editing{" "}
              <span className="font-semibold text-navy-700">{partnership?.name}</span>
            </>
          }
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Partnership Name"
              field="name"
              placeholder="Acme Corporation"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <SelectField
              label="Partnership Type"
              field="partnership_type"
              options={PARTNERSHIP_TYPE_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <InputField
            label="Website URL"
            field="website_url"
            type="url"
            placeholder="https://example.com"
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <ImageUploadField
            label="Logo"
            field="logo"
            imageOnly
            required={false}
            errors={fieldErrors}
            simpleFile={logoFile}
            onSimpleFileChange={handleLogoChange}
            onSimpleRemove={handleLogoRemove}
            simpleUploading={uploading}
            simpleProgress={progress}
            existingUrl={existingUrl}
            onExistingRemove={handleExistingRemove}
          />

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/admin/partnerships/${uid}`)}
              className="flex-1"
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
              disabled={updating || uploading}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnershipEditPage;
