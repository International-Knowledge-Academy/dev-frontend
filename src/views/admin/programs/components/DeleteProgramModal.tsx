// @ts-nocheck
import { MdWarning } from "react-icons/md";
import type { Program } from "types/program";
import ConfirmModal from "components/ui/modals/ConfirmModal";

interface DeleteProgramModalProps {
  open: boolean;
  program: Program | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteProgramModal = ({ open, program, onClose, onConfirm, loading }: DeleteProgramModalProps) => {
  if (!program) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete Program"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-navy-800 dark:text-white">{program.name}</span>?
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

export default DeleteProgramModal;
