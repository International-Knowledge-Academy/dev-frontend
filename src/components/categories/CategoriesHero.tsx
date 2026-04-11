// @ts-nocheck
import { motion } from "framer-motion";
import { MdCategory } from "react-icons/md";

const CategoriesHero = () => {
  return (
    <section className="relative bg-navy-600 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-400 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="w-16 h-16 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-6"
        >
          <MdCategory size={32} />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-widest mb-4"
        >
          IKA Training Fields
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white leading-tight"
        >
          Explore Our{" "}
          <span className="text-gold-400">Training Categories</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="mt-5 text-lg text-navy-200 max-w-2xl mx-auto leading-relaxed"
        >
          IKA offers three main training fields, each covering specialized programs
          designed to elevate professional performance across public and private sectors.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-navy-300"
        >
          <span>Home</span>
          <span className="text-gold-500">/</span>
          <span className="text-gold-400 font-medium">Categories</span>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesHero;
