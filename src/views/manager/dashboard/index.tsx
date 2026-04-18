// @ts-nocheck
const ManagerDashboard = () => {
  return (
    <div className="mt-3 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-700">Manager Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back, Manager</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Assigned Tasks</p>
          <h3 className="mt-1 text-3xl font-bold text-navy-700">12</h3>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pending Reviews</p>
          <h3 className="mt-1 text-3xl font-bold text-navy-700">5</h3>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Team Members</p>
          <h3 className="mt-1 text-3xl font-bold text-navy-700">8</h3>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
