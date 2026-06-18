// @ts-nocheck
import { motion } from "framer-motion";
import { Brain, Users, Mic2, Cpu, GraduationCap, Lightbulb } from "lucide-react";

const objectives = [
  { icon: Brain,         title: "Confidence & Independence",      body: "Build stronger self-awareness, personal discipline, and the ability to operate independently in new environments."  },
  { icon: Users,         title: "Leadership & Teamwork",          body: "Lead teams, assign roles, make decisions, solve problems, and respond effectively to real challenges."              },
  { icon: Mic2,          title: "Communication & Presentation",   body: "Public speaking, persuasion, body language, and delivering professional presentations with clarity."                },
  { icon: Cpu,           title: "Future Skills & AI",             body: "Critical thinking, digital awareness, productivity tools, and practical uses of artificial intelligence."           },
  { icon: Lightbulb,     title: "Entrepreneurship & Innovation",  body: "Identify opportunities, develop ideas, and turn concepts into presentable projects and initiatives."                },
  { icon: GraduationCap, title: "Academic & Career Planning",     body: "Explore university pathways, international opportunities, and build a clearer vision for the future."              },
];

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const CampObjectives = () => (
  <section className="bg-slate-50 py-20 lg:py-28">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
          What Participants Gain
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-2">Camp Objectives</h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
          Every element of the programme is designed to build real skills, lasting confidence, and a clearer direction for the future.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {objectives.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={item}
            whileHover={{
              y: -4,
              boxShadow: "0 8px 28px rgba(16,26,60,0.10)",
              transition: { duration: 0.22 },
            }}
            className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-4 cursor-default shadow-sm"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 4 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="w-11 h-11 rounded-xl bg-navy-800 flex items-center justify-center flex-shrink-0 origin-center"
            >
              <Icon size={19} className="text-gold-400" />
            </motion.div>
            <div>
              <h3 className="text-navy-900 font-bold text-sm mb-1.5">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default CampObjectives;
