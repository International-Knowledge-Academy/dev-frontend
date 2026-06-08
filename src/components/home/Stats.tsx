// @ts-nocheck
import { motion } from "framer-motion";
import usePublicStats from "hooks/public/usePublicStats";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden:   { opacity: 0, y: 30, scale: 0.95 },
  visible:  { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.55, ease: "easeOut" } },
};

const Stats = () => {
  const { fields, locations, programs, loading } = usePublicStats();

  const stats = [
    {
      value: loading ? "20" : fields    ? `${fields}+`    : "20+",
      label: "Training Fields",
      sub:   "Across all major professional sectors",
    },
    {
      value: loading ? "10" : locations ? `${locations}+` : "10+",
      label: "Locations",
      sub:   "Malaysia, Europe, UK, Türkiye & beyond",
    },
    {
      value: loading ? "50" : programs  ? `${programs}+`  : "50+",
      label: "Programs",
      sub:   "Courses, diplomas & contracted programs",
    },
    {
      value: "100%",
      label: "Accredited",
      sub:   "Professional certificates upon completion",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gold-500">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={container}
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={item} className="text-center">
            <p className="text-4xl font-extrabold text-navy-900">{s.value}</p>
            <p className="text-navy-800 font-semibold mt-1 text-base">{s.label}</p>
            <p className="text-navy-700 text-xs mt-1 leading-snug">{s.sub}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Stats;
