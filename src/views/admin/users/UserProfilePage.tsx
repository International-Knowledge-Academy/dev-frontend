// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdEdit, MdEmail, MdBadge, MdToggleOn, MdCalendarToday, MdPerson } from "react-icons/md";
import useGetUser from "hooks/users/useGetUser";
import Button from "components/ui/buttons/Button";

const roleLabel: Record<string, string> = {
  admin:           "Admin",
  account_manager: "Account Manager",
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-navy-700 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-navy-50 dark:bg-navy-900 flex items-center justify-center text-navy-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 dark:text-white break-all">{value}</div>
    </div>
  </div>
);

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useGetUser(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "User not found."}
      </div>
    );
  }

  return (
    <div className="block space-y-5">
      <div className="bg-white block rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">
        {/* Hero */}
        <div className="border-b border-slate-100 px-6 py-6 flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800">{user.name}</h1>
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-lg bg-navy-100 text-xs font-semibold text-navy-700">
              {roleLabel[user.role] ?? user.role}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
            user.is_active
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-500 border-red-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-400"}`} />
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details */}
        <div className="px-6">
          <InfoRow
            icon={<MdPerson size={18} />}
            label="Full Name"
            value={user.name}
          />
          <InfoRow
            icon={<MdEmail size={18} />}
            label="Email Address"
            value={user.email}
          />
          <InfoRow
            icon={<MdBadge size={18} />}
            label="Role"
            value={roleLabel[user.role] ?? user.role}
          />
          <InfoRow
            icon={<MdToggleOn size={18} />}
            label="Account Status"
            value={
              <span className={`font-semibold ${user.is_active ? "text-green-500" : "text-red-500"}`}>
                {user.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
          {user.date_joined && (
            <InfoRow
              icon={<MdCalendarToday size={18} />}
              label="Joined"
              value={new Date(user.date_joined).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            />
          )}

          {/* Actions */}
          <div className="py-4 border-t border-gray-100 dark:border-navy-700 flex gap-2">
            <Button
              type="button"
              text="Back"
              onClick={() => navigate("/admin/users")}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="button"
              variant="primary"
              text="Edit User"
              icon={<MdEdit size={16} />}
              onClick={() => navigate(`/admin/users/${id}/edit`)}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserProfilePage;
