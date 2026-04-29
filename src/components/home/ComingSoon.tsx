// @ts-nocheck
import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaInstagram, FaSnapchat } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.7s cubic-bezier(.22,.68,0,1.1) forwards;
        }
        .float { animation: float 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #D3AB5C, #b8934a, #e6c676, #b8934a, #D3AB5C);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid #D3AB5C55;
          animation: pulse-ring 2.5s ease-out infinite;
        }
      `}</style>

      <section className="min-h-screen bg-white p-4 md:p-6">
        <div
          className="relative min-h-[calc(100vh-48px)] rounded-3xl flex flex-col overflow-hidden bg-white"
          style={{ boxShadow: "0 0 0 1px #e6c67630, 0 8px 60px #D3AB5C12" }}
        >
          {/* Gold radial glow — top center */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center top, #D3AB5C14 0%, transparent 65%)" }}
          />
          {/* Subtle gold glow — bottom */}
          <div
            className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at bottom right, #D3AB5C0A 0%, transparent 60%)" }}
          />

          {/* Header */}
          <header
            className="relative z-10 flex items-center justify-between px-8 py-6 fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex items-center gap-3">
              <img src="/brand/IKA-logo-bg.png" alt="IKA Logo" className="h-16 w-auto" />
              <div className="hidden sm:block">
                <p className="text-navy-800 font-bold text-sm leading-tight">International Knowledge Academy</p>
                <p className="text-gold-600 text-[10px] font-medium tracking-wide">for Training & Management Development</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 border border-gold-300 rounded-full px-4 py-1.5 bg-gold-50">
              Coming Soon
            </span>
          </header>

          {/* Main */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-10">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5 fade-up" style={{ animationDelay: "0.15s" }}>
              <span className="w-10 h-px" style={{ background: "linear-gradient(90deg, transparent, #D3AB5C)" }} />
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600">
                We're Working on Something
              </p>
              <span className="w-10 h-px" style={{ background: "linear-gradient(90deg, #D3AB5C, transparent)" }} />
            </div>

            {/* Heading */}
            <h1
              className="text-5xl md:text-7xl font-black mb-4 leading-[1.05] fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <span className="text-navy-800">Something Big</span>
              <br />
              <span className="shimmer-text">Is Coming.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-navy-400 text-base md:text-lg mb-12 max-w-md leading-relaxed fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              We're building something extraordinary. Drop your email and be the first to know when we launch.
            </p>

            {/* Email form */}
            <div className="fade-up w-full max-w-md" style={{ animationDelay: "0.45s" }}>
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 rounded-full px-2 py-2"
                  style={{ border: "1.5px solid #e6c676", background: "#fffdf7" }}
                >
                  <MdEmail size={18} className="ml-3 flex-shrink-0 text-gold-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 text-sm outline-none bg-transparent min-w-0 text-navy-800 placeholder-navy-300"
                    style={{ caretColor: "#D3AB5C" }}
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #e6c676, #D3AB5C, #b8934a)",
                      boxShadow: "0 4px 20px #D3AB5C40",
                    }}
                  >
                    Notify Me
                  </button>
                </form>
              ) : (
                <div
                  className="inline-flex items-center gap-2 font-semibold text-sm rounded-full px-6 py-3"
                  style={{ color: "#b8934a", border: "1.5px solid #e6c676", background: "#fbf5e8" }}
                >
                  You're on the list — we'll be in touch!
                </div>
              )}
            </div>

          </main>

          {/* Footer */}
          <footer
            className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-5 fade-up"
            style={{ animationDelay: "0.75s", borderTop: "1px solid #f4e6c2" }}
          >
            <p className="text-xs text-navy-300 text-center sm:text-left">
              © {new Date().getFullYear()} International Knowledge Academy. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/ika.academy?igsh=YWN4eTBqdHMxN2Nj&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold-500 bg-gold-50 transition-all hover:-translate-y-0.5 hover:border-gold-700 hover:bg-gold-100"
              >
                <FaInstagram size={15} style={{ color: "#b8934a" }} />
              </a>
              <a
                href="https://x.com/internatio86032?s=11&t=FiEYk1tKhME8U_rENQfVOA"
                target="_blank"
                rel="noreferrer"
                title="X (Twitter)"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold-500 bg-gold-50 transition-all hover:-translate-y-0.5 hover:border-gold-700 hover:bg-gold-100"
              >
                <FaXTwitter size={15} style={{ color: "#b8934a" }} />
              </a>
              <a
                href="https://www.snapchat.com/add/ika.academy?share_id=rxFv-CM6ThGReTcwUW0mJw&locale=en_MY"
                target="_blank"
                rel="noreferrer"
                title="Snapchat"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold-500 bg-gold-50 transition-all hover:-translate-y-0.5 hover:border-gold-700 hover:bg-gold-100"
              >
                <FaSnapchat size={15} style={{ color: "#b8934a" }} />
              </a>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ComingSoon;
