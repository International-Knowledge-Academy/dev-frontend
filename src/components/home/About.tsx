// @ts-nocheck
import { motion } from "framer-motion";
import { MdCheckCircle } from "react-icons/md";

const highlights = [
  "Tailored programs designed for your organization's specific needs",
  "Delivered by industry-leading experts with real-world experience",
  "Flexible formats — on-site, remote, or intensive",
  "Internationally recognized accredited certificates",
];

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
  return (
    <section className="py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

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
          <p className="text-slate-500 mt-6 text-base leading-relaxed">
            IKA provides high-quality training programs that blend deep theoretical knowledge with
            practical experience. We believe that effective training is the cornerstone of
            organizational excellence — empowering individuals and transforming institutions.
          </p>
          <p className="text-slate-500 mt-4 text-base leading-relaxed italic border-l-4 border-gold-500 pl-4">
            "Invest in Your Employees and Invest in the Future of Your Institution."
          </p>

          {/* Highlights */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-8 space-y-3"
          >
            {highlights.map((item, i) => (
              <motion.li
                key={item}
                custom={i}
                variants={fadeUp}
                className="flex items-start gap-3 text-slate-600 text-sm"
              >
                <MdCheckCircle size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
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
              {[
                { value: "20+", label: "Training Fields" },
                { value: "10",  label: "Countries" },
                { value: "3",   label: "Program Types" },
                { value: "5★",  label: "Hotel Partnerships" },
              ].map((s, i) => (
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
                Operating across the UAE, UK, Europe, Asia & the Middle East
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
