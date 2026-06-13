// @ts-nocheck
import { useState, useMemo } from "react";
import { Mail, Phone, Calendar, RefreshCw, Search, X, Users } from "lucide-react";
import useEmails from "hooks/emails/useEmails";
import PageHeader from "components/ui/PageHeader";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const EmailsPage = () => {
  const { emails, loading, error, refetch } = useEmails();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return emails;
    return emails.filter(
      (e) =>
        e.email.toLowerCase().includes(q) ||
        (e.phone && e.phone.toLowerCase().includes(q))
    );
  }, [emails, search]);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Mailing List"
        subtitle="Subscribers who opted in via the quotation download flow"
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stat */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-navy-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-navy-800 leading-none">
              {emails.length}
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">
              Total Subscribers
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or phone..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition text-navy-800 placeholder-slate-400"
            />
          </div>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
            >
              <X size={12} /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={refetch}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition flex-shrink-0"
          >
            <RefreshCw size={15} />
          </button>
          {!loading && (
            <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span>
              {" "}of <span className="font-semibold text-slate-600">{emails.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Loading mailing list..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Mail />}
                title="No subscribers yet"
                description="Subscribers will appear here after they opt in via the quotation download."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Email",   icon: <Mail     size={13} /> },
                        { label: "Phone",   icon: <Phone    size={13} /> },
                        { label: "Joined",  icon: <Calendar size={13} /> },
                      ].map(({ label, icon }) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400"
                        >
                          <span className="flex items-center gap-1.5">{icon}{label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((entry) => (
                      <tr key={entry.email} className="hover:bg-slate-50 transition">
                        {/* Email */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0">
                              {entry.email[0].toUpperCase()}
                            </div>
                            <span className="text-navy-800 font-medium truncate max-w-[200px]" title={entry.email}>
                              {entry.email}
                            </span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-3.5 text-slate-500 text-sm">
                          {entry.phone || <span className="text-slate-300">—</span>}
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                          {formatDate(entry.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailsPage;
