// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import heroBg from "assets/videos/training-bg-2.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="block mt-[80px] sm:mt-[100px] lg:mt-[150px]">

      <div className="relative min-h-[50vh] sm:min-h-[65vh] lg:min-h-[70vh] mx-3 sm:mx-6 flex items-center overflow-hidden rounded-2xl sm:rounded-3xl max-w-6xl lg:mx-auto bg-navy-900">

        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroBg}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Mobile full overlay */}
        <div className="absolute inset-0 bg-navy-900/85 sm:hidden pointer-events-none" />
        {/* Desktop left-heavy gradient overlay */}
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-navy-900/90 via-navy-900/65 to-navy-900/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

        {/* Gold accent line — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent pointer-events-none" />

        {/* Bottom-right CTA */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.6}
          variants={fadeUp}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20"
        >
          <button
            onClick={() => navigate("/programs")}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-md lg:rounded-lg text-xs sm:text-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            Explore Programs
            <ChevronRight size={13} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 pb-20 sm:py-12 lg:py-14">
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="max-w-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight drop-shadow-lg"
          >
            Invest in Your Employees
            <span className="block text-gold-400 mt-1 sm:mt-2">Invest in Your Future</span>
          </motion.h1>
        </div>

      </div>

    </section>
  );
};

export default Hero;
