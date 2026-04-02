// @ts-nocheck
import { MdBarChart, MdLock, MdFlashOn, MdGroup, MdNotifications, MdSettings } from "react-icons/md";

const features = [
  {
    icon: <MdBarChart size={28} />,
    title: "Real-time Analytics",
    description: "Track your data with live charts and visual reports updated in real time.",
  },
  {
    icon: <MdLock size={28} />,
    title: "Secure Access",
    description: "Role-based authentication ensures only the right people see the right data.",
  },
  {
    icon: <MdFlashOn size={28} />,
    title: "Fast & Lightweight",
    description: "Built with performance in mind for a smooth and responsive experience.",
  },
  {
    icon: <MdGroup size={28} />,
    title: "Team Management",
    description: "Manage admins, managers, and staff from one central dashboard.",
  },
  {
    icon: <MdNotifications size={28} />,
    title: "Smart Notifications",
    description: "Stay informed with real-time alerts on important activity.",
  },
  {
    icon: <MdSettings size={28} />,
    title: "Fully Customizable",
    description: "Configure the platform to match your exact business needs.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Everything You Need
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            A complete solution designed to help your team work smarter, not harder.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-7 rounded-2xl border border-gray-100 hover:border-gold-300 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mb-5 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
