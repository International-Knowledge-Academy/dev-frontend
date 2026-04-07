// @ts-nocheck
import heroBg from "assets/videos/training-bg-2.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={heroBg}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gold-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
          International Knowledge Academy
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
          Invest in Your Employees
          <span className="block text-gold-400 mt-2">Invest in Your Future</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
          IKA delivers high-quality training programs that blend deep knowledge with practical
          experience — empowering professionals across 10 countries and 20 specialized fields.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:info@ika-edu.com"
            className="bg-gold-500 text-navy-900 font-bold px-10 py-4 rounded-full hover:bg-gold-400 transition shadow-lg shadow-gold-500/30 text-base"
          >
            Request a Program
          </a>
          <a
            href="#about"
            className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/20 hover:border-gold-400 transition text-base"
          >
            Learn More
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
