// @ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil, CheckCircle, XCircle, CreditCard, DollarSign,
  CalendarDays, FileText, AlertTriangle, ClipboardList, RotateCcw,
} from "lucide-react";
import { MdClose } from "react-icons/md";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Button from "components/ui/buttons/Button";
import DangerButton from "components/ui/buttons/DangerButton";
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
  const { markPaid, markCancelled, markRefunded, markPaidState, markCancelledState, markRefundedState } = usePaymentActions();
  const { deletePayment, loading: deleting } = useDeletePayment();

  const [cancelOpen, setCancelOpen]     = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundOpen, setRefundOpen]     = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [deleteOpen, setDeleteOpen]     = useState(false);

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
    else     { addToast(markPaidState.error ?? "Failed to mark as paid", "error"); }
  };

  const handleCancel = async () => {
    const ok = await markCancelled(payment.uid, cancelReason);
    if (ok) {
      addToast("Payment cancelled", "success");
      setCancelOpen(false);
      setCancelReason("");
      refetch();
    } else {
      addToast(markCancelledState.error ?? "Failed to cancel payment", "error");
    }
  };

  const handleRefund = async () => {
    const ok = await markRefunded(payment.uid, refundReason);
    if (ok) {
      addToast("Payment refunded", "success");
      setRefundOpen(false);
      setRefundReason("");
      refetch();
    } else {
      addToast(markRefundedState.error ?? "Failed to refund payment", "error");
    }
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

  const anyActionLoading = markPaidState.loading || markCancelledState.loading || markRefundedState.loading;

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
              Payment 
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {payment.registration?.full_name ?? "No registration linked"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border capitalize ${STATUS_COLORS[payment.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[payment.status] ?? "bg-slate-300"}`} />
              {payment.status}
            </span>
            <DropdownButton
              label="Actions"
              variant="outline"
              loading={anyActionLoading}
              items={[
                { label: "Mark as Paid",   icon: <CheckCircle size={14} />, onClick: handleMarkPaid,           disabled: anyActionLoading || payment.status === "approved"  },
                { label: "Cancel Payment", icon: <XCircle size={14} />,    onClick: () => setCancelOpen(true), disabled: anyActionLoading || payment.status === "cancelled" },
                { label: "Mark Refunded",  icon: <RotateCcw size={14} />,  onClick: () => setRefundOpen(true), disabled: anyActionLoading || payment.status === "refunded"  },
                { divider: true },
                { label: "Delete Payment", icon: <AlertTriangle size={14} />, onClick: () => setDeleteOpen(true), danger: true },
              ]}
            />
          </div>
        </div>

        {/* Payment Details */}
        <SectionTitle title="Payment Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={DollarSign}    label="Amount"         value={payment.amount ? `$${payment.amount}` : "—"} />
          <InfoRow icon={CreditCard}    label="Payment Method" value={METHOD_LABELS[payment.payment_method] ?? payment.payment_method ?? "—"} />
          <InfoRow icon={FileText}      label="Sponsorship"    value={SPONSORSHIP_LABELS[payment.sponsorship_type] ?? payment.sponsorship_type ?? "—"} />
          <InfoRow
            icon={ClipboardList}
            label="Registration"
            value={
              payment.registration ? (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/registrations/${payment.registration.uid}`)}
                  className="flex items-center gap-1.5 text-navy-600 font-semibold hover:text-navy-500 hover:underline underline-offset-2 transition"
                >
                  {payment.registration.full_name}
                </button>
              ) : "—"
            }
          />
          <InfoRow icon={CalendarDays} label="Paid At" value={formatDate(payment.paid_at)} />
          <InfoRow icon={FileText} label="Proof" value={
            payment.proof
              ? <a href={payment.proof} target="_blank" rel="noreferrer" className="text-navy-600 underline underline-offset-2 hover:text-navy-500">View Proof</a>
              : "—"
          } />
        </div>

        {/* Cancellation */}
        {(payment.cancelled_at || payment.cancelled_reason || payment.cancelled_by) && (
          <>
            <SectionTitle title="Cancellation" />
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
              <InfoRow icon={CalendarDays} label="Cancelled At"     value={formatDate(payment.cancelled_at)} />
              <InfoRow icon={FileText}     label="Cancelled Reason" value={payment.cancelled_reason || "—"} />
              <InfoRow icon={FileText}     label="Cancelled By"     value={payment.cancelled_by?.name ?? "—"} />
            </div>
          </>
        )}

        {/* Refund */}
        {(payment.refunded_at || payment.refunded_reason || payment.refunded_by) && (
          <>
            <SectionTitle title="Refund" />
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
              <InfoRow icon={CalendarDays} label="Refunded At"     value={formatDate(payment.refunded_at)} />
              <InfoRow icon={FileText}     label="Refunded Reason" value={payment.refunded_reason || "—"} />
              <InfoRow icon={FileText}     label="Refunded By"     value={payment.refunded_by?.name ?? "—"} />
            </div>
          </>
        )}

        {/* Approval */}
        <SectionTitle title="Approval" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={FileText} label="Approved By" value={payment.approved_by?.name ?? "—"} />
        </div>

        {/* Timestamps */}
        <SectionTitle title="Timestamps" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={CalendarDays} label="Created"      value={formatDate(payment.created_at)} />
          <InfoRow icon={CalendarDays} label="Last Updated" value={formatDate(payment.updated_at)} />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 mt-2 flex gap-2">
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
            <Pencil size={15} />
            Edit
          </button>
        </div>
      </div>

      {/* Cancel modal */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-overlay-20 backdrop-blur-sm" onClick={() => { setCancelOpen(false); setCancelReason(""); }} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl z-10">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy-800">Cancel Payment</h2>
              <button onClick={() => { setCancelOpen(false); setCancelReason(""); }} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition">
                <MdClose size={20} />
              </button>
            </div>
            <div className="px-8 py-6">
              <p className="text-sm text-slate-600 mb-5">
                Provide a reason for cancelling this payment. This will also update the associated registration status to Cancelled.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={3}
                className="w-full mb-5 rounded-md lg:rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400 transition resize-none"
              />
              <div className="flex gap-3">
                <Button
                  text="Back"
                  onClick={() => { setCancelOpen(false); setCancelReason(""); }}
                  className="flex-1 py-2.5"
                  bgColor="bg-white"
                  textColor="text-slate-600"
                  borderColor="border-slate-200"
                  hoverBgColor="hover:bg-slate-50"
                  hoverTextColor=""
                  hoverBorderColor=""
                />
                <DangerButton
                  text={markCancelledState.loading ? "Cancelling..." : "Cancel Payment"}
                  onClick={handleCancel}
                  disabled={markCancelledState.loading || !cancelReason.trim()}
                  className="flex-1 py-2.5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund modal */}
      {refundOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-overlay-20 backdrop-blur-sm" onClick={() => { setRefundOpen(false); setRefundReason(""); }} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl z-10">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy-800">Mark as Refunded</h2>
              <button onClick={() => { setRefundOpen(false); setRefundReason(""); }} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition">
                <MdClose size={20} />
              </button>
            </div>
            <div className="px-8 py-6">
              <p className="text-sm text-slate-600 mb-5">
                Provide a reason for refunding this payment. This will update the associated registration status to Refunded.
              </p>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Reason for refund..."
                rows={3}
                className="w-full mb-5 rounded-md lg:rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400 transition resize-none"
              />
              <div className="flex gap-3">
                <Button
                  text="Back"
                  onClick={() => { setRefundOpen(false); setRefundReason(""); }}
                  className="flex-1 py-2.5"
                  bgColor="bg-white"
                  textColor="text-slate-600"
                  borderColor="border-slate-200"
                  hoverBgColor="hover:bg-slate-50"
                  hoverTextColor=""
                  hoverBorderColor=""
                />
                <DangerButton
                  text={markRefundedState.loading ? "Processing..." : "Confirm Refund"}
                  onClick={handleRefund}
                  disabled={markRefundedState.loading || !refundReason.trim()}
                  className="flex-1 py-2.5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Payment"
        message={
          <>
            Are you sure you want to delete payment{" "}
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
