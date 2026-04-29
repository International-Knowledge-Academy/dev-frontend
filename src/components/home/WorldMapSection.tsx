// @ts-nocheck
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import WorldMap from "components/map/WorldMap";
import useAllLocations from "hooks/locations/useAllLocations";

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const WorldMapSection = () => {
  const { locations, loading } = useAllLocations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            {...fadeUp(0)}
            animate={inView ? fadeUp(0).animate : fadeUp(0).initial}
            className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2"
          >
            Global Presence
          </motion.p>

          <motion.h2
            {...fadeUp(0.1)}
            animate={inView ? fadeUp(0.1).animate : fadeUp(0.1).initial}
            className="text-2xl sm:text-3xl font-extrabold text-navy-900"
          >
            Where We Operate
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            animate={inView ? fadeUp(0.2).animate : fadeUp(0.2).initial}
            className="mt-3 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed"
          >
            Our training centers span multiple countries. Hover over a country
            to see the number of centers and programs available.
          </motion.p>
        </div>

        {/* Map card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="relative rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden shadow-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-navy-200 border-t-navy-600 animate-spin" />
                <p className="text-xs text-slate-400">Loading map...</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <WorldMap locations={locations} />
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default WorldMapSection;
