// @ts-nocheck
import useAuth from "hooks/auth/useAuth";

const ManagerProfile = () => {
  const { user } = useAuth();

  return (
    <div className="mt-3 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-700">My Profile</h2>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm max-w-xl">
        <div className="flex items-center gap-5 mb-6">
          <div className="h-16 w-16 rounded-full bg-navy-700 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0) ?? "M"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-700">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
            <p className="text-navy-700 font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
            <p className="text-navy-700 font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
