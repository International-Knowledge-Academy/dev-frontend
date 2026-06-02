// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useContact from "hooks/contact/useContact";
import useUpdateContact from "hooks/contact/useUpdateContact";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField, TextareaField } from "components/form";
import Button from "components/ui/buttons/Button";

const programTypeOptions = [
  { value: "course",     label: "Training Course (5 Days)"    },
  { value: "diploma",    label: "Training Diploma (10 Days)"  },
  { value: "contracted", label: "Contracted / Custom Program" },
];

const statusOptions = [
  { value: "pending",     label: "Pending"     },
  { value: "in_progress", label: "In Progress" },
  { value: "follow_up",   label: "Follow Up"   },
  { value: "resolved",    label: "Resolved"    },
  { value: "closed",      label: "Closed"      },
  { value: "spam",        label: "Spam"        },
];

const ContactEditPage = () => {
  const { uid }    = useParams<{ uid: string }>();
  const navigate   = useNavigate();
  const { addToast } = useToast();

  const { contact, loading: loadingContact, error: loadError } = useContact(uid);
  const { updateContact, loading: updating, error, fieldErrors } = useUpdateContact();

  const [form, setForm] = useState({
    full_name:        "",
    organization:     "",
    email:            "",
    phone_whatsapp:   "",
    program_category: "",
    program_type:     "",
    message:          "",
    status:           "pending",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        full_name:        contact.full_name        ?? "",
        organization:     contact.organization     ?? "",
        email:            contact.email            ?? "",
        phone_whatsapp:   contact.phone_whatsapp   ?? "",
        program_category: contact.program_category ?? "",
        program_type:     contact.program_type     ?? "",
        message:          contact.message          ?? "",
        status:           contact.status           ?? "pending",
      });
    }
  }, [contact]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateContact(uid, form);
    if (updated) {
      addToast("Contact updated successfully", "success");
      navigate(`/admin/contact/${uid}`);
    }
  };

  if (loadingContact) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading submission...
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
    <div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Contact"
          subtitle={
            <>
              Editing submission from{" "}
              <span className="font-semibold text-navy-700">{contact?.full_name}</span>
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

          {/* Row 1: Name + Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              field="full_name"
              placeholder="Full name"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Organization"
              field="organization"
              placeholder="Company or institution"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Row 2: Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Email Address"
              field="email"
              type="email"
              placeholder="you@example.com"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Phone / WhatsApp"
              field="phone_whatsapp"
              type="tel"
              placeholder="+1 234 567 890"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Row 3: Category + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Program Category"
              field="program_category"
              placeholder="e.g. Leadership"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <SelectField
              label="Program Type"
              field="program_type"
              options={programTypeOptions}
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          {/* Status */}
          <SelectField
            label="Status"
            field="status"
            options={statusOptions}
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Message */}
          <TextareaField
            label="Message"
            field="message"
            rows={5}
            placeholder="Message content..."
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/admin/contact/${uid}`)}
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

export default ContactEditPage;
