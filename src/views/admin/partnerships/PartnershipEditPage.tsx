// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import usePartnership from "hooks/partnerships/usePartnership";
import useUpdatePartnership from "hooks/partnerships/useUpdatePartnership";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField } from "components/form";
import MediaUploadField from "components/form/filesUpload/MediaUploadField";
import Button from "components/ui/buttons/Button";
import type { PresignedUploadResult } from "hooks/storage/usePresignedUpload";

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

  const [form, setForm] = useState({
    name:             "",
    partnership_type: "",
    website_url:      "",
  });
  const [logoKey, setLogoKey] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (partnership) {
      setForm({
        name:             partnership.name             ?? "",
        partnership_type: partnership.partnership_type ?? "",
        website_url:      partnership.website_url      ?? "",
      });
      setLogoUrl(partnership.logo?.public_url ?? "");
    }
  }, [partnership]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleLogoChange = (result: PresignedUploadResult | null) => {
    if (result) {
      setLogoKey(result.file_key);
      setLogoUrl(result.public_url);
    } else {
      setLogoKey("");
      setLogoUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = {
      name:             form.name,
      partnership_type: form.partnership_type,
      website_url:      form.website_url || undefined,
    };
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

          <MediaUploadField
            label="Logo"
            type="image"
            folder="partnerships/logos"
            displayUrl={logoUrl}
            onChange={handleLogoChange}
            error={fieldErrors?.logo}
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
              disabled={updating}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnershipEditPage;
