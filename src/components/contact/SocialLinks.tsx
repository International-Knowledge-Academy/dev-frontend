// @ts-nocheck
import { motion } from "framer-motion";
import { FaInstagram, FaWhatsapp, FaSnapchatGhost, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    icon: <FaFacebook size={20} />,
    label: "Facebook",
    handle: "IKA Academy",
    href: "https://www.facebook.com/share/1bDy9Uv8uH/?mibextid=wwXIfr",
    color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
  {
    icon: <FaInstagram size={20} />,
    label: "Instagram",
    handle: "ika.academy",
    href: "https://www.instagram.com/ika.academy?igsh=YWN4eTBqdHMxN2Nj&utm_source=qr",
    color: "hover:bg-[#E1306C] hover:border-[#E1306C]",
  },
  {
    icon: <FaXTwitter size={20} />,
    label: "X (Twitter)",
    handle: "@internatio86032",
    href: "https://x.com/internatio86032?s=11&t=FiEYk1tKhME8U_rENQfVOA",
    color: "hover:bg-[#000000] hover:border-[#000000]",
  },
  {
    icon: <FaSnapchatGhost size={20} />,
    label: "Snapchat",
    handle: "ika.academy",
    href: "https://www.snapchat.com/add/ika.academy?share_id=rxFv-CM6ThGReTcwUW0mJw&locale=en_MY",
    color: "hover:bg-[#FFFC00] hover:border-[#FFFC00]",
  },
  {
    icon: <FaWhatsapp size={20} />,
    label: "WhatsApp",
    handle: "+601139936766",
    href: "https://wa.me/601139936766",
    color: "hover:bg-[#25D366] hover:border-[#25D366]",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const SocialLinks = () => {
  return (
    <div className="bg-navy-900 rounded-3xl p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative">
        <span className="text-gold-400 font-semibold text-xs uppercase tracking-widest">
          Follow Us
        </span>
        <h3 className="text-white font-extrabold text-xl mt-2 mb-6">
          Stay Connected
        </h3>

        <motion.div
          className="grid grid-cols-2 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
        >
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              variants={item}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className={`group flex items-center gap-3 bg-navy-800 border border-navy-700 text-white rounded-2xl px-4 py-3.5 transition-all duration-300 ${s.color} hover:text-white hover:border-transparent`}
            >
              <span className="flex-shrink-0">{s.icon}</span>
              <div>
                <p className="text-xs font-bold">{s.label}</p>
                <p className="text-xs text-navy-400 group-hover:text-white/70 transition-colors">
                  {s.handle}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SocialLinks;
