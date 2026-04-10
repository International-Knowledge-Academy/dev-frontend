// @ts-nocheck
import { MdWarning } from "react-icons/md";
import type { Category } from "types/category";
import ConfirmModal from "components/ui/modals/ConfirmModal";

interface DeleteCategoryModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteCategoryModal = ({ open, category, onClose, onConfirm, loading }: DeleteCategoryModalProps) => {
  if (!category) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete Category"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-navy-800 dark:text-white">{category.name}</span>?
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

export default DeleteCategoryModal;
