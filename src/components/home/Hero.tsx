// @ts-nocheck
import { motion } from "framer-motion";
import heroBg from "assets/videos/training-bg-2.mp4";
import ikaLogo from "assets/img/brand/IKA-logo-bg.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] mt-[72px] mx-3 sm:mx-6 mb-6 flex items-center overflow-hidden rounded-2xl sm:rounded-3xl max-w-6xl lg:mx-auto">

      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={heroBg}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Mobile full overlay (stronger for readability) */}
      <div className="absolute inset-0 bg-navy-950/70 sm:hidden" />
      {/* Desktop left-heavy gradient overlay */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-navy-950/85 via-navy-900/60 to-navy-900/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Gold accent line — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent" />

      {/* Decorative ring — top right */}
      <div className="absolute top-8 right-10 w-36 h-36 border-[3px] border-white/15 rounded-full pointer-events-none" />
      <div className="absolute top-16 right-18 w-20 h-20 border-2 border-gold-400/25 rounded-full pointer-events-none" />

      {/* Decorative ring — bottom left */}
      <div className="absolute -bottom-10 -left-10 w-48 h-48 border-[3px] border-gold-500/10 rounded-full pointer-events-none" />

      {/* Logo watermark — center right */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <img
          src={ikaLogo}
          alt=""
          aria-hidden="true"
          className="w-52 h-auto opacity-[0.12] brightness-200 drop-shadow-2xl"
        />
      </div>

      {/* Content — left aligned */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 lg:px-14 py-20">
        <div className="max-w-2xl">

          {/* Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.15}
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mt-6 mb-5 drop-shadow-lg"
          >
            Invest in Your Employees
            <span className="block text-gold-400 mt-1">Invest in Your Future</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="text-base md:text-lg text-white/75 leading-relaxed mb-10 max-w-lg text-justify"
          >
            A trusted international center for professional training, executive development,
            and applied learning — empowering individuals and institutions to achieve excellence
            in Malaysia, Europe, the United Kingdom, Türkiye, and beyond.
          </motion.p>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>

    </section>
  );
};

export default Hero;
