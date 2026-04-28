// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdPersonAdd, MdEdit, MdDelete, MdRefresh, MdPerson, MdEmail, MdBadge, MdToggleOn, MdSettings, MdAdminPanelSettings, MdManageAccounts, MdSchool } from "react-icons/md";
import useUsers from "hooks/users/useUsers";
import useDeleteUser from "hooks/users/useDeleteUser";
import DeleteUserModal from "./components/DeleteUserModal";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import { useToast } from "context/ToastContext";
import type { User } from "types/auth";

const roleLabel: Record<string, string> = {
  admin:           "Admin",
  account_manager: "Account Manager",
  trainer:         "Trainer",
};

const roleIcon: Record<string, React.ReactNode> = {
  admin:           <MdAdminPanelSettings size={16} />,
  account_manager: <MdManageAccounts size={16} />,
  trainer:         <MdSchool size={16} />,
};

const roleIconStyle: Record<string, string> = {
  admin:           "bg-navy-800 border-navy-700 text-white",
  account_manager: "bg-gold-500 border-gold-400 text-white",
  trainer:         "bg-green-600 border-green-500 text-white",
};

const UsersPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { users, count, loading, error, params, setParams, refetch } = useUsers();
  const { deleteUser, loading: deleting } = useDeleteUser();

  const [deleteOpen, setDeleteOpen]     = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openDelete = (user: User) => { setSelectedUser(user); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selectedUser) return;
    const ok = await deleteUser(selectedUser.uid);
    if (ok) {
      setDeleteOpen(false);
      setSelectedUser(null);
      addToast(`${selectedUser.name} has been deleted`, "success");
      refetch();
    }
  };

  const staffUsers  = users.filter((u) => u.role !== "trainer");
  const totalPages  = Math.ceil(count / 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 max-w-5xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-5 px-6">

        <div className="flex items-center gap-3">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search users..."
          />
          <FilterSelectField
            value={params.role ?? "all"}
            onChange={(val) => setParams({ role: val === "all" ? undefined : val })}
            icon={MdBadge}
            defaultOption="All"
            options={[
              { value: "admin",           label: "Admin" },
              { value: "account_manager", label: "Account Manager" },
            ]}
          />
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-gray-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-gray-700"
            hoverBorderColor="hover:border-slate-300"
            className="p-2.5"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="dark-navy"
            text="Add Staff"
            icon={<MdPersonAdd />}
            onClick={() => navigate("/admin/users/create")}
          />
         
          <p className="text-sm text-gray-400 ml-2">{staffUsers.length} users</p>
        </div>

      </div>

      <Divider />

      {/* Table */}
      <div className="pb-5 px-6">

           <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
           <Loading text="Fetching users data..." />
          ) : error ? (
          <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
        ) : staffUsers.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  { label: "Name",    icon: <MdPerson    size={14} /> },
                  { label: "Email",   icon: <MdEmail     size={14} /> },
                  { label: "Role",    icon: <MdBadge     size={14} /> },
                  { label: "Status",  icon: <MdToggleOn  size={14} /> },
                  { label: "Actions", icon: <MdSettings  size={14} /> },
                ].map(({ label, icon }) => (
                  <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                    <span className="flex items-center gap-1.5">{icon}{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staffUsers.map((user) => (
                <tr key={user.uid} onClick={() => navigate(`/admin/users/${user.uid}`)} className="hover:bg-gray-50 transition cursor-pointer">
                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md lg:rounded-lg border flex items-center justify-center flex-shrink-0 ${roleIconStyle[user.role] ?? "bg-navy-500 border-navy-400 text-white"}`}>
                        {roleIcon[user.role] ?? <MdPerson size={16} />}
                      </div>
                      <span className="font-medium text-navy-800">{user.name}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700">
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      user.is_active ? "bg-green-50 text-green-600 border-green-600" : "bg-red-50 text-red-500 border-red-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-400"}`} />
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/users/${user.uid}/edit`)}
                        className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
                        title="Edit"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDelete(user)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <MdDelete size={16} />
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
          <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100">
            <p className="text-xs text-gray-400">
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

      {/* Delete modal (stays as popup) */}
      <DeleteUserModal
        open={deleteOpen}
        user={selectedUser}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default UsersPage;
