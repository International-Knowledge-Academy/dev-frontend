// @ts-nocheck
import {
  MdWorkspacePremium, MdLocationOn, MdLayers,
  MdPeople, MdSchool,
} from "react-icons/md";

const statCards = [
  {
    label: "Total Programs",
    value: "48",
    change: "+4 this month",
    positive: true,
    icon: <MdWorkspacePremium size={22} />,
    color: "bg-navy-700",
  },
  {
    label: "Active Trainers",
    value: "16",
    change: "+2 this month",
    positive: true,
    icon: <MdSchool size={22} />,
    color: "bg-green-600",
  },
  {
    label: "Locations",
    value: "9",
    change: "Across 6 countries",
    positive: null,
    icon: <MdLocationOn size={22} />,
    color: "bg-gold-600",
  },
  {
    label: "Fields",
    value: "12",
    change: "3 categories",
    positive: null,
    icon: <MdLayers size={22} />,
    color: "bg-purple-600",
  },
  {
    label: "Staff Members",
    value: "7",
    change: "Admins & managers",
    positive: null,
    icon: <MdPeople size={22} />,
    color: "bg-cyan-600",
  },
];


const Dashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white flex-shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 leading-none">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
            <p className={`text-xs font-medium ${s.positive === true ? "text-green-500" : s.positive === false ? "text-red-500" : "text-slate-400"}`}>
              {s.change}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Dashboard;
