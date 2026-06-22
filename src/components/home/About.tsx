// @ts-nocheck
import { motion } from "framer-motion";
import usePublicStats from "hooks/public/usePublicStats";

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
  }),
};

const About = () => {
  const { fields, locations, programs, loading } = usePublicStats();

  const stats = [
    { value: loading ? "10" : fields    ? `${fields}+`    : "20+", label: "Training Fields"  },
    { value: loading ? "10" : locations ? `${locations}+` : "10+", label: "Locations"         },
    { value: loading ? "50" : programs  ? `${programs}+`  : "50+", label: "Programs"          },
    { value: "3",                                                   label: "Program Types"    },
  ];

  return (
    <section className="w-full relative py-24 px-6 bg-slate-50 overflow-hidden">
      
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeLeft}
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            About IKA
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3 leading-tight">
            International Knowledge Academy
            <span className="block text-gold-500 mt-1">for Training & Management Development</span>
          </h2>
          <p className="text-slate-500 mt-6 text-base leading-relaxed text-justify">
            International Knowledge Academy IKA is a global training and professional development
            academy dedicated to empowering leaders, professionals, and institutions through
            high-quality, practical, and internationally oriented training experiences.
          </p>
          <p className="text-slate-500 mt-4 text-base leading-relaxed text-justify">
            Established and commercially registered in Türkiye, with operational presence and
            partnerships in Malaysia, Europe, the United Kingdom, and beyond, IKA delivers
            specialized training programs that combine academic depth, practical application,
            and global exposure.
          </p>
          <p className="text-slate-500 mt-4 text-base leading-relaxed text-justify">
            We design our programs for professionals, executives, government employees, and
            institutional leaders who seek more than traditional training integrating expert-led
            learning, interactive workshops, international study experiences, and real-world
            application to deliver measurable professional value.
          </p>
          <p className="text-slate-500 mt-4 text-base leading-relaxed italic border-l-4 border-gold-500 pl-4 text-justify">
            "At IKA, training is not only about gaining knowledge, it is about transforming
            performance, developing leadership capability, and preparing professionals to meet
            the demands of a rapidly changing world."
          </p>
       
        </motion.div>

        {/* Right — decorative card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeRight}
          className="relative"
        >
          <div className="absolute inset-0 bg-gold-500 opacity-5 rounded-3xl blur-2xl" />
          <div className="relative bg-white border border-slate-100 shadow-sm rounded-3xl p-8 space-y-6">
            <img
              src="/brand/IKA-logo-bg.png"
              alt="IKA Logo"
              className="h-16 w-auto mx-auto"
            />
            <div className="border-t border-slate-100 pt-6 grid grid-cols-2 gap-6 text-center">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <p className="text-3xl font-extrabold text-gold-500">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-5 text-center">
              <p className="text-slate-400 text-xs">
                Operating across Malaysia, Europe, UK, Türkiye & beyond
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
