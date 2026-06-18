// @ts-nocheck
import { motion } from "framer-motion";
import { LayoutGrid, Wrench, UserCheck, Shield, HeartHandshake, Globe2 } from "lucide-react";

const advantages = [
  {
    icon:  LayoutGrid,
    title: "An Integrated Programme",
    body:  "The camp brings together training, education, leadership, cultural exploration, and recreation in one balanced experience.",
  },
  {
    icon:  Wrench,
    title: "Practical Learning",
    body:  "The programme is based on workshops, challenges, discussions, group activities, and real-life experiences rather than traditional lectures alone.",
  },
  {
    icon:  UserCheck,
    title: "Limited Participation",
    body:  "A limited number of participants ensures better engagement, closer supervision, and a higher-quality experience.",
  },
  {
    icon:  Shield,
    title: "A Gulf Youth Environment",
    body:  "The camp provides a culturally aligned environment that respects Gulf values, discipline, and the developmental needs of young participants.",
  },
  {
    icon:  HeartHandshake,
    title: "Supervision & Support",
    body:  "The programme is delivered under organised supervision, with continuous support throughout accommodation, transportation, visits, and activities.",
  },
  {
    icon:  Globe2,
    title: "An International Experience",
    body:  "Participants gain exposure to a new environment, broaden their perspectives, build new relationships, and create lasting memories.",
  },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampAdvantagesSection = () => (
  <section className="py-20 lg:py-28 bg-slate-50">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-14"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
          Why Choose This Camp
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">Camp Advantages</h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Six reasons why the Gulf Young Leaders Camp stands apart from ordinary youth programmes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {advantages.map(({ icon: Icon, title, body }, i) => (
          <motion.div
            key={title}
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.07}
            variants={fadeUp}
            className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-gold-200 hover:shadow-md transition-all duration-300 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-navy-900 group-hover:bg-gold-500 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
              <Icon size={20} className="text-gold-400 group-hover:text-navy-900 transition-colors duration-300" />
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

export default CampAdvantagesSection;
