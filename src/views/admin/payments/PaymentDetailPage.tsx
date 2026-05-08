// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil, CheckCircle, XCircle, CreditCard, DollarSign,
  CalendarDays, FileText, AlertTriangle, Loader2, ClipboardList,
} from "lucide-react";
import useGetPayment from "hooks/payments/useGetPayment";
import usePaymentActions from "hooks/payments/usePaymentActions";
import useDeletePayment from "hooks/payments/useDeletePayment";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const STATUS_COLORS = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  approved:  "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-slate-50 text-slate-400 border-slate-200",
  refunded:  "bg-red-50 text-red-500 border-red-200",
};

const DOT_COLORS = {
  pending:   "bg-amber-400",
  approved:  "bg-green-500",
  cancelled: "bg-slate-300",
  refunded:  "bg-red-400",
};

const METHOD_LABELS: Record<string, string> = {
  cash:          "Cash",
  bank_transfer: "Bank Transfer",
  credit_card:   "Credit Card",
  cheque:        "Cheque",
  online:        "Online",
};

const SPONSORSHIP_LABELS: Record<string, string> = {
  self_funded:       "Self Funded",
  company_sponsored: "Company Sponsored",
  government_funded: "Government Funded",
  scholarship:       "Scholarship",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3.5">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      <Icon size={17} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 px-4 sm:px-6 border-b border-slate-100 py-3">
    {title}
  </p>
);

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

const PaymentDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const id = uid;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { payment, loading, error, refetch } = useGetPayment(id);
  const { markPaid, markFailed, markPaidState, markFailedState } = usePaymentActions();
  const { deletePayment, loading: deleting } = useDeletePayment();

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (loading) return <Loading text="Loading payment..." />;
  if (error || !payment) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Payment not found."}
      </div>
    );
  }

  const handleMarkPaid = async () => {
    const ok = await markPaid(payment.uid);
    if (ok) { addToast("Payment marked as paid", "success"); refetch(); }
    else { addToast(markPaidState.error ?? "Failed to mark as paid", "error"); }
  };

  const handleMarkFailed = async () => {
    const ok = await markFailed(payment.uid);
    if (ok) { addToast("Payment marked as failed", "success"); refetch(); }
    else { addToast(markFailedState.error ?? "Failed to mark as failed", "error"); }
  };

  const handleDelete = async () => {
    const ok = await deletePayment(payment.uid);
    if (ok) {
      addToast("Payment deleted", "success");
      navigate("/admin/payments");
    } else {
      addToast("Failed to delete payment", "error");
    }
  };

  const anyActionLoading = markPaidState.loading || markFailedState.loading;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <CreditCard size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">
              Payment #{payment.uid?.slice(0, 8)}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Registration #{payment.registration}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 capitalize ${STATUS_COLORS[payment.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[payment.status] ?? "bg-slate-300"}`} />
            {payment.status}
          </span>
        </div>

        {/* Payment Info */}
        <SectionTitle title="Payment Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={DollarSign}    label="Amount"          value={payment.amount ? `$${payment.amount}` : "—"} />
          <InfoRow icon={CreditCard}    label="Payment Method"  value={METHOD_LABELS[payment.payment_method] ?? payment.payment_method} />
          <InfoRow icon={FileText}      label="Sponsorship"     value={SPONSORSHIP_LABELS[payment.sponsorship_type] ?? payment.sponsorship_type} />
          <InfoRow icon={ClipboardList} label="Registration ID" value={payment.registration ? `#${payment.registration}` : "—"} />
        </div>

        {/* Status */}
        <SectionTitle title="Status" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={CalendarDays} label="Paid At"       value={formatDate(payment.paid_at)} />
          <InfoRow icon={CalendarDays} label="Cancelled At"  value={formatDate(payment.cancelled_at)} />
          <InfoRow
            icon={FileText}
            label="Cancelled Reason"
            value={payment.cancelled_reason || "—"}
          />
          <InfoRow icon={FileText} label="Proof" value={
            payment.proof
              ? <a href={payment.proof} target="_blank" rel="noreferrer" className="text-navy-600 underline underline-offset-2 hover:text-navy-500">View Proof</a>
              : "—"
          } />
        </div>

        {/* Approval */}
        <SectionTitle title="Approval" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={FileText} label="Approved By"  value={payment.approved_by  ? `#${payment.approved_by}`  : "—"} />
          <InfoRow icon={FileText} label="Cancelled By" value={payment.cancelled_by ? `#${payment.cancelled_by}` : "—"} />
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 mt-2 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleMarkPaid}
              disabled={anyActionLoading || payment.status === "approved"}
              className="flex items-center gap-2 px-4 py-2 rounded-md lg:rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {markPaidState.loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Mark as Paid
            </button>
            <button
              type="button"
              onClick={handleMarkFailed}
              disabled={anyActionLoading || payment.status === "cancelled"}
              className="flex items-center gap-2 px-4 py-2 rounded-md lg:rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {markFailedState.loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Mark as Failed
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/payments")}
              className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/payments/${uid}/edit`)}
              className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="px-4 rounded-md lg:rounded-lg border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Payment"
        message={
          <>
            Are you sure you want to delete payment{" "}
            <span className="font-semibold text-navy-800">#{payment.id}</span>?{" "}
            This cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PaymentDetailPage;
