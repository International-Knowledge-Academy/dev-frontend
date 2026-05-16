// @ts-nocheck
import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";
import { Globe } from "lucide-react";
import useTrainers from "hooks/trainers/useTrainers";
import type { TrainerBrief } from "types/trainer";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const getAvatarUrl = (pic: TrainerBrief["profile_picture"]): string | null => {
  if (!pic) return null;
  if (typeof pic === "string") return pic;
  return pic.public_url ?? null;
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
    <div className="border-t border-slate-100 pt-4 space-y-2">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-4/5" />
    </div>
  </div>
);

const Team = () => {
  const { trainers, loading } = useTrainers({ ordering: "name" });

  return (
    <section id="team" className="py-24 px-6 bg-slate-50">
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
            Our Experts
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Trainers & Instructors
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            A carefully selected group of seasoned professionals and subject-matter experts
            who bring deep knowledge and real-world field experience to every program.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : trainers.length === 0 ? null : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={container}
          >
            {trainers.map((trainer) => {
              const avatarUrl = getAvatarUrl(trainer.profile_picture);
              const initials  = getInitials(trainer.name);
              const location  = [trainer.city, trainer.country].filter(Boolean).join(", ");

              return (
                <motion.div
                  key={trainer.uid}
                  variants={card}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white border border-slate-100 hover:border-gold-300 hover:shadow-lg transition-colors duration-300 rounded-2xl p-6 cursor-default"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-5">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={trainer.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-navy-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-navy-800 font-bold text-sm">{trainer.name}</p>
                        <MdVerified size={15} className="text-gold-500 flex-shrink-0" />
                      </div>
                      {trainer.title && (
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{trainer.title}</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {location && (
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Location</p>
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Globe size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{location}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && trainers.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-slate-400 text-sm mt-10"
          >
            All IKA trainers hold internationally recognized credentials and are vetted for both academic and field expertise.
          </motion.p>
        )}

      </div>
    </section>
  );
};

export default Team;
