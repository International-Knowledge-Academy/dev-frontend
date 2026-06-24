// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useGetCampRegistration from "hooks/campRegistrations/useGetCampRegistration";
import useUpdateCampRegistration from "hooks/campRegistrations/useUpdateCampRegistration";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import TextareaField from "components/form/TextareaField";
import SearchableSelect from "components/form/SearchableSelect";
import Button from "components/ui/buttons/Button";
import Loading from "components/loading/Loading";
import { GULF_COUNTRIES, HEAR_ABOUT_US_OPTIONS } from "constants/lists";

const NATIONALITY_OPTIONS = GULF_COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

const TYPE_OPTIONS = [
  { value: "self",  label: "Self"  },
  { value: "child", label: "Child" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "father",   label: "Father"   },
  { value: "mother",   label: "Mother"   },
  { value: "guardian", label: "Guardian" },
  { value: "other",    label: "Other"    },
];

const HEAR_OPTIONS = HEAR_ABOUT_US_OPTIONS.map((o) => ({ value: o.code, label: o.name }));

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
    {children}
  </p>
);

const CampRegistrationEditPage = () => {
  const { uid }        = useParams<{ uid: string }>();
  const navigate       = useNavigate();
  const { addToast }   = useToast();

  const { registration, loading: loadingReg, error: loadError } = useGetCampRegistration(uid);
  const { updateCampRegistration, loading: saving, error, fieldErrors } = useUpdateCampRegistration();

  const [form, setForm] = useState({
    registration_type:         "self",
    first_name:                "",
    last_name:                 "",
    dob:                       "",
    nationality:               "",
    passport_no:               "",
    participant_whatsapp:      "",
    participant_email:         "",
    guardian_full_name:        "",
    guardian_relationship:     "",
    guardian_whatsapp:         "",
    guardian_email:            "",
    health_notes:              "",
    how_did_you_hear_about_us: "",
    referral_source:           "",
    referred_by_code:          "",
  });

  useEffect(() => {
    if (!registration) return;
    const p = registration.participant;
    const g = registration.guardian;
    setForm({
      registration_type:         registration.registration_type          ?? "self",
      first_name:                p?.first_name                           ?? "",
      last_name:                 p?.last_name                            ?? "",
      dob:                       p?.dob                                  ?? "",
      nationality:               p?.nationality                          ?? "",
      passport_no:               p?.passport_no                          ?? "",
      participant_whatsapp:      p?.whatsapp                             ?? "",
      participant_email:         p?.email                                ?? "",
      guardian_full_name:        g?.full_name                            ?? "",
      guardian_relationship:     g?.relationship                         ?? "",
      guardian_whatsapp:         g?.whatsapp                             ?? "",
      guardian_email:            g?.email                                ?? "",
      health_notes:              registration.health_notes               ?? "",
      how_did_you_hear_about_us: registration.how_did_you_hear_about_us  ?? "",
      referral_source:           registration.referral_source            ?? "",
      referred_by_code:          registration.referred_by_code           ?? "",
    });
  }, [registration]);

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const isChild = form.registration_type === "child";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid) return;

    const payload: any = {
      registration_type: form.registration_type,
      participant: {
        first_name:  form.first_name,
        last_name:   form.last_name,
        dob:         form.dob,
        nationality: form.nationality,
        passport_no: form.passport_no,
        whatsapp:    form.participant_whatsapp,
        email:       form.participant_email,
      },
      health_notes:              form.health_notes              || undefined,
      how_did_you_hear_about_us: form.how_did_you_hear_about_us || undefined,
      referral_source:           form.referral_source           || undefined,
      referred_by_code:          form.referred_by_code          || undefined,
    };

    if (isChild) {
      payload.guardian = {
        full_name:    form.guardian_full_name,
        relationship: form.guardian_relationship,
        whatsapp:     form.guardian_whatsapp,
        email:        form.guardian_email,
      };
    }

    const result = await updateCampRegistration(uid, payload);
    if (result) {
      addToast("Registration updated.", "success");
      navigate(`/admin/club-registrations/${uid}`);
    }
  };

  if (loadingReg) return <Loading text="Loading registration..." />;
  if (loadError)  return <div className="flex items-center justify-center py-20 text-sm text-red-500">{loadError}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Registration"
          subtitle={
            <>Editing registration for{" "}
              <span className="font-semibold text-navy-700">
                {registration?.participant?.first_name} {registration?.participant?.last_name}
              </span>
            </>
          }
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Type */}
          <SectionLabel>Registration Type</SectionLabel>
          <SearchableSelect
            label="Type"
            field="registration_type"
            options={TYPE_OPTIONS}
            formData={form}
            errors={fieldErrors}
            updateFormData={update}
            placeholder="Select type..."
          />

          {/* Participant */}
          <SectionLabel>Participant Information</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="First Name"      field="first_name"           placeholder="Ahmad"              formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Last Name"       field="last_name"            placeholder="Al-Rashidi"         formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Date of Birth"   field="dob"        type="date"                               formData={form} errors={fieldErrors} updateFormData={update} />
            <SearchableSelect label="Nationality" field="nationality" options={NATIONALITY_OPTIONS} required formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select nationality..." />
            <InputField label="Passport Number" field="passport_no"          placeholder="A1234567"           formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="WhatsApp"        field="participant_whatsapp" placeholder="+966 50 000 0000"   formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Email"           field="participant_email"    type="email" placeholder="ahmad@example.com" formData={form} errors={fieldErrors} updateFormData={update} />
          </div>

          {/* Guardian (child only) */}
          {isChild && (
            <>
              <SectionLabel>Guardian Information</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name"   field="guardian_full_name"    placeholder="Mohammed Al-Rashidi" formData={form} errors={fieldErrors} updateFormData={update} />
                <SearchableSelect label="Relationship" field="guardian_relationship" options={RELATIONSHIP_OPTIONS} required formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select relationship..." />
                <InputField label="WhatsApp"    field="guardian_whatsapp"     placeholder="+966 50 000 0000"    formData={form} errors={fieldErrors} updateFormData={update} />
                <InputField label="Email"       field="guardian_email"        type="email" placeholder="guardian@example.com" formData={form} errors={fieldErrors} updateFormData={update} />
              </div>
            </>
          )}

          {/* Additional */}
          <SectionLabel>Additional Information</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect label="How Did You Hear About Us" field="how_did_you_hear_about_us" required={false} options={HEAR_OPTIONS} formData={form} errors={fieldErrors} updateFormData={update} placeholder="Select source..." />
            <InputField label="Referral Source" field="referral_source" required={false} placeholder="e.g. Instagram, friend, event..." formData={form} errors={fieldErrors} updateFormData={update} />
            <InputField label="Referral Code" field="referred_by_code" required={false} placeholder="CODE123" formData={form} errors={fieldErrors} updateFormData={update} />
          </div>
          <TextareaField label="Health Notes" field="health_notes" required={false} rows={3} placeholder="Any health conditions or notes..." formData={form} errors={fieldErrors} updateFormData={update} />

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/admin/club-registrations/${uid}`)}
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
              text={saving ? "Saving..." : "Save Changes"}
              disabled={saving}
              className="flex-1 py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampRegistrationEditPage;
