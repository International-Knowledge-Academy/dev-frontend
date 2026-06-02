// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, RefreshCw, Pencil, Trash2, AlertTriangle,
  Users, MapPin, Briefcase, Phone,
} from "lucide-react";
import useTrainers from "hooks/trainers/useTrainers";
import useDeleteTrainer from "hooks/trainers/useDeleteTrainer";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import SearchInput from "components/form/SearchInput";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import type { TrainerBrief } from "types/trainer";

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-gold-50 border border-gold-200" : "bg-navy-50 border border-navy-100"}`}>
      <Icon size={18} className={accent ? "text-gold-500" : "text-navy-600"} />
    </div>
    <div className="min-w-0">
      <p className={`text-2xl font-extrabold tabular-nums leading-none ${accent ? "text-gold-500" : "text-navy-800"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</p>
    </div>
  </div>
);

const getAvatarUrl = (pic: any): string | null =>
  pic ? (typeof pic === "object" ? pic.public_url : pic) : null;

const TrainersPage = () => {
  const navigate     = useNavigate();
  const { addToast } = useToast();
  const { trainers, count, loading, error, params, setParams, refetch } = useTrainers();
  const { deleteTrainer, loading: deleting } = useDeleteTrainer();

  const [deleteTarget, setDeleteTarget] = useState<TrainerBrief | null>(null);

  const withLocation = trainers.filter((t) => t.country || t.city).length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteTrainer(deleteTarget.uid);
    if (ok) {
      addToast(`${deleteTarget.name} has been deleted`, "success");
      setDeleteTarget(null);
      refetch();
    } else {
      addToast("Failed to delete trainer", "error");
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
      <PageHeader
        title="Trainers"
        subtitle="Manage trainer profiles and assignments"
        actions={
          <Button
            variant="dark-navy"
            text="Add Trainer"
            icon={<UserPlus size={15} />}
            onClick={() => navigate("/admin/trainers/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Users}   label="Total Trainers" value={count}        />
        <StatCard icon={MapPin}  label="With Location"  value={withLocation} accent />
        <StatCard icon={Briefcase} label="On This Page" value={trainers.length} />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val, page: 1 })}
            placeholder="Search by name, title, location..."
            className="flex-1 max-w-xs"
          />
          <div className="flex-1" />
          <IconButton
            onClick={refetch}
            icon={<RefreshCw size={15} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="p-2 flex-shrink-0"
          />
          {!loading && (
            <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{trainers.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching trainers..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : trainers.length === 0 ? (
              <EmptyState
                icon={<Users size={28} />}
                title="No trainers found"
                description="Try adjusting your search or add a new trainer."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["Trainer", "Email", "Title", "Location", "WhatsApp", "Actions"].map((label) => (
                        <th key={label} className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {trainers.map((trainer) => (
                      <tr
                        key={trainer.uid}
                        onClick={() => navigate(`/admin/trainers/${trainer.uid}`)}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Trainer */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {getAvatarUrl(trainer.profile_picture) ? (
                              <img
                                src={getAvatarUrl(trainer.profile_picture)}
                                alt={trainer.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-100 group-hover:ring-gold-200 transition-all"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-700 font-bold text-xs flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                                {trainer.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                              </div>
                            )}
                            <span className="font-semibold text-navy-800 truncate" title={trainer.name}>
                              {trainer.name}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-3.5 text-slate-500 max-w-[200px]">
                          <span className="truncate block" title={trainer.email}>{trainer.email}</span>
                        </td>

                        {/* Title */}
                        <td className="px-5 py-3.5 text-slate-500 max-w-[180px]">
                          {trainer.title ? (
                            <span className="truncate block" title={trainer.title}>{trainer.title}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Location */}
                        <td className="px-5 py-3.5">
                          {trainer.city || trainer.country ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs">
                              <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                              {[trainer.city, trainer.country].filter(Boolean).join(", ")}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* WhatsApp */}
                        <td className="px-5 py-3.5">
                          {trainer.whatsapp ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs">
                              <Phone size={12} className="text-green-500 flex-shrink-0" />
                              <span className="truncate" title={trainer.whatsapp}>{trainer.whatsapp}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/admin/trainers/${trainer.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(trainer)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">Page {params.page ?? 1} of {totalPages}</p>
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
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Trainer"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-navy-800">{deleteTarget?.name}</span>?
            {" "}This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        icon={<AlertTriangle size={20} className="text-red-500" />}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default TrainersPage;
