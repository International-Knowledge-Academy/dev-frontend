// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, RefreshCw, Pencil, Trash2, AlertTriangle,
  Filter, X, Users, ShieldCheck, Briefcase, ToggleLeft,
} from "lucide-react";
import useUsers from "hooks/users/useUsers";
import useDeleteUser from "hooks/users/useDeleteUser";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import FilterSelectField from "components/form/filter/FilterSelectField";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import type { User } from "types/auth";

/* ─── Stat card ──────────────────────────────────────────────────────────── */

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

/* ─── Role config ────────────────────────────────────────────────────────── */

const roleMeta: Record<string, { label: string; bg: string; text: string; border: string }> = {
  admin:           { label: "Admin",           bg: "bg-navy-50", text: "text-navy-700", border: "border-navy-200" },
  account_manager: { label: "Account Manager", bg: "bg-gold-50", text: "text-gold-700", border: "border-gold-200" },
};

/* ─── Main page ──────────────────────────────────────────────────────────── */

const UsersPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { users, count, loading, error, params, setParams, refetch } = useUsers();
  const { deleteUser, loading: deleting } = useDeleteUser();

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [filtersOpen, setFiltersOpen]   = useState(false);

  const staffUsers = users.filter((u) => u.role !== "trainer");

  const adminCount   = staffUsers.filter((u) => u.role === "admin").length;
  const managerCount = staffUsers.filter((u) => u.role === "account_manager").length;

  const activeFilterCount = [!!params.role].filter(Boolean).length;
  const hasAnyFilter      = activeFilterCount > 0 || !!params.search;

  const clearAllFilters = () => setParams({ role: undefined, search: undefined });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteUser(deleteTarget.uid);
    if (ok) {
      addToast(`${deleteTarget.name} has been deleted`, "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete user. Please try again.", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  const roleOptions = [
    { value: "admin",           label: "Admin"           },
    { value: "account_manager", label: "Account Manager" },
  ];

  return (
    <>
      {/* Page header */}
      <PageHeader
        title="Staff Members"
        subtitle="Manage admin and account manager accounts"
        actions={
          <Button
            variant="dark-navy"
            text="Add Staff"
            icon={<UserPlus size={15} />}
            onClick={() => navigate("/admin/users/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Users}       label="Total Staff"        value={count}        />
        <StatCard icon={ShieldCheck} label="Admins"             value={adminCount}   accent />
        <StatCard icon={Briefcase}   label="Account Managers"   value={managerCount} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">

        {/* Main row — always visible */}
        <div className="flex items-center gap-2">

          {/* Desktop: label + badge */}
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

          {/* Search — always visible */}
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search users..."
            className="flex-1 max-w-xs"
          />

          {/* Desktop: role filter */}
          <div className="hidden sm:block">
            <FilterSelectField
              value={params.role ?? "all"}
              onChange={(val) => setParams({ role: val === "all" ? undefined : val })}
              icon={ToggleLeft}
              defaultOption="All Roles"
              options={roleOptions}
            />
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          {/* Desktop: refresh */}
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

          {/* Desktop: clear all */}
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

          {/* Desktop: spacer + showing */}
          <div className="flex-1 hidden sm:block" />
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{staffUsers.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}

          {/* Mobile: filter toggle */}
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

        {/* Mobile: expanded filter panel */}
        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <FilterSelectField
              value={params.role ?? "all"}
              onChange={(val) => setParams({ role: val === "all" ? undefined : val })}
              icon={ToggleLeft}
              defaultOption="All Roles"
              options={roleOptions}
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
                  Showing{" "}
                  <span className="font-semibold text-slate-600">{staffUsers.length}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-slate-600">{count}</span>
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
              <Loading text="Fetching users data..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : staffUsers.length === 0 ? (
              <EmptyState
                icon={<Users size={28} />}
                title="No users found"
                description="Try adjusting your search or filters to find staff members."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Name",    icon: <Users       size={13} /> },
                        { label: "Email",   icon: <Briefcase   size={13} /> },
                        { label: "Role",    icon: <ShieldCheck size={13} /> },
                        { label: "Status",  icon: <ToggleLeft  size={13} /> },
                        { label: "Actions", icon: null },
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
                    {staffUsers.map((user) => {
                      const meta = roleMeta[user.role];
                      return (
                        <tr
                          key={user.uid}
                          onClick={() => navigate(`/admin/users/${user.uid}`)}
                          className="hover:bg-slate-50 transition cursor-pointer group"
                        >
                          {/* Name */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                                {user.name?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="font-semibold text-navy-800 truncate" title={user.name}>
                                {user.name}
                              </span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-3.5 text-slate-500 max-w-[200px]">
                            <span className="truncate block" title={user.email}>{user.email}</span>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${meta?.bg ?? "bg-navy-50"} ${meta?.text ?? "text-navy-700"} ${meta?.border ?? "border-navy-200"}`}>
                              {meta?.label ?? user.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                              user.is_active
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-slate-300"}`} />
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => navigate(`/admin/users/${user.uid}/edit`)}
                                className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(user)}
                                className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
        title="Delete User"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-navy-800">{deleteTarget?.name}</span>?
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

export default UsersPage;
