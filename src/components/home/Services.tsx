// @ts-nocheck
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronLeft, ChevronRight,
  Home, Wrench, ClipboardList, Building2,
  LayoutList, Truck, Users, Star, Shield, MapPin, Settings,
} from "lucide-react";
import useServices from "hooks/services/useServices";

const WHATSAPP_NUMBER = "601139936766";

const ICONS = [
  Home, Wrench, ClipboardList, Building2,
  LayoutList, Truck, Users, Star, Shield, MapPin, Settings,
];

const PER_PAGE = 4;

const Services = () => {
  const { services, loading } = useServices({ is_active: true });
  const [page, setPage] = useState(0);

  if (loading || services.length === 0) return null;

  const totalPages = Math.ceil(services.length / PER_PAGE);
  const visible    = services.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
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
          <p className="text-slate-500 mt-4 max-w-xl mx-auto ">
            Specialized services designed for professionals, executives, government employees,
            and institutional leaders. Contact us on WhatsApp to learn more or get started.
          </p>
        </motion.div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {visible.map((service, index) => {
              const Icon    = ICONS[(page * PER_PAGE + index) % ICONS.length];
              const waText  = encodeURIComponent(`Hi, I'm interested in your service: ${service.name}`);
              const waHref  = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

              return (
                <motion.div
                  key={service.uid}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-gold-300 hover:shadow-lg transition-all duration-300 p-6"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-5 group-hover:bg-gold-500 group-hover:text-white group-hover:border-gold-500 transition-all duration-300 flex-shrink-0">
                    <Icon size={18} />
                  </div>

                  {/* Name */}
                  <h3 className="text-navy-800 font-bold text-base leading-snug mb-2 line-clamp-2">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-5 text-justify">
                    {service.summary || "No description provided."}
                  </p>

                  {/* CTA */}
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold-600 font-semibold text-sm hover:text-gold-700 transition-colors duration-200"
                  >
                    Contact Us
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation — only show if more than one page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {/* Prev */}
            <button
              onClick={prev}
              disabled={page === 0}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page ? "w-6 bg-gold-500" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default Services;
