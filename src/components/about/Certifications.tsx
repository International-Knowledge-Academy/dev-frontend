// @ts-nocheck
import { motion } from "framer-motion";
import { MdVerified, MdHandshake } from "react-icons/md";

const certifications = [
  {
    name: "ISO 9001:2015",
    body: "International Organization for Standardization",
    description: "Certified quality management system ensuring consistent, high-standard training delivery.",
  },
  {
    name: "CPD Accredited",
    body: "Continuing Professional Development",
    description: "All programs meet CPD standards, ensuring participants gain credits toward their professional development.",
  },
  {
    name: "HRCI Recognized",
    body: "HR Certification Institute",
    description: "Human resources programs are recognized by HRCI, supporting PHR and SPHR credential requirements.",
  },
  {
    name: "PMI Authorized",
    body: "Project Management Institute",
    description: "Project management training aligns with PMI standards and contributes PDUs toward PMP certification.",
  },
];

const partners = [
  { name: "5-Star Hotel Partners", detail: "Premium venues across UAE, Europe & Asia" },
  { name: "Corporate Partners", detail: "Government entities, multinationals & SMEs" },
  { name: "Academic Affiliations", detail: "Recognized universities & learning institutions" },
  { name: "Global Trainer Network", detail: "Expert instructors from 10+ countries" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Certifications = () => {
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
            Trust & Credibility
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Certifications & Partnerships
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            IKA is backed by internationally recognized accreditations and a strong network
            of global partners — ensuring every certificate carries real-world value.
          </p>
        </motion.div>

        {/* Certifications */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2 mb-8"
          >
            <MdVerified size={22} className="text-gold-500" />
            <h3 className="text-lg font-bold text-navy-800">Accreditations</h3>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {certifications.map((cert) => (
              <motion.div
                key={cert.name}
                variants={card}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex gap-5 p-6 rounded-2xl border border-slate-100 hover:border-gold-300 hover:shadow-md transition-colors duration-200 bg-white cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 text-center leading-tight px-1">
                  {cert.name.split(" ")[0]}
                </div>
                <div>
                  <p className="text-navy-800 font-bold text-sm">{cert.name}</p>
                  <p className="text-gold-500 text-xs font-medium mt-0.5">{cert.body}</p>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{cert.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="bg-navy-600 rounded-3xl p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="flex items-center gap-2 mb-8 relative">
            <MdHandshake size={22} className="text-gold-400" />
            <h3 className="text-lg font-bold text-white">Our Partnerships</h3>
          </div>

          <motion.div
            className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {partners.map((p) => (
              <motion.div
                key={p.name}
                variants={card}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-200 cursor-default"
              >
                <p className="text-gold-400 font-bold text-sm">{p.name}</p>
                <p className="text-navy-300 text-xs mt-2 leading-relaxed">{p.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Certifications;
