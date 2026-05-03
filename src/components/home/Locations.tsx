// @ts-nocheck
import { motion } from "framer-motion";
import { MdLocationOn } from "react-icons/md";
import useLocations from "hooks/locations/useLocations";

const countryFlags: Record<string, string> = {
  UAE: "🇦🇪",
  UK: "🇬🇧",
  Spain: "🇪🇸",
  Netherlands: "🇳🇱",
  Germany: "🇩🇪",
  Malaysia: "🇲🇾",
  Turkey: "🇹🇷",
  Egypt: "🇪🇬",
  Indonesia: "🇮🇩",
  Jordan: "🇯🇴",
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const Locations = () => {
  const { locations: locationList, loading, error } = useLocations({ is_active: true });

  const grouped = locationList.reduce<Record<string, string[]>>((acc, loc) => {
    if (!acc[loc.country]) acc[loc.country] = [];
    acc[loc.country].push(loc.city);
    return acc;
  }, {});

  const countries = Object.entries(grouped).map(([country, cities]) => ({
    country,
    cities,
    flag: countryFlags[country] ?? "🌍",
  }));

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
            Where We Operate
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Training Across {countries.length} {countries.length === 1 ? "Country" : "Countries"}
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            IKA programs are delivered at premium venues across the Middle East, Europe, and Southeast Asia.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading locations...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">{error}</div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {countries.map((loc) => (
              <motion.div
                key={loc.country}
                variants={card}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-slate-100 hover:border-gold-300 hover:shadow-md p-5 text-center cursor-default"
              >
                <div className="text-4xl mb-3">{loc.flag}</div>
                <p className="text-navy-800 font-bold text-sm">{loc.country}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {loc.cities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-0.5 text-xs text-slate-500 group-hover:text-gold-600 transition-colors"
                    >
                      <MdLocationOn size={12} />
                      {city}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Locations;
