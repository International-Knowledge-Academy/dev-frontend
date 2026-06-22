// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { useToast } from "context/ToastContext";
import useGetCamp from "hooks/camps/useGetCamp";
import useUpdateCamp from "hooks/camps/useUpdateCamp";
import useCampBrochure from "hooks/camps/useCampBrochure";
import useAllLocations from "hooks/locations/useAllLocations";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableSelect from "components/form/SearchableSelect";
import Button from "components/ui/buttons/Button";
import Loading from "components/loading/Loading";

const STATUS_OPTIONS = [
  { value: "upcoming",  label: "Upcoming" },
  { value: "open",      label: "Open for Registration" },
  { value: "closed",    label: "Closed for Registration" },
  { value: "completed", label: "Completed" },
];

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
    {children}
  </p>
);

const CampEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { camp, loading: loadingCamp, error: loadError } = useGetCamp(uid);
  const { updateCamp, loading: updating, error } = useUpdateCamp();
  const { locations } = useAllLocations();
  const locationOptions = locations.map((l) => ({ value: l.name, label: l.name }));
  const {
    hasBrochure, fileName: brochureFileName, downloadUrl,
    loading: brochureLoading, uploading, progress,
    upload, update: updateBrochure, remove,
  } = useCampBrochure(uid);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name:        "",
    status:      "upcoming",
    description: "",
    highlights:  "",
    location:    "",
    start_date:  "",
    end_date:    "",
    deadline:    "",
    capacity:    "",
    camp_fee:    "",
    min_age:     "",
    max_age:     "",
  });

  useEffect(() => {
    if (camp) {
      setForm({
        name:        camp.name        ?? "",
        status:      camp.status      ?? "upcoming",
        description: camp.description ?? "",
        highlights:  camp.highlights  ?? "",
        location:    camp.location    ?? "",
        start_date:  camp.start_date  ?? "",
        end_date:    camp.end_date    ?? "",
        deadline:    camp.deadline    ?? "",
        capacity:    camp.capacity    != null ? String(camp.capacity) : "",
        camp_fee:    camp.camp_fee    ?? "",
        min_age:     camp.min_age     != null ? String(camp.min_age)  : "",
        max_age:     camp.max_age     != null ? String(camp.max_age)  : "",
      });
    }
  }, [camp]);

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleBrochureFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const ok = hasBrochure ? await updateBrochure(file) : await upload(file);
    if (ok) addToast("Brochure saved.", "success");
    else    addToast("Failed to save brochure.", "error");
  };

  const handleRemove = async () => {
    const ok = await remove();
    if (ok) addToast("Brochure removed.", "success");
    else    addToast("Failed to remove brochure.", "error");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = { name: form.name.trim(), status: form.status };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.highlights.trim())  payload.highlights  = form.highlights.trim();
    if (form.location)           payload.location    = form.location;
    if (form.start_date)         payload.start_date  = form.start_date;
    if (form.end_date)           payload.end_date    = form.end_date;
    if (form.deadline)           payload.deadline    = form.deadline;
    if (form.capacity)           payload.capacity    = Number(form.capacity);
    if (form.camp_fee.trim())    payload.camp_fee    = form.camp_fee.trim();
    if (form.min_age)            payload.min_age     = Number(form.min_age);
    if (form.max_age)            payload.max_age     = Number(form.max_age);

    const updated = await updateCamp(uid, payload);
    if (updated) {
      addToast("Club updated successfully.", "success");
      navigate(`/account-manager/clubs/${uid}`);
    } else {
      addToast(error ?? "Failed to save changes.", "error");
    }
  };

  if (loadingCamp) return <Loading text="Loading club..." />;
  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Club"
          subtitle={<>Update the details for <span className="font-semibold text-navy-700">{camp?.name}</span></>}
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <SectionLabel>Basic Info</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Club Name"
              field="name"
              required
              placeholder="Summer Sports Camp 2025"
              formData={form}
              errors={{}}
              updateFormData={update}
            />
            <SearchableSelect
              label="Status"
              field="status"
              required
              options={STATUS_OPTIONS}
              formData={form}
              errors={{}}
              updateFormData={update}
              placeholder="Select status..."
            />
          </div>

          {/* Description */}
          <SectionLabel>Description</SectionLabel>
          <TextareaField
            label="Description"
            field="description"
            required={false}
            rows={3}
            placeholder="Describe the club program..."
            formData={form}
            errors={{}}
            updateFormData={update}
          />
          <TextareaField
            label="Highlights"
            field="highlights"
            required={false}
            rows={3}
            placeholder="Key highlights or activities..."
            formData={form}
            errors={{}}
            updateFormData={update}
          />

          {/* Schedule */}
          <SectionLabel>Schedule</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Start Date" field="start_date" type="date" required={false} formData={form} errors={{}} updateFormData={update} />
            <InputField label="End Date"   field="end_date"   type="date" required={false} formData={form} errors={{}} updateFormData={update} />
            <InputField label="Deadline"   field="deadline"   type="date" required={false} formData={form} errors={{}} updateFormData={update} />
          </div>

          {/* Details */}
          <SectionLabel>Details</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect label="Location" field="location" required={false} options={locationOptions} formData={form} errors={{}} updateFormData={update} placeholder="Select location..." />
            <InputField label="Capacity"  field="capacity" type="number" required={false} placeholder="50" formData={form} errors={{}} updateFormData={update} />
            <InputField label="Camp Fee"  field="camp_fee" required={false} placeholder="30.00" formData={form} errors={{}} updateFormData={update} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Minimum Age" field="min_age" type="number" required={false} placeholder="6"  formData={form} errors={{}} updateFormData={update} />
            <InputField label="Maximum Age" field="max_age" type="number" required={false} placeholder="16" formData={form} errors={{}} updateFormData={update} />
          </div>

          {/* Brochure */}
          <SectionLabel>Brochure</SectionLabel>
          <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleBrochureFile} />
          <div className="border border-slate-200 rounded-lg p-4">
            {uploading ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-navy-700">Uploading...</span>
                  <span className="text-xs font-semibold text-navy-600">{progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-gold-600" />
                  </div>
                  <div className="min-w-0">
                    {brochureLoading ? (
                      <p className="text-xs text-slate-400">Loading...</p>
                    ) : hasBrochure ? (
                      <p className="text-xs text-slate-600 truncate max-w-[220px]">{brochureFileName ?? "brochure.pdf"}</p>
                    ) : (
                      <p className="text-xs text-slate-400">No brochure uploaded yet</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg text-xs font-semibold bg-navy-700 text-white hover:bg-navy-800 transition"
                  >
                    <Upload size={12} /> {hasBrochure ? "Replace" : "Upload PDF"}
                  </button>
                  {hasBrochure && (
                    <>
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md lg:rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-700 transition"
                      >
                        <Download size={12} /> Download
                      </a>
                      <button
                        type="button"
                        onClick={handleRemove}
                        disabled={brochureLoading}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md lg:rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 transition"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/account-manager/clubs/${uid}`)}
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
              disabled={updating}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampEditPage;
