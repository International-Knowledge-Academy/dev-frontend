// @ts-nocheck
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-navy-700 opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold-500 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-navy-700 border border-gold-500/30 text-gold-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
          Platform Now Live
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Manage Your Work
          <span className="block text-gold-400 mt-2">Smarter & Faster</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-navy-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          A powerful platform built for teams — track progress, manage roles,
          and grow your business with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/sign-in"
            className="bg-gold-500 text-navy-900 font-bold px-10 py-4 rounded-full hover:bg-gold-400 transition shadow-lg shadow-gold-500/20 text-base"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="border border-navy-400 text-white font-semibold px-10 py-4 rounded-full hover:border-gold-400 hover:text-gold-400 transition text-base"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-xl mx-auto border-t border-navy-700 pt-10">
          {[
            { value: "10K+", label: "Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-extrabold text-gold-400">{stat.value}</p>
              <p className="text-sm text-navy-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
