// @ts-nocheck
import { motion } from "framer-motion";
import { MdHandshake } from "react-icons/md";
import { Globe } from "lucide-react";
import usePartnerships from "hooks/partnerships/usePartnerships";

const PARTNERSHIP_TYPE_LABELS: Record<string, string> = {
  certification: "Certification",
  academic:      "Academic",
  corporate:     "Corporate",
  government:    "Government",
  technology:    "Technology",
  media:         "Media",
};

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const PartnershipsSection = () => {
  const { partnerships, loading } = usePartnerships();

  if (loading || partnerships.length === 0) return null;

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
            Collaborations
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Our Partnerships
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            IKA works alongside a trusted network of partners to bring internationally
            recognised credentials and world-class expertise to our programmes.
          </p>
        </motion.div>

        {/* Dark card container */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="bg-navy-800 rounded-3xl p-10 relative overflow-hidden"
        >
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-navy-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="flex items-center gap-2 mb-10 relative">
            <MdHandshake size={22} className="text-gold-400" />
            <h3 className="text-lg font-bold text-white">Partner Organisations</h3>
          </div>

          <motion.div
            className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {partnerships.map((p) => (
              <motion.div
                key={p.uid}
                variants={card}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-4 hover:bg-white/10 transition-colors duration-200 cursor-default group"
              >
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.logo?.public_url ? (
                    <img
                      src={p.logo.public_url}
                      alt={p.name}
                      className="w-full h-full object-contain p-1.5"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span className="text-xl font-extrabold text-navy-700">
                      {p.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 w-full">
                  <p className="text-white font-bold text-sm leading-snug">{p.name}</p>
                  {p.partnership_type && (
                    <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/20 uppercase tracking-wide">
                      {PARTNERSHIP_TYPE_LABELS[p.partnership_type] ?? p.partnership_type}
                    </span>
                  )}
                  {p.website_url && (
                    <a
                      href={p.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 flex items-center justify-center gap-1 text-[11px] text-navy-300 hover:text-gold-400 transition-colors duration-150"
                    >
                      <Globe size={11} />
                      <span className="truncate max-w-[120px]">
                        {p.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default PartnershipsSection;
