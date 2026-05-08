// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, CheckCircle, Clock, Plus, RefreshCw,
  Pencil, Trash2, AlertTriangle, X, Filter, DollarSign,
} from "lucide-react";
import usePayments from "hooks/payments/usePayments";
import useDeletePayment from "hooks/payments/useDeletePayment";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import type { Payment } from "types/payment";

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
  company_sponsored: "Company",
  government_funded: "Government",
  scholarship:       "Scholarship",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-gold-50 border border-gold-200" : "bg-navy-50 border border-navy-100"}`}>
      <Icon size={18} className={accent ? "text-gold-500" : "text-navy-600"} />
    </div>
    <div className="min-w-0">
      <p className={`text-2xl font-extrabold tabular-nums leading-none ${accent ? "text-gold-500" : "text-navy-800"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</p>
    </div>
  </div>
);

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pending"   },
  { value: "approved",  label: "Approved"  },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded",  label: "Refunded"  },
];

const SPONSORSHIP_OPTIONS = [
  { value: "self_funded",       label: "Self Funded"  },
  { value: "company_sponsored", label: "Company"      },
  { value: "government_funded", label: "Government"   },
  { value: "scholarship",       label: "Scholarship"  },
];

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { payments, count, loading, error, params, setParams, refetch } = usePayments();
  const { deletePayment, loading: deleting } = useDeletePayment();

  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [filtersOpen, setFiltersOpen]   = useState(false);

  const totalApproved = payments.filter((p) => p.status === "approved").length;
  const totalPending  = payments.filter((p) => p.status === "pending").length;

  const activeFilterCount = [
    !!(params as any).status,
    !!(params as any).sponsorship_type,
  ].filter(Boolean).length;

  const hasAnyFilter = activeFilterCount > 0 || !!params.search;

  const clearAllFilters = () =>
    setParams({ search: undefined, status: undefined, sponsorship_type: undefined } as any);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deletePayment(deleteTarget.id);
    if (ok) {
      addToast("Payment deleted", "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete payment", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Manage program payment records"
        actions={
          <Button
            variant="dark-navy"
            text="New Payment"
            icon={<Plus size={15} />}
            onClick={() => navigate("/admin/payments/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={CreditCard}   label="Total"    value={count}         />
        <StatCard icon={Clock}        label="Pending"  value={totalPending}  accent />
        <StatCard icon={CheckCircle}  label="Approved" value={totalApproved} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy-700 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-200" />
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search payments..."
            className="flex-1 max-w-xs"
          />
          <div className="hidden sm:flex items-center gap-2">
            <FilterSelectField
              value={(params as any).status ?? ""}
              onChange={(val) => setParams({ status: val || undefined } as any)}
              icon={CreditCard}
              defaultOption="All Statuses"
              options={STATUS_OPTIONS}
            />
            <FilterSelectField
              value={(params as any).sponsorship_type ?? ""}
              onChange={(val) => setParams({ sponsorship_type: val || undefined } as any)}
              icon={DollarSign}
              defaultOption="All Sponsorships"
              options={SPONSORSHIP_OPTIONS}
            />
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-200" />
          <IconButton
            onClick={refetch}
            icon={<RefreshCw size={15} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="hidden sm:flex p-2 flex-shrink-0"
          />
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} />
              Clear all
            </button>
          )}
          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{payments.length}</span> of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative sm:hidden flex-shrink-0 p-2 rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-navy-700 text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <FilterSelectField
              value={(params as any).status ?? ""}
              onChange={(val) => setParams({ status: val || undefined } as any)}
              icon={CreditCard}
              defaultOption="All Statuses"
              options={STATUS_OPTIONS}
            />
            <FilterSelectField
              value={(params as any).sponsorship_type ?? ""}
              onChange={(val) => setParams({ sponsorship_type: val || undefined } as any)}
              icon={DollarSign}
              defaultOption="All Sponsorships"
              options={SPONSORSHIP_OPTIONS}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={refetch}
                  icon={<RefreshCw size={14} />}
                  bgColor="bg-white"
                  textColor="text-slate-500"
                  borderColor="border-slate-200"
                  hoverTextColor="hover:text-slate-700"
                  hoverBorderColor="hover:border-slate-300"
                  className="p-2"
                />
                {hasAnyFilter && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    <X size={12} />
                    Clear all
                  </button>
                )}
              </div>
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{payments.length}</span> of{" "}
                  <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching payments..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : payments.length === 0 ? (
              <EmptyState
                icon={<CreditCard />}
                title="No payments found"
                description="No payments match your search or filters."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["#", "Registration", "Amount", "Method", "Sponsorship", "Status", "Actions"].map((label) => (
                        <th key={label} className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        onClick={() => navigate(`/account-manager/payments/${payment.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        <td className="px-5 py-3.5 text-slate-400 tabular-nums text-xs">#{payment.id}</td>
                        <td className="px-5 py-3.5 text-slate-500 tabular-nums">
                          {payment.registration ? `Reg #${payment.registration}` : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-navy-800 tabular-nums">
                            {payment.amount ? `$${payment.amount}` : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {METHOD_LABELS[payment.payment_method] ?? payment.payment_method ?? "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-navy-50 text-navy-700 border border-navy-100">
                            {SPONSORSHIP_LABELS[payment.sponsorship_type] ?? payment.sponsorship_type ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_COLORS[payment.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[payment.status] ?? "bg-slate-300"}`} />
                            <span className="capitalize">{payment.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/account-manager/payments/${payment.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(payment)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">Page {params.page ?? 1} of {totalPages}</p>
                <div className="flex gap-2">
                  <PrevButton
                    text="Previous"
                    disabled={!params.page || params.page <= 1}
                    onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                  />
                  <NextButton
                    text="Next"
                    disabled={(params.page ?? 1) >= totalPages}
                    onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Payment"
        message={
          <>
            Are you sure you want to delete payment{" "}
            <span className="font-semibold text-navy-800">#{deleteTarget?.id}</span>?{" "}
            This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default PaymentsPage;
