// @ts-nocheck
import { MdEmail } from "react-icons/md";
import { SiWhatsapp } from "react-icons/si";

const CTA = () => {
  return (
    <section className="py-24 px-6 bg-gold-500 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="text-navy-800 font-semibold text-sm uppercase tracking-widest">
          Get In Touch
        </span>
        <h2 className="text-4xl font-extrabold text-navy-900 mt-3 leading-tight">
          Ready to Invest in Your Team?
        </h2>
        <p className="text-navy-800 mt-5 text-base leading-relaxed max-w-xl mx-auto">
          Contact us today to discuss a custom training program for your organization.
          Our team will help you find the right format, field, and schedule.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/601139936766"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-full transition shadow-lg shadow-green-500/20 text-sm"
          >
            <SiWhatsapp size={18} />
            WhatsApp Us
          </a>
          <a
            href="mailto:info@ika-edu.com"
            className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-full transition shadow-lg text-sm"
          >
            <MdEmail size={20} />
            Email Us
          </a>
        </div>

        {/* Contact details */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-navy-800 text-sm">
          <span>info@ika-edu.com</span>
          <span className="hidden sm:block">·</span>
          <span>+601139936766</span>
          <span className="hidden sm:block">·</span>
          <span>www.ika-edu.com</span>
        </div>
      </div>
    </section>
  );
};

export default CTA;
