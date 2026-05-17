// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useGetPayment from "hooks/payments/useGetPayment";
import useUpdatePayment from "hooks/payments/useUpdatePayment";
import PageHeader from "components/ui/PageHeader";
import InputField from "components/form/InputField";
import Button from "components/ui/buttons/Button";
import SearchableDropdown from "components/form/search/SearchableDropdown";
import Loading from "components/loading/Loading";

const SPONSORSHIP_OPTIONS = [
  { value: "self_funded",       label: "Self Funded"      },
  { value: "company_sponsored", label: "Company Sponsored" },
  { value: "government_funded", label: "Government Funded" },
  { value: "scholarship",       label: "Scholarship"       },
];

const METHOD_OPTIONS = [
  { value: "cash",          label: "Cash"         },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card",   label: "Credit Card"   },
  { value: "cheque",        label: "Cheque"        },
  { value: "online",        label: "Online"        },
];

const PaymentEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const id = uid;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { payment, loading: loadingPayment, error: loadError } = useGetPayment(id);
  const { updatePayment, loading: updating, error, fieldErrors } = useUpdatePayment();

  const [form, setForm] = useState({
    sponsorship_type: "self_funded",
    amount:           "",
    payment_method:   "cash",
    proof:            "",
  });

  useEffect(() => {
    if (payment) {
      setForm({
        sponsorship_type: payment.sponsorship_type ?? "self_funded",
        amount:           payment.amount            ?? "",
        payment_method:   payment.payment_method    ?? "cash",
        proof:            payment.proof              ?? "",
      });
    }
  }, [payment]);

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      proof: form.proof || null,
    };
    const updated = await updatePayment(id, payload);
    if (updated) {
      addToast("Payment updated", "success");
      navigate(`/account-manager/payments/${id}`);
    }
  };

  if (loadingPayment) return <Loading text="Loading payment..." />;

  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <PageHeader
          title="Edit Payment"
          subtitle={<>Editing payment <span className="font-semibold text-navy-700">#{payment?.uid?.slice(0, 8)}</span></>}
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
            <InputField
              label="Proof URL"
              field="proof"
              placeholder="https://..."
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={update}
            />
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/account-manager/payments/${id}`)}
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

export default PaymentEditPage;
