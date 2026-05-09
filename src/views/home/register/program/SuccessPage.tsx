// @ts-nocheck
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, GraduationCap, Home, Mail } from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full">

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Gold top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

            <div className="px-10 py-12 text-center">

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={36} className="text-green-500" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                custom={0.3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-2xl font-extrabold text-navy-800 mb-3"
              >
                Registration Submitted!
              </motion.h1>

              <motion.p
                custom={0.38}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-slate-500 text-sm leading-relaxed mb-8"
              >
                Thank you for registering with IKA. Our team will review your application
                and reach out to confirm your enrollment. Keep an eye on your inbox.
              </motion.p>

              {/* What's next */}
              <motion.div
                custom={0.46}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-slate-50 border border-slate-100 rounded-xl px-6 py-5 text-left mb-8 space-y-3"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  What happens next
                </p>
                {[
                  { icon: <Mail size={14} />, text: "You'll receive a confirmation email within 24 hours." },
                  { icon: <CheckCircle2 size={14} />, text: "Our team reviews and approves your registration." },
                  { icon: <GraduationCap size={14} />, text: "Complete the program and receive your IKA certificate." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-gold-500 mt-0.5 flex-shrink-0">{item.icon}</span>
                    <span className="text-slate-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Actions */}
              <motion.div
                custom={0.54}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3"
              >
                <button
                  type="button"
                  onClick={() => navigate("/programs")}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md lg:rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold transition-colors duration-200"
                >
                  <GraduationCap size={15} />
                  Browse More Programs
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md lg:rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors duration-200"
                >
                  <Home size={15} />
                  Back to Home
                </button>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterSuccessPage;
