// @ts-nocheck
import { motion } from "framer-motion";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import Locations from "components/home/Locations";
import ContactHero from "components/contact/ContactHero";
import ContactCards from "components/contact/ContactCards";
import ContactForm from "components/contact/ContactForm";
import SocialLinks from "components/contact/SocialLinks";
import { MdInfo } from "react-icons/md";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="">
        <ContactHero />
      </div>

      {/* Contact Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <ContactCards />
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Form — 2 cols */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Sidebar — 1 col */}
          <div className="flex flex-col gap-6">

            {/* Social links */}
            <SocialLinks />

            {/* Quick info card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-3xl p-7"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-500 flex items-center justify-center flex-shrink-0">
                  <MdInfo size={18} />
                </div>
                <h4 className="text-navy-800 font-bold text-sm">Good to Know</h4>
              </div>
              <ul className="space-y-3">
                {[
                  "Programs run for 5 or 10 consecutive days",
                  "Held at 5-star hotel venues worldwide",
                  "Certificates are internationally accredited",
                  "Custom contracted programs available",
                  "Training delivered in English & Arabic",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-500 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Locations */}
      <Locations />

      <Footer />
    </div>
  );
};

export default ContactPage;
