// @ts-nocheck
import React from "react";
import { MdClose } from "react-icons/md";
import Button from "components/ui/buttons/Button";
import DangerButton from "components/ui/buttons/DangerButton";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  icon,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-overlay-20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-navy-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {icon && (
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <p className="text-sm text-gray-600 pt-3">{message}</p>
            </div>
          )}
          {!icon && (
            <p className="text-sm text-gray-600 mb-6">{message}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              text={cancelText}
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <DangerButton
              text={loading ? `${confirmText}...` : confirmText}
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
