// @ts-nocheck
import { MdCheckCircle } from "react-icons/md";

const highlights = [
  "Tailored programs designed for your organization's specific needs",
  "Delivered by industry-leading experts with real-world experience",
  "Flexible formats — on-site, remote, or intensive",
  "Internationally recognized accredited certificates",
];

const About = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <div>
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            About IKA
          </span>
          <h2 className="text-4xl font-extrabold text-navy-800 mt-3 leading-tight">
            International Knowledge Academy
            <span className="block text-gold-500 mt-1">for Training & Management Development</span>
          </h2>
          <p className="text-gray-500 mt-6 text-base leading-relaxed">
            IKA provides high-quality training programs that blend deep theoretical knowledge with
            practical experience. We believe that effective training is the cornerstone of
            organizational excellence — empowering individuals and transforming institutions.
          </p>
          <p className="text-gray-500 mt-4 text-base leading-relaxed italic border-l-4 border-gold-500 pl-4">
            "Invest in Your Employees and Invest in the Future of Your Institution."
          </p>

          {/* Highlights */}
          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                <MdCheckCircle size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — decorative card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gold-500 opacity-5 rounded-3xl blur-2xl" />
          <div className="relative bg-white border border-gray-100 shadow-sm rounded-3xl p-8 space-y-6">
            <img
              src="/brand/IKA-logo-bg.png"
              alt="IKA Logo"
              className="h-16 w-auto mx-auto"
            />
            <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-6 text-center">
              {[
                { value: "20+", label: "Training Fields" },
                { value: "10",  label: "Countries" },
                { value: "3",   label: "Program Types" },
                { value: "5★",  label: "Hotel Partnerships" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-extrabold text-gold-500">{s.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-5 text-center">
              <p className="text-gray-400 text-xs">
                Operating across the UAE, UK, Europe, Asia & the Middle East
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
