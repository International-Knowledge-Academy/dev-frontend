// @ts-nocheck
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative bg-navy-600 py-28 px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Animated grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-widest mb-4"
        >
          Who We Are
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-6xl font-extrabold text-white leading-tight"
        >
          About{" "}
          <span className="text-gold-400">IKA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}
          className="mt-6 text-lg text-navy-200 max-w-2xl mx-auto leading-relaxed"
        >
          International Knowledge Academy for Training & Management Development —
          building excellence through knowledge, empowering individuals and institutions worldwide.
        </motion.p>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-navy-300"
        >
          <span>Home</span>
          <span className="text-gold-500">/</span>
          <span className="text-gold-400 font-medium">About Us</span>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
