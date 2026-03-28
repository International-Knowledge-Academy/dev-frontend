const team = [
  {
    name: "Alex Johnson",
    role: "CEO & Co-founder",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Sarah Williams",
    role: "CTO & Co-founder",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Mark Davis",
    role: "Head of Design",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const Team = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">
        Meet the Team
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {team.map((member) => (
          <div
            key={member.name}
            className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-400">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
