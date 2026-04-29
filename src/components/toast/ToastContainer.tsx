// @ts-nocheck
import { useEffect, useState } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";
import { useToast } from "context/ToastContext";

const config = {
  success: {
    icon:    <MdCheckCircle size={18} />,
    iconCls: "bg-green-50 text-green-500",
    border:  "border-l-green-500",
    bar:     "bg-green-500",
    label:   "Success",
  },
  error: {
    icon:    <MdError size={18} />,
    iconCls: "bg-red-50 text-red-500",
    border:  "border-l-red-500",
    bar:     "bg-red-500",
    label:   "Error",
  },
  info: {
    icon:    <MdInfo size={18} />,
    iconCls: "bg-navy-50 text-navy-500",
    border:  "border-l-navy-600",
    bar:     "bg-navy-600",
    label:   "Info",
  },
};

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const c = config[toast.type];

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const exit  = setTimeout(() => setExiting(true), 3200);
    return () => { clearTimeout(enter); clearTimeout(exit); };
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`relative flex items-start gap-3 bg-white border border-gray-100 border-l-4 ${c.border} rounded-xl px-4 py-3.5 min-w-[300px] max-w-[360px] shadow-lg overflow-hidden transition-all duration-300 ease-out ${
        visible && !exiting
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-6"
      }`}
    >
      {/* Progress bar */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 ${c.bar} animate-[shrink_3.5s_linear_forwards]`}
      />

      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.iconCls}`}>
        {c.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs font-bold text-navy-700 leading-none mb-1">{c.label}</p>
        <p className="text-sm text-gray-500 leading-snug">{toast.message}</p>
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition flex-shrink-0"
      >
        <MdClose size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end">
      <style>{`@keyframes shrink { from { width: 100% } to { width: 0% } }`}</style>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
