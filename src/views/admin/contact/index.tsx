// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw, AlertTriangle, X, Filter, MessageSquare,
  Trash2, Pencil, CheckCircle2, Clock3, CircleDot,
} from "lucide-react";
import FilterSelectField from "components/form/filter/FilterSelectField";
import useContacts from "hooks/contact/useContacts";
import useDeleteContact from "hooks/contact/useDeleteContact";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import PageHeader from "components/ui/PageHeader";
import IconButton from "components/ui/buttons/IconButton";
import SearchInput from "components/form/SearchInput";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import EmptyState from "components/empty/empty";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import type { Contact } from "types/contact";

/* ─── Stat card ─────────────────────────────────────────────────────────── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
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

/* ─── Format helpers ─────────────────────────────────────────────────────── */
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const getStatusConfig = (status?: string) => {
  switch (status) {
    case "in_progress":
      return { className: "bg-amber-50 text-amber-700 border border-amber-100",     icon: <Clock3       size={12} />, label: "In Progress" };
    case "follow_up":
      return { className: "bg-blue-50 text-blue-700 border border-blue-100",        icon: <Clock3       size={12} />, label: "Follow Up"   };
    case "resolved":
      return { className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Resolved"    };
    case "closed":
      return { className: "bg-slate-100 text-slate-500 border border-slate-200",    icon: <CheckCircle2 size={12} />, label: "Closed"      };
    case "spam":
      return { className: "bg-red-50 text-red-500 border border-red-100",           icon: <CircleDot    size={12} />, label: "Spam"        };
    case "pending":
    default:
      return { className: "bg-slate-100 text-slate-600 border border-slate-200",    icon: <Clock3       size={12} />, label: "Pending"     };
  }
};

/* ─── Status options ─────────────────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: "pending",     label: "Pending"     },
  { value: "in_progress", label: "In Progress" },
  { value: "follow_up",   label: "Follow Up"   },
  { value: "resolved",    label: "Resolved"    },
  { value: "closed",      label: "Closed"      },
  { value: "spam",        label: "Spam"        },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
const ContactsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { contacts, count, loading, error, params, setParams, refetch } = useContacts();
  const { deleteContact, loading: deleting } = useDeleteContact();

  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const resolvedCount    = contacts.filter((c) => c.status === "resolved").length;
  const pendingCount     = contacts.filter((c) => !c.status || c.status === "pending").length;

  const activeFilterCount = [!!params.status].filter(Boolean).length;
  const hasAnyFilter = activeFilterCount > 0 || !!params.search;

  const clearFilters = () => setParams({ search: undefined, status: undefined });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteContact(deleteTarget.uid);
    if (ok) {
      addToast("Contact deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Contact Submissions"
        subtitle="Manage enquiries from the contact form"
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={MessageSquare} label="Total Submissions" value={count}         />
        <StatCard icon={Clock3}        label="Pending"           value={pendingCount}  accent />
        <StatCard icon={CheckCircle2}  label="Resolved"          value={resolvedCount} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">

          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search by name, email, organization..."
            className="flex-1 max-w-xs"
          />

          {/* Status filter */}
          <div className="hidden sm:block">
            <FilterSelectField
              value={params.status ?? "all"}
              onChange={(val) => setParams({ status: val === "all" ? undefined : val })}
              icon={CircleDot}
              defaultOption="All Status"
              options={STATUS_OPTIONS}
            />
          </div>

          <div className="hidden sm:block">
            <IconButton
              onClick={refetch}
              icon={<RefreshCw size={15} />}
              bgColor="bg-white"
              textColor="text-slate-500"
              borderColor="border-slate-200"
              hoverTextColor="hover:text-slate-700"
              hoverBorderColor="hover:border-slate-300"
              className="p-2 flex-shrink-0"
            />
          </div>

          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} /> Clear all
            </button>
          )}

          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{contacts.length}</span>{" "}
              of <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative sm:hidden flex-shrink-0 p-2 rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
          >
            <Filter size={16} />
          </button>
        </div>

        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <FilterSelectField
              value={params.status ?? "all"}
              onChange={(val) => setParams({ status: val === "all" ? undefined : val })}
              icon={CircleDot}
              defaultOption="All Status"
              options={STATUS_OPTIONS}
            />
            <div className="flex items-center justify-between">
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
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{contacts.length}</span>{" "}
                  of <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching contact submissions..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : contacts.length === 0 ? (
              <EmptyState
                icon={<MessageSquare />}
                title="No contact submissions yet"
                description="Contact form submissions will appear here once visitors reach out."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["Sender", "Organization", "Email", "Phone", "Category", "Status", "Date", "Actions"].map((label) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {contacts.map((contact) => (
                      <tr
                        key={contact.uid}
                        onClick={() => navigate(`/admin/contact/${contact.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Sender */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-bold flex-shrink-0 group-hover:bg-navy-200 transition-colors">
                              {contact.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-semibold text-navy-800 truncate max-w-[160px]">
                              {contact.full_name}
                            </span>
                          </div>
                        </td>

                        {/* Organization */}
                        <td className="px-5 py-3.5 text-slate-500 truncate max-w-[140px]">
                          {contact.organization || <span className="text-slate-300">—</span>}
                        </td>

                        {/* Email */}
                        <td className="px-5 py-3.5">
                          <a
                            href={`mailto:${contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-navy-600 hover:text-navy-800 hover:underline transition truncate max-w-[180px] block"
                          >
                            {contact.email}
                          </a>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                          {contact.phone_whatsapp || <span className="text-slate-300">—</span>}
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3.5">
                          {contact.program_category ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-navy-50 text-navy-700 border border-navy-100 max-w-[140px]">
                              <span className="truncate">{contact.program_category}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-5 py-3.5">
                          {(() => {
                            const { className, label } = getStatusConfig(contact.status);
                            return (
                              <span
                                className={`inline-flex items-center max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-semibold ${className}`}
                              >
                                {label}
                              </span>
                            );
                          })()}
                        </td>
                        
                        {/* Date */}
                        <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {formatDate(contact.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/contact/${contact.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(contact)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Page {params.page ?? 1} of {totalPages}
                </p>
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
        title="Delete Submission"
        message={
          <>
            Are you sure you want to delete the submission from{" "}
            <span className="font-semibold text-navy-800">{deleteTarget?.full_name}</span>?
            {" "}This action cannot be undone.
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

export default ContactsPage;
