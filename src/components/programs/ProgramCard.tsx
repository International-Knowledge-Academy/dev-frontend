// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdAccessTime, MdWorkspacePremium, MdArrowForward, MdSchool, MdHandshake } from "react-icons/md";
import type { Program } from "types/program";

const countryFlags: Record<string, string> = {
  UAE: "🇦🇪", UK: "🇬🇧", Spain: "🇪🇸", Netherlands: "🇳🇱",
  Germany: "🇩🇪", Malaysia: "🇲🇾", Turkey: "🇹🇷", Egypt: "🇪🇬",
  Indonesia: "🇮🇩", Jordan: "🇯🇴", France: "🇫🇷", Italy: "🇮🇹",
  USA: "🇺🇸", Canada: "🇨🇦", Singapore: "🇸🇬",
};

const typeConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  course:     { label: "Training Course",    cls: "bg-navy-50 text-navy-600",   icon: <MdSchool size={12} /> },
  diploma:    { label: "Training Diploma",   cls: "bg-gold-50 text-gold-700",   icon: <MdWorkspacePremium size={12} /> },
  contracted: { label: "Contracted Program", cls: "bg-purple-50 text-purple-600", icon: <MdHandshake size={12} /> },
};

const statusDot: Record<string, string> = {
  upcoming:  "bg-blue-400",
  ongoing:   "bg-green-400",
  completed: "bg-gray-400",
  cancelled: "bg-red-400",
};

interface Props {
  program: Program;
}

const ProgramCard = ({ program }: Props) => {
  const navigate = useNavigate();
  const type  = typeConfig[program.program_type] ?? typeConfig.course;
  const flag  = countryFlags[program.location?.country] ?? "🌍";

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/programs/${program.uid}`)}
      className="group bg-white border border-gray-100 hover:border-gold-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy-600 via-gold-500 to-navy-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${type.cls}`}>
            {type.icon}
            {type.label}
          </span>
          {program.status && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[program.status] ?? "bg-gray-400"}`} />
              {program.status_display ?? program.status}
            </span>
          )}
        </div>

        {/* Field */}
        {program.field && (
          <div className="flex items-center gap-1.5 mb-3">
            <MdSchool size={13} className="text-gold-500 flex-shrink-0" />
            <span className="text-xs text-gold-600 font-medium truncate">
              {program.field.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-navy-800 font-bold text-base leading-snug mb-3 group-hover:text-navy-600 transition-colors line-clamp-2">
          {program.name}
        </h3>

        {/* Description */}
        {program.description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {program.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
          {program.duration && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MdAccessTime size={13} className="flex-shrink-0" />
              <span>{program.duration}</span>
            </div>
          )}
          {program.location && (
            <div className="flex items-center gap-1 text-xs text-gray-400 truncate">
              <span className="text-sm">{flag}</span>
              <MdLocationOn size={12} className="flex-shrink-0" />
              <span className="truncate">{program.location.city}</span>
            </div>
          )}
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-7 h-7 rounded-full bg-gold-500 text-white flex items-center justify-center">
              <MdArrowForward size={14} />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProgramCard;
