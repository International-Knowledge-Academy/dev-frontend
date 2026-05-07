import { MdWarning } from "react-icons/md";
import type { User } from "types/auth";
import ConfirmModal from "components/ui/modals/ConfirmModal";

interface DeleteTrainerModalProps {
  open: boolean;
  trainer: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteTrainerModal = ({ open, trainer, onClose, onConfirm, loading }: DeleteTrainerModalProps) => {
  if (!trainer) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete Trainer"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-navy-800">{trainer.name}</span>?
          {" "}This action cannot be undone.
        </>
      }
      confirmText="Delete"
      cancelText="Cancel"
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default DeleteTrainerModal;
