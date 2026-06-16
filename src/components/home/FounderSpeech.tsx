// @ts-nocheck
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import founderImg from "assets/img/avatars/founder-photo.png.jpeg";

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay },
  }),
};

const paragraphs = [
  "When we established this academy, our goal was not simply to add a new name to the world of training and education, but to build a knowledge platform that creates meaningful impact for individuals, institutions, and society.",
  "In a rapidly changing world, the need for practical, future-oriented knowledge has become greater than ever. From this vision, International Knowledge Academy was founded to bring together modern knowledge, professional expertise, and international learning experiences in one place.",
  "Our mission is to support learners, leaders, researchers, and institutions with knowledge that helps them grow, decide, and create impact, where knowledge begins as an idea, grows through experience, and transforms into impact.",
];

const FounderSpeech = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-white">

      {/* Subtle background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(27,42,94,0.04) 0%, transparent 60%), " +
            "radial-gradient(circle at 85% 30%, rgba(201,168,76,0.06) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={0}
          className="flex justify-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-navy-50 border border-navy-100 text-navy-600 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
            <Quote size={11} />
            Message from the Director
          </span>
        </motion.div>

        {/* Main split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Portrait side ───────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0.1}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-[320px] sm:w-[380px] lg:w-full lg:max-w-[520px]">

              {/* Gold accent frame */}
              <div
                aria-hidden="true"
                className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-gold-300/50"
              />

              {/* Navy fill block */}
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-navy-800/5"
              />

              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-navy-900/15 aspect-[3/4]">
                <img
                  src={founderImg}
                  alt="Dr. Abdallah Isam Sadeq, Director, International Knowledge Academy"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-navy-900/60 to-transparent" />

                {/* Name plate overlaid on photo */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-bold text-lg leading-tight">
                    Dr. Abdallah Isam Sadeq
                  </p>
                  <p className="text-gold-300 text-sm font-medium mt-0.5">
                    Director
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">
                    International Knowledge Academy
                  </p>
                </div>
              </div>

              {/* Floating accent badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-5 -right-5 w-20 h-20 bg-gold-400 rounded-full flex flex-col items-center justify-center shadow-lg shadow-gold-400/30"
              >
                <span className="text-navy-900 font-extrabold text-lg leading-none">IKA</span>
                <span className="text-navy-900/70 text-[8px] font-bold uppercase tracking-widest mt-0.5">
                  Director
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Message side ────────────────────────────────────────────── */}
          <div className="flex flex-col justify-center">

            {/* Opening quote mark */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.15}
            >
              <svg
                aria-hidden="true"
                className="w-14 h-14 text-gold-300 mb-6"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c4.4 0 8-3.6 8-8V8h-8zm16 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.4 0 8-3.6 8-8V8h-8z" />
              </svg>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.2}
              className="text-3xl lg:text-4xl font-extrabold text-navy-800 leading-tight tracking-tight mb-6"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                International Knowledge Academy
              </span>
            </motion.h2>

            {/* Paragraphs */}
            <div className="space-y-4 mb-8">
              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={0.25 + i * 0.08}
                  className="text-slate-600 text-[15px] leading-relaxed text-justify"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Slogan highlight */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.5}
              className="border-l-4 border-gold-400 pl-5 py-2 mb-8 bg-gold-50/60 rounded-r-xl"
            >
              <p className="text-navy-700 font-bold text-base italic">
                "New Knowledge. One Place. Global Impact."
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.55}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px flex-1 bg-slate-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <div className="h-px flex-1 bg-slate-100" />
            </motion.div>

            {/* Signature block */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0.6}
              className="flex items-center gap-5"
            >
              
              <div>
                {/* Handwritten-style signature using CSS */}
                <p
                  className="text-navy-800 font-bold text-lg leading-tight"
                  style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
                >
                  Dr. Abdallah Isam Sadeq
                </p>
                <p className="text-gold-600 text-sm font-semibold mt-0.5">
                  Director
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  International Knowledge Academy
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSpeech;
