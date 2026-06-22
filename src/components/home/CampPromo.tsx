// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Users, Clock, MapPin, ChevronRight, Download } from "lucide-react";

const camps = [
  {
    title:  "Gulf Youth Camp",
    age:    "Age 16 – 18",
    dates:  "12 – 23 July 2026",
    tags:   ["Confidence Building", "Leadership", "University Readiness"],
    border: "border-l-gold-500",
    tagCls: "bg-gold-50 text-gold-700 border-gold-200",
  },
  {
    title:  "Gulf Future Leaders Camp",
    age:    "Age 19 – 22",
    dates:  "26 July – 6 August 2026",
    tags:   ["Advanced Leadership", "AI & Future Skills", "Entrepreneurship"],
    border: "border-l-navy-600",
    tagCls: "bg-navy-50 text-navy-700 border-navy-100",
  },
];

const stats = [
  { icon: Clock,    value: "12 Days",          label: "Per Camp"       },
  { icon: Users,    value: "20 – 25 Seats",     label: "Limited Places" },
  { icon: MapPin,   value: "4 Gulf Countries",  label: "Open To"        },
  { icon: Calendar, value: "July – Aug 2026",   label: "Next Cohort"    },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
};

const CampPromo = () => (
  <section className="relative py-20 lg:py-28 bg-white overflow-hidden">

    {/* Decorative blobs */}
    <div className="absolute -top-24 right-1/4 w-[480px] h-[480px] bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] bg-navy-100/30 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      {/* Header */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
      >
        <div>
          <span className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-700 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            IKA Signature Programme · Malaysia 2026
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 leading-tight">
            Gulf Young <span className="text-gold-500">Leaders Club</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
            An integrated leadership and entrepreneurship experience for Gulf youth — combining practical training,
            educational visits, adventure, and cultural discovery in Malaysia.
          </p>
        </div>
        <Link
          to="/camps"
          className="flex-shrink-0 inline-flex items-center gap-2 border border-navy-200 text-navy-700 hover:bg-navy-700 hover:text-white hover:border-navy-700 font-semibold px-6 py-2.5 rounded-md lg:rounded-lg text-sm transition-all duration-200"
        >
          Discover the Full Programme <ChevronRight size={14} />
        </Link>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp} custom={0.1}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
      >
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
              <Icon size={14} className="text-gold-400" />
            </div>
            <div>
              <p className="text-navy-900 font-extrabold text-sm leading-tight">{value}</p>
              <p className="text-slate-400 text-[11px] leading-tight mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Camp cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {camps.map(({ title, age, dates, tags, border, tagCls }, i) => (
          <motion.div
            key={title}
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1 + 0.15}
            variants={fadeUp}
            className={`bg-white border border-slate-100 border-l-4 ${border} rounded-2xl shadow-sm p-6`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-navy-900 font-bold text-base leading-tight">{title}</h3>
                <p className="text-slate-400 text-xs mt-1">{age}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 flex-shrink-0">
                <Calendar size={12} className="text-gold-500" />
                <span className="text-[11px] text-slate-600 font-medium">{dates}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tagCls}`}>{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTAs */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp} custom={0.3}
        className="flex flex-wrap items-center gap-4"
      >
        <Link
          to="/register/camp"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-7 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200 shadow-sm hover:-translate-y-0.5"
        >
          Register Your Interest <ChevronRight size={14} />
        </Link>
        <a
          href="#"
          className="inline-flex items-center gap-2 border border-navy-200 text-navy-700 hover:bg-navy-50 font-semibold px-7 py-3 rounded-md lg:rounded-lg text-sm transition-all duration-200"
        >
          <Download size={14} /> Download Brochure
        </a>
      </motion.div>
    </div>
  </section>
);

export default CampPromo;
