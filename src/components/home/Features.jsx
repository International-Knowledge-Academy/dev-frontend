const features = [
  {
    icon: "📊",
    title: "Real-time Analytics",
    description: "Track your data with live charts and visual reports.",
  },
  {
    icon: "🔒",
    title: "Secure Access",
    description: "Role-based authentication keeps your data safe.",
  },
  {
    icon: "⚡",
    title: "Fast & Lightweight",
    description: "Built with performance in mind for a smooth experience.",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="text-center p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
