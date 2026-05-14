// @ts-nocheck
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import useServices from "hooks/services/useServices";

const WHATSAPP_NUMBER = "601139936766";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Services = () => {
  const { services, loading } = useServices({ is_active: true });

  if (loading || services.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-slate-50">
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
            What We Offer
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Our Services
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Explore our range of professional services designed to elevate your
            organization. Reach out on WhatsApp to learn more or get started.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {services.map((service) => {
            const waText = encodeURIComponent(
              `Hi, I'm interested in your service: ${service.name}`
            );
            const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

            return (
              <motion.div
                key={service.uid}
                variants={card}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-gold-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card body */}
                <div className="flex-1 p-7">
                  <div className="w-11 h-11 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-700 font-extrabold text-sm mb-5 group-hover:bg-gold-500 group-hover:text-white group-hover:border-gold-500 transition-all duration-300">
                    {service.name?.charAt(0)?.toUpperCase() ?? "S"}
                  </div>

                  <h3 className="text-lg font-bold text-navy-800 mb-2 leading-snug">
                    {service.name}
                  </h3>

                  {service.summary ? (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {service.summary}
                    </p>
                  ) : (
                    <p className="text-slate-300 text-sm italic">No description provided.</p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 mx-7" />

                {/* WhatsApp CTA */}
                <div className="px-7 py-5">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md lg:rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold transition-colors duration-200"
                  >
                    <FaWhatsapp size={16} />
                    Enquire on WhatsApp
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom accent */}
        <div className="mt-14 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles size={14} />
            <span className="text-xs font-medium uppercase tracking-widest">
              {services.length} Service{services.length !== 1 ? "s" : ""} Available
            </span>
          </div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

      </div>
    </section>
  );
};

export default Services;
