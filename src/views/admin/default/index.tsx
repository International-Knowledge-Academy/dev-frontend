// @ts-nocheck
import {
  MdWorkspacePremium, MdLocationOn, MdLayers,
  MdPeople, MdSchool, MdTrendingUp, MdCalendarToday,
  MdCheckCircle, MdPending, MdCancel, MdAccessTime,
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

const programStatusStats = [
  { label: "Upcoming",  value: 14, icon: <MdPending    size={16} />, cls: "bg-blue-50 text-blue-600 border-blue-600" },
  { label: "Ongoing",   value: 9,  icon: <MdAccessTime size={16} />, cls: "bg-green-50 text-green-600 border-green-600" },
  { label: "Completed", value: 21, icon: <MdCheckCircle size={16} />, cls: "bg-gray-100 text-gray-500 border-slate-500" },
  { label: "Cancelled", value: 4,  icon: <MdCancel     size={16} />, cls: "bg-red-50 text-red-500 border-red-500" },
];

const recentPrograms = [
  { name: "Advanced Project Management",   field: "Management",     location: "Dubai, UAE",     status: "ongoing",   type: "course" },
  { name: "Digital Marketing Diploma",     field: "Marketing",      location: "London, UK",     status: "upcoming",  type: "diploma" },
  { name: "Data Analysis Fundamentals",    field: "Technology",     location: "Cairo, Egypt",   status: "upcoming",  type: "course" },
  { name: "Leadership Excellence Program", field: "Leadership",     location: "Riyadh, KSA",    status: "completed", type: "diploma" },
  { name: "Agile & Scrum Certification",   field: "Technology",     location: "Online",         status: "ongoing",   type: "contracted" },
];

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-600",
  ongoing:   "bg-green-50 text-green-600 border-green-600",
  completed: "bg-gray-100 text-gray-500 border-slate-500",
  cancelled: "bg-red-50 text-red-500 border-red-500",
};

const typeBadge: Record<string, string> = {
  course:     "bg-navy-50 text-navy-600 border-navy-600",
  diploma:    "bg-gold-50 text-gold-600 border-gold-600",
  contracted: "bg-purple-50 text-purple-600 border-purple-600",
};

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
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
            <p className={`text-xs font-medium ${s.positive === true ? "text-green-500" : s.positive === false ? "text-red-500" : "text-gray-400"}`}>
              {s.change}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Dashboard;
