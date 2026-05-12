// @ts-nocheck
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import usePartnerships from "hooks/partnerships/usePartnerships";

const PARTNERSHIP_TYPE_LABELS: Record<string, string> = {
  certification: "Certification",
  academic:      "Academic",
  corporate:     "Corporate",
  government:    "Government",
  technology:    "Technology",
  media:         "Media",
};

const LogoCard = ({ p }: { p: any }) => (
  <div className="flex-shrink-0 flex flex-col items-center gap-3 px-8">
    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
      {p.logo ? (
        <img
          src={p.logo}
          alt={p.name}
          className="w-full h-full object-contain p-2"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <span className="text-2xl font-extrabold text-navy-600">
          {p.name?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </div>
    <div className="text-center">
      <p className="text-xs font-semibold text-navy-800 whitespace-nowrap">{p.name}</p>
      {p.partnership_type && (
        <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
          {PARTNERSHIP_TYPE_LABELS[p.partnership_type] ?? p.partnership_type}
        </p>
      )}
    </div>
  </div>
);

const Partnerships = () => {
  const { partnerships, loading } = usePartnerships();

  if (loading || partnerships.length === 0) return null;

  const doubled = [...partnerships, ...partnerships];

  return (
    <section className="py-20 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Trusted By
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3">
            Our Partners
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            We collaborate with leading organizations to deliver world-class training
            and internationally recognised credentials.
          </p>
        </motion.div>

      </div>

      {/* Ticker — full width, no max-w constraint */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <style>{`
          @keyframes ika-ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ika-ticker-track {
            animation: ika-ticker ${Math.max(partnerships.length * 3, 20)}s linear infinite;
          }
          .ika-ticker-track:hover { animation-play-state: paused; }
        `}</style>

        <div className="flex ika-ticker-track w-max">
          {doubled.map((p, i) => (
            <LogoCard key={`${p.uid}-${i}`} p={p} />
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="max-w-6xl mx-auto mt-14 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <div className="flex items-center gap-2 text-slate-400">
          <Handshake size={15} />
          <span className="text-xs font-medium uppercase tracking-widest">
            {partnerships.length} Global Partner{partnerships.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </section>
  );
};

export default Partnerships;
