// @ts-nocheck
import { motion } from "framer-motion";
import { Brain, Users, Mic2, Cpu, GraduationCap, Lightbulb } from "lucide-react";

const modules = [
  {
    icon:  Brain,
    title: "Personal Development",
    color: "text-purple-500",
    bg:    "bg-purple-50 border-purple-100",
    body:  "Identifying personal strengths, building self-confidence, developing discipline, managing oneself, and taking responsibility.",
  },
  {
    icon:  Users,
    title: "Leadership & Teamwork",
    color: "text-navy-600",
    bg:    "bg-navy-50 border-navy-100",
    body:  "Leading teams, assigning roles, making decisions, solving problems, and responding effectively to challenges.",
  },
  {
    icon:  Mic2,
    title: "Communication & Presentation",
    color: "text-blue-500",
    bg:    "bg-blue-50 border-blue-100",
    body:  "Public speaking, persuasion, body language, expressing ideas clearly, and delivering professional presentations.",
  },
  {
    icon:  Cpu,
    title: "Future Skills",
    color: "text-emerald-600",
    bg:    "bg-emerald-50 border-emerald-100",
    body:  "Artificial intelligence, critical thinking, digital awareness, productivity, and adapting to future changes.",
  },
  {
    icon:  GraduationCap,
    title: "Academic & Career Planning",
    color: "text-gold-600",
    bg:    "bg-gold-50 border-gold-100",
    body:  "Choosing a field of study, understanding university pathways, exploring international opportunities, and developing a clearer vision for the future.",
  },
  {
    icon:  Lightbulb,
    title: "Entrepreneurship & Innovation",
    color: "text-rose-500",
    bg:    "bg-rose-50 border-rose-100",
    body:  "Identifying opportunities, developing ideas, creating value propositions, and turning concepts into presentable projects.",
  },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampCurriculumSection = () => (
  <section className="py-20 lg:py-28 bg-slate-50">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-14"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
          Programme Content
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">What You Will Learn</h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          A comprehensive range of courses, workshops, and practical experiences across six core areas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map(({ icon: Icon, title, color, bg, body }, i) => (
          <motion.div
            key={title}
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.07}
            variants={fadeUp}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4"
          >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CampCurriculumSection;
