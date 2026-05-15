// @ts-nocheck
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  Wrench,
  ClipboardList,
  Building2,
  LayoutList,
  Truck,
  Users,
  Star,
  Shield,
  MapPin,
  Settings,
} from "lucide-react";
import useServices from "hooks/services/useServices";

const WHATSAPP_NUMBER = "601139936766";

const ICONS = [
  Home, Wrench, ClipboardList, Building2,
  LayoutList, Truck, Users, Star, Shield, MapPin, Settings,
];

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

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
          {services.map((service, index) => {
            const waText = encodeURIComponent(
              `Hi, I'm interested in your service: ${service.name}`
            );
            const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
            const Icon = ICONS[index % ICONS.length];

            return (
              <motion.div
                key={service.uid}
                variants={card}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-gold-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Icon area */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {/* Decorative hexagon */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-44 bg-slate-200/70"
                    style={{ clipPath: HEX }}
                  />
                  {/* Icon badge */}
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center text-white shadow-sm group-hover:bg-gold-600 transition-colors duration-300">
                    <Icon size={22} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 pt-5 pb-2">
                  <h3 className="text-lg font-bold text-navy-800 mb-2 line-clamp-2 leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {service.summary || "No description provided."}
                  </p>
                </div>

                {/* CTA */}
                <div className="px-6 py-5">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold-600 font-semibold text-sm hover:text-gold-700 transition-colors duration-200"
                  >
                    Contact Us
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
