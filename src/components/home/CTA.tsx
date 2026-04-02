// @ts-nocheck
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 px-6 bg-navy-900 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500 opacity-5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="text-gold-400 font-semibold text-sm uppercase tracking-widest">
          Get Started Today
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight">
          Ready to Take Control?
        </h2>
        <p className="text-navy-300 text-lg mb-10">
          Sign in to access your dashboard and start managing your team and data right away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/sign-in"
            className="bg-gold-500 text-navy-900 font-bold px-10 py-4 rounded-full hover:bg-gold-400 transition shadow-lg shadow-gold-500/20 text-base"
          >
            Sign In Now
          </Link>
          <Link
            to="/about"
            className="border border-navy-500 text-white font-semibold px-10 py-4 rounded-full hover:border-gold-400 hover:text-gold-400 transition text-base"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
