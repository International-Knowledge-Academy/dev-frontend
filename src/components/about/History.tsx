// @ts-nocheck
import { motion } from "framer-motion";

const milestones = [
  {
    year: "Founded",
    title: "Establishment of IKA",
    description:
      "International Knowledge Academy was founded with a clear mission: to bridge the gap between theoretical knowledge and practical application in professional training.",
  },
  {
    year: "Growth",
    title: "Expanding Across the Region",
    description:
      "IKA expanded its operations across the UAE and the broader Middle East, partnering with leading hotels and venues to deliver premium training experiences.",
  },
  {
    year: "Global",
    title: "International Reach",
    description:
      "The Academy extended its programs to Europe, the UK, Asia, and Southeast Asia — operating across 10+ countries and serving clients on four continents.",
  },
  {
    year: "Today",
    title: "A Trusted Training Partner",
    description:
      "With 20+ training fields, accredited certifications, and a network of expert trainers, IKA continues to empower organizations and individuals worldwide.",
  },
];

const History = () => {
  return (
    <section className="py-24 px-6 bg-white">
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
            Our Journey
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Background & History
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            From a focused regional academy to a globally recognized training institution —
            rooted in a commitment to excellence.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />

          <div className="space-y-12">
            {milestones.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content card */}
                  <motion.div
                    className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="bg-white border border-slate-100 hover:border-gold-300 hover:shadow-md transition-all duration-200 rounded-2xl p-6">
                      <p className="text-gold-500 font-bold text-sm uppercase tracking-widest mb-1">
                        {item.year}
                      </p>
                      <h3 className="text-lg font-bold text-navy-800 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>

                  {/* Center dot */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: "backOut", delay: 0.2 }}
                    className="hidden md:flex w-5 h-5 rounded-full bg-gold-500 border-4 border-white shadow flex-shrink-0 z-10"
                  />

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default History;
