// @ts-nocheck
import { useEffect, useState } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";
import { useToast } from "context/ToastContext";

const icons = {
  success: <MdCheckCircle size={18} className="text-green-500 flex-shrink-0" />,
  error:   <MdError       size={18} className="text-red-500   flex-shrink-0" />,
  info:    <MdInfo        size={18} className="text-blue-500  flex-shrink-0" />,
};

const bars = {
  success: "bg-green-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
};

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`relative flex items-start gap-3 bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 rounded-lg px-4 py-3 min-w-[280px] max-w-sm overflow-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >

      <span className={`absolute bottom-0 left-0 h-0.5 w-full ${bars[toast.type]} animate-[shrink_3.5s_linear_forwards]`} />

      {icons[toast.type]}
      <p className="text-sm text-navy-800 dark:text-white leading-snug flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 text-gray-400 hover:text-gray-600 transition"
      >
        <MdClose size={15} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end">
      <style>{`@keyframes shrink { from { width:100% } to { width:0% } }`}</style>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
