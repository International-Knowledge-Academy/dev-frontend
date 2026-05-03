// @ts-nocheck
import { motion } from "framer-motion";
import { MdCategory } from "react-icons/md";
import useCategories from "hooks/categories/useCategories";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const TrainingFields = () => {
  const { categories, count, loading, error } = useCategories({
    is_active: true,
    ordering: "display_order",
  });

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
            Training Fields
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            {count} Specialized {count === 1 ? "Category" : "Categories"}
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            From leadership to technical programs — we cover the full spectrum of professional development needs.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading categories...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">{error}</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {categories.map((field) => (
              <motion.div
                key={field.uid}
                variants={item}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group flex items-center gap-3 bg-white border border-slate-100 hover:border-gold-300 hover:shadow-md rounded-2xl px-4 py-4 transition-colors duration-200 cursor-default"
              >
                <span className="text-gold-500 group-hover:text-gold-400 flex-shrink-0 transition-colors">
                  <MdCategory size={22} />
                </span>
                <span className="text-slate-600 group-hover:text-navy-800 text-sm font-medium leading-snug transition-colors">
                  {field.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default TrainingFields;
