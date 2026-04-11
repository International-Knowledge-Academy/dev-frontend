// @ts-nocheck
import { MdWarning } from "react-icons/md";
import type { Course } from "types/course";
import ConfirmModal from "components/ui/modals/ConfirmModal";

interface DeleteCourseModalProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteCourseModal = ({ open, course, onClose, onConfirm, loading }: DeleteCourseModalProps) => {
  if (!course) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete Course"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-navy-800 dark:text-white">{course.name}</span>?
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

export default DeleteCourseModal;
