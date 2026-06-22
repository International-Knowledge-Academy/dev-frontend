// @ts-nocheck
import { motion } from "framer-motion";
import { School, BookOpen, Globe2, Star } from "lucide-react";

const educationalVisits = [
  {
    icon:  Globe2,
    title: "Studying in Malaysia",
    body:  "Participants gain an introduction to Malaysia's educational environment, higher education system, admission requirements, academic programmes, and student life.",
  },
  {
    icon:  School,
    title: "Malaysian University Visit",
    body:  "A field experience to explore faculties, facilities, academic programmes, and university life within a real educational setting.",
  },
  {
    icon:  BookOpen,
    title: "Language Institute Visit",
    body:  "Learn about English-language programmes, international study requirements, and the importance of language development for academic and professional success.",
  },
];

const activities = [
  "A closed leadership camp",
  "Leadership and teamwork challenges",
  "Leader of the Day",
  "Practical workshops and team assignments",
  "Cultural and sightseeing tours",
  "Exploring Kuala Lumpur and its landmarks",
  "A visit to Putrajaya",
  "Genting Highlands",
  "A full recreational day at Sunway Lagoon",
  "Evening gatherings and competitions",
  "Organised shopping tours",
  "A final project and recognition ceremony",
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampExperiencesSection = () => (
  <section className="py-20 lg:py-28 bg-white">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 space-y-20">

      {/* Educational Experiences */}
      <div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Beyond the Classroom
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">Educational Experiences</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            Real-world visits that connect participants with Malaysia's academic landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {educationalVisits.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
              variants={fadeUp}
              className="bg-navy-50 border border-navy-100 rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-base mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Adventure & Discovery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">Activities & Field Experiences</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            A diverse mix of learning, interaction, and adventure across Malaysia's most iconic destinations.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0.1}
          className="flex flex-wrap gap-3 justify-center"
        >
          {activities.map((act, i) => (
            <div key={i}
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-4 py-2"
            >
              <Star size={11} className="text-gold-500 flex-shrink-0" />
              <span className="text-sm text-navy-800 font-medium">{act}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default CampExperiencesSection;
