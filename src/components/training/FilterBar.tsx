// @ts-nocheck
import { motion } from "framer-motion";
import { MdSearch, MdLocationOn, MdCategory, MdTune } from "react-icons/md";
import type { Location } from "types/location";
import type { Category } from "types/category";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  locationUid: string;
  onLocationChange: (v: string) => void;
  categoryUid: string;
  onCategoryChange: (v: string) => void;
  locations: Location[];
  categories: Category[];
  totalResults: number;
}

const FilterBar = ({
  search,
  onSearchChange,
  locationUid,
  onLocationChange,
  categoryUid,
  onCategoryChange,
  locations,
  categories,
  totalResults,
}: Props) => {
  const hasActive = search || locationUid || categoryUid;

  const clearAll = () => {
    onSearchChange("");
    onLocationChange("");
    onCategoryChange("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search course title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition"
          />
        </div>

        {/* Category filter */}
        <div className="relative md:w-52">
          <MdCategory size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={categoryUid}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl text-navy-800 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.uid} value={c.uid}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Location filter */}
        <div className="relative md:w-52">
          <MdLocationOn size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={locationUid}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl text-navy-800 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition appearance-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.uid} value={l.uid}>{l.city}, {l.country}</option>
            ))}
          </select>
        </div>

        {/* Clear button */}
        {hasActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-500 bg-slate-50 border border-gray-200 rounded-xl transition-colors"
          >
            <MdTune size={15} />
            Clear
          </motion.button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          <span className="font-semibold text-navy-700">{totalResults}</span>{" "}
          {totalResults === 1 ? "program" : "programs"} found
        </p>
      </div>
    </motion.div>
  );
};

export default FilterBar;
