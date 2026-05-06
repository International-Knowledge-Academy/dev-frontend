// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useCreatePayment from "hooks/payments/useCreatePayment";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import SearchableDropdown from "components/form/search/SearchableDropdown";

const SPONSORSHIP_OPTIONS = [
  { value: "self_funded",       label: "Self Funded"  },
  { value: "company_sponsored", label: "Company Sponsored" },
  { value: "government_funded", label: "Government Funded" },
  { value: "scholarship",       label: "Scholarship"  },
];

const METHOD_OPTIONS = [
  { value: "cash",          label: "Cash"          },
  { value: "bank_transfer", label: "Bank Transfer"  },
  { value: "credit_card",   label: "Credit Card"    },
  { value: "cheque",        label: "Cheque"         },
  { value: "online",        label: "Online"         },
];

const PaymentCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createPayment, loading, error, fieldErrors } = useCreatePayment();

  const [form, setForm] = useState({
    registration:     "",
    sponsorship_type: "self_funded",
    amount:           "",
    payment_method:   "cash",
    proof:            "",
    cancelled_reason: "",
  });

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isValid =
    form.registration.trim() !== "" &&
    form.amount.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      registration: Number(form.registration),
      proof: form.proof || null,
      cancelled_reason: form.cancelled_reason || undefined,
    };
    const created = await createPayment(payload);
    if (created) {
      addToast("Payment created successfully", "success");
      navigate("/admin/payments");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="New Payment"
          subtitle="Record a new payment for a registration"
          bordered
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
            Payment Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Registration ID"
              field="registration"
              type="number"
              placeholder="e.g. 5"
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField
              label="Amount"
              field="amount"
              placeholder="e.g. 1500.00"
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <SearchableDropdown
              label="Payment Method"
              field="payment_method"
              options={METHOD_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
              placeholder="Select method..."
            />
            <SearchableDropdown
              label="Sponsorship Type"
              field="sponsorship_type"
              options={SPONSORSHIP_OPTIONS}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
              placeholder="Select sponsorship..."
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mt-2">
            Optional
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Proof URL"
              field="proof"
              placeholder="https://..."
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
            <InputField
              label="Cancellation Reason"
              field="cancelled_reason"
              placeholder="If applicable..."
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/payments")}
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
              text={loading ? "Creating..." : "Create Payment"}
              disabled={loading || !isValid}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentCreatePage;
