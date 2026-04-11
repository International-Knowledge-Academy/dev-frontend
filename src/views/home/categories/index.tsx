// @ts-nocheck
import { motion } from "framer-motion";
import { MdSchool, MdPublic, MdMenuBook } from "react-icons/md";

import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import CategoriesHero from "components/categories/CategoriesHero";
import TypeCard from "components/categories/TypeCard";

const types = [
  {
    icon: MdSchool,
    title: "Training & Development",
    description:
      "Professional development programs designed to enhance leadership, management, and technical skills across public and private sector organizations.",
    href: "/categories/training-development",
    delay: 0.1,
  },
  {
    icon: MdPublic,
    title: "International & Youth Programs",
    description:
      "Global exchange initiatives, youth leadership programs, and international partnerships that empower the next generation of leaders.",
    href: "/categories/international-youth",
    delay: 0.2,
  },
  {
    icon: MdMenuBook,
    title: "Research and Knowledge Services",
    description:
      "Evidence-based research, knowledge management consulting, and organizational development services tailored to institutional needs.",
    href: "/categories/research",
    delay: 0.3,
  },
];

const CategoriesHubPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <CategoriesHero />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-navy-800 mb-3">
            Our Training Fields
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Select a field to explore its specialized sub-categories and available programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {types.map((t) => (
            <TypeCard key={t.href} {...t} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoriesHubPage;
