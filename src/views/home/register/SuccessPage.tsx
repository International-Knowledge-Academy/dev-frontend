// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { CheckCircle2, GraduationCap } from "lucide-react";
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";

const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-navy-800 mb-2">Registration Submitted!</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Thank you for your interest. Our team will review your registration and contact you shortly to confirm your enrollment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/programs")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700 transition"
            >
              <GraduationCap size={15} />
              Browse More Programs
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterSuccessPage;
