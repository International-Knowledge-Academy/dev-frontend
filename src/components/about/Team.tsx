// @ts-nocheck
import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";

const trainers = [
  {
    name: "Dr. Ahmed Al-Rashid",
    role: "Senior Trainer — Leadership & Management",
    specialty: "Executive Leadership · Strategic Planning · Organizational Development",
    experience: "18+ years",
    initials: "AA",
  },
  {
    name: "Prof. Sarah Mitchell",
    role: "Senior Trainer — HR & Talent Development",
    specialty: "Human Resources · Talent Management · Performance Systems",
    experience: "15+ years",
    initials: "SM",
  },
  {
    name: "Eng. Khalid Al-Mansouri",
    role: "Senior Trainer — Project Management",
    specialty: "PMP · Agile · Risk Management · PMO Setup",
    experience: "12+ years",
    initials: "KM",
  },
  {
    name: "Dr. Fatima Hassan",
    role: "Senior Trainer — Finance & Accounting",
    specialty: "Financial Analysis · Budgeting · IFRS · Corporate Finance",
    experience: "14+ years",
    initials: "FH",
  },
  {
    name: "Mr. James Okafor",
    role: "Senior Trainer — Marketing & Sales",
    specialty: "Digital Marketing · Brand Strategy · B2B Sales",
    experience: "10+ years",
    initials: "JO",
  },
  {
    name: "Ms. Laila Al-Zahra",
    role: "Senior Trainer — Soft Skills & Communication",
    specialty: "Communication · Presentation Skills · Emotional Intelligence",
    experience: "11+ years",
    initials: "LZ",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const Team = () => {
  return (
    <section id="team" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Our Experts
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Trainers & Instructors
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            A carefully selected group of seasoned professionals and subject-matter experts
            who bring deep knowledge and real-world field experience to every program.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.name}
              variants={card}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-white border border-gray-100 hover:border-gold-300 hover:shadow-lg transition-colors duration-300 rounded-2xl p-6 cursor-default"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-navy-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                  {trainer.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-navy-800 font-bold text-sm">{trainer.name}</p>
                    <MdVerified size={15} className="text-gold-500 flex-shrink-0" />
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{trainer.role}</p>
                </div>
              </div>

              {/* Specialty */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Specialization</p>
                <p className="text-gray-600 text-sm leading-relaxed">{trainer.specialty}</p>
              </div>

              {/* Experience badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 bg-navy-50 text-navy-700 text-xs font-semibold px-3 py-1 rounded-full">
                {trainer.experience} experience
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-400 text-sm mt-10"
        >
          All IKA trainers hold internationally recognized credentials and are vetted for both academic and field expertise.
        </motion.p>

      </div>
    </section>
  );
};

export default Team;
