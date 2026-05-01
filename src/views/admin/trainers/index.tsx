// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPersonAdd, MdEdit, MdDelete, MdRefresh,
  MdPerson, MdEmail, MdToggleOn, MdSettings,
} from "react-icons/md";
import useUsers from "hooks/users/useUsers";
import useDeleteUser from "hooks/users/useDeleteUser";
import DeleteTrainerModal from "./components/DeleteTrainerModal";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import { useToast } from "context/ToastContext";
import type { User } from "types/auth";

const TrainersPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { users, count, loading, error, params, setParams, refetch } = useUsers({ role: "trainer" });
  const { deleteUser, loading: deleting } = useDeleteUser();

  const [deleteOpen, setDeleteOpen]           = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<User | null>(null);

  const openDelete = (trainer: User) => { setSelectedTrainer(trainer); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selectedTrainer) return;
    const ok = await deleteUser(selectedTrainer.uid);
    if (ok) {
      setDeleteOpen(false);
      setSelectedTrainer(null);
      addToast(`${selectedTrainer.name} has been deleted`, "success");
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 max-w-5xl mx-auto">

      <div className="px-4 sm:px-6 pt-4">

        {/* Desktop toolbar */}
        <div className="hidden sm:flex items-center gap-2 py-3">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search trainers..."
          />
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="p-2.5"
          />
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="dark-navy"
              text="Add Trainer"
              icon={<MdPersonAdd />}
              onClick={() => navigate("/admin/trainers/create")}
            />
            <span className="text-sm text-slate-400">{count} trainers</span>
          </div>
        </div>

        {/* Mobile row */}
        <div className="flex sm:hidden items-center gap-2 py-3">
          <div className="flex-1">
            <SearchInput
              value={params.search ?? ""}
              onChange={(val) => setParams({ search: val })}
              placeholder="Search trainers..."
            />
          </div>
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="p-2.5"
          />
          <Button
            variant="dark-navy"
            text="Add Trainer"
            icon={<MdPersonAdd />}
            onClick={() => navigate("/admin/trainers/create")}
          />
        </div>

      </div>

      <Divider />

      {/* Table */}
      <div className="pb-5 px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">

          {loading ? (
            <Loading text="Fetching trainers..." />
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<MdPerson />}
              title="No trainers found"
              description="Try adjusting your search or add a new trainer."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {[
                      { label: "Trainer", icon: <MdPerson   size={14} /> },
                      { label: "Email",   icon: <MdEmail    size={14} /> },
                      { label: "Status",  icon: <MdToggleOn size={14} /> },
                      { label: "Actions", icon: <MdSettings size={14} /> },
                    ].map(({ label, icon }) => (
                      <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                        <span className="flex items-center gap-1.5">{icon}{label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((trainer) => (
                    <tr
                      key={trainer.uid}
                      onClick={() => navigate(`/admin/trainers/${trainer.uid}`)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      {/* Trainer */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {trainer.profile?.profile_picture ? (
                            <img
                              src={trainer.profile.profile_picture}
                              alt={trainer.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-600 border border-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {trainer.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                            </div>
                          )}
                          <span className="font-medium text-navy-800 truncate">{trainer.name}</span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-5 py-3.5 text-slate-500 truncate">{trainer.email}</td>
                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          trainer.is_active
                            ? "bg-green-50 text-green-600 border-green-600"
                            : "bg-red-50 text-red-500 border-red-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${trainer.is_active ? "bg-green-500" : "bg-red-400"}`} />
                          {trainer.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/trainers/${trainer.uid}/edit`)}
                            className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
                            title="Edit"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(trainer)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Page {params.page ?? 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <PrevButton
                  text="Previous"
                  disabled={!params.page || params.page <= 1}
                  onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                />
                <NextButton
                  text="Next"
                  disabled={(params.page ?? 1) >= totalPages}
                  onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      <DeleteTrainerModal
        open={deleteOpen}
        trainer={selectedTrainer}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default TrainersPage;
