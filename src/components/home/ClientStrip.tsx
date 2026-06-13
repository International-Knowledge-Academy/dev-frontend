// @ts-nocheck
import useFeedbacks from "hooks/feedbacks/useFeedbacks";

const ClientStrip = () => {
  const { feedbacks, loading } = useFeedbacks({ page_size: 20 });

  if (loading || feedbacks.length === 0) return null;

  const items = [...feedbacks, ...feedbacks];

  return (
    <section className="py-14 bg-navy-900 overflow-hidden">
      <style>{`
        @keyframes ika-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ika-marquee-track {
          animation: ika-marquee 32s linear infinite;
        }
        .ika-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10 px-6">
        <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest">
          Trusted By
        </span>
        <h2
          className="text-2xl md:text-3xl font-extrabold text-white mt-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Professionals Who Trust IKA
        </h2>
        <div className="w-12 h-0.5 bg-gold-400 mx-auto mt-4" />
      </div>

      {/* Marquee */}
      <div className="flex overflow-hidden">
        <div className="ika-marquee-track flex gap-4 whitespace-nowrap">
          {items.map((fb, i) => (
            <div
              key={`${fb.uid}-${i}`}
              className="inline-flex items-center gap-3 bg-navy-800/70 border border-navy-700 hover:border-gold-500/40 rounded-xl px-5 py-3.5 flex-shrink-0 transition-colors duration-200 cursor-default"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
                {fb.name?.[0]?.toUpperCase() ?? "?"}
              </div>

              {/* Info */}
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{fb.name}</p>
                {fb.position && (
                  <p className="text-[11px] text-navy-400 leading-tight mt-0.5" style={{ maxWidth: 160 }}>
                    {fb.position}
                  </p>
                )}
              </div>

              {/* Rating dot */}
              <div className="ml-2 flex items-center gap-0.5 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`w-1.5 h-1.5 rounded-full ${s <= fb.rating ? "bg-gold-400" : "bg-navy-600"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientStrip;
