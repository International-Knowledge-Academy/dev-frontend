// @ts-nocheck
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import WhatsAppFloatButton from "components/home/WhatsAppFloatButton";

const HomeLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <WhatsAppFloatButton
        phone="601139936766"
        message="Hi IKA, I'd like to know more about your programs!"
      />
    </div>
  );
};

export default HomeLayout;
