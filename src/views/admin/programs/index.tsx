// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdEdit, MdDelete, MdRefresh,
  MdWorkspacePremium, MdToggleOn, MdSettings,
  MdLocationOn, MdLayers, MdPersonAdd,
} from "react-icons/md";
import usePrograms from "hooks/programs/usePrograms";
import useDeleteProgram from "hooks/programs/useDeleteProgram";
import DeleteProgramModal from "./components/DeleteProgramModal";
import AssignTrainerModal from "./components/AssignTrainerModal";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import { useToast } from "context/ToastContext";
import type { Program } from "types/program";

const TYPE_OPTIONS = [
  { value: "course",     label: "Training Course" },
  { value: "diploma",    label: "Training Diploma" },
  { value: "contracted", label: "Contracted Course" },
];
const LEVEL_OPTIONS = [
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
];
const STATUS_OPTIONS = [
  { value: "upcoming",  label: "Upcoming" },
  { value: "ongoing",   label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-600",
  ongoing:   "bg-green-50 text-green-600 border-green-600",
  completed: "bg-gray-100 text-gray-500 border-slate-500",
  cancelled: "bg-red-50 text-red-500 border-red-500",
};

const typeBadge: Record<string, string> = {
  course:     "bg-navy-50 text-navy-600 border-navy-600",
  diploma:    "bg-gold-50 text-gold-600 border-gold-600",
  contracted: "bg-purple-50 text-purple-600 border-purple-600",
};

const levelBadge: Record<string, string> = {
  beginner:     "bg-emerald-50 text-emerald-600",
  intermediate: "bg-amber-50 text-amber-600",
  advanced:     "bg-purple-50 text-purple-600",
};

const ProgramsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { programs, count, loading, error, params, setParams, refetch } = usePrograms();
  const { deleteProgram, loading: deleting } = useDeleteProgram();

  const [deleteOpen, setDeleteOpen]           = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [assignOpen, setAssignOpen]           = useState(false);
  const [assignProgram, setAssignProgram]     = useState<Program | null>(null);

  const openDelete = (program: Program) => { setSelectedProgram(program); setDeleteOpen(true); };
  const openAssign = (program: Program) => { setAssignProgram(program); setAssignOpen(true); };

  const handleDelete = async () => {
    if (!selectedProgram) return;
    const ok = await deleteProgram(selectedProgram.uid);
    if (ok) {
      setDeleteOpen(false);
      setSelectedProgram(null);
      addToast(`"${selectedProgram.name}" has been deleted`, "success");
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 max-w-5xl mx-auto">

      {/* Toolbar */}
      <div className="px-4 sm:px-6 pt-4">

        {/* Command bar: primary action + count */}
        <div className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-navy-50 flex items-center justify-center text-navy-600 flex-shrink-0">
              <MdWorkspacePremium size={15} />
            </div>
            <span className="text-xs font-semibold text-navy-700">{count} Programs</span>
          </div>
          <Button
            variant="dark-navy"
            text="Add Program"
            icon={<MdAdd />}
            onClick={() => navigate("/admin/programs/create")}
          />
        </div>

        <div className="border-t border-slate-100" />

        {/* Search */}
        <div className="pt-3">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search programs..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap py-3">
          <FilterSelectField
            value={params.program_type ?? "all"}
            onChange={(val) => setParams({ program_type: val === "all" ? undefined : val })}
            icon={MdWorkspacePremium}
            defaultOption="All Types"
            options={TYPE_OPTIONS}
          />
          <FilterSelectField
            value={params.status ?? "all"}
            onChange={(val) => setParams({ status: val === "all" ? undefined : val })}
            icon={MdSettings}
            defaultOption="All Status"
            options={STATUS_OPTIONS}
          />
          <FilterSelectField
            value={params.level ?? "all"}
            onChange={(val) => setParams({ level: val === "all" ? undefined : val })}
            icon={MdSettings}
            defaultOption="All Levels"
            options={LEVEL_OPTIONS}
          />
          <FilterSelectField
            value={params.is_active === undefined ? "all" : String(params.is_active)}
            onChange={(val) => setParams({ is_active: val === "all" ? undefined : val === "true" })}
            icon={MdToggleOn}
            defaultOption="All"
            options={[
              { value: "true",  label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-gray-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-gray-700"
            hoverBorderColor="hover:border-slate-300"
            className="p-2.5"
          />
        </div>

      </div>

      <Divider />

      {/* Table */}
      <div className="pb-5 px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <Loading text="Fetching programs..." />
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
          ) : programs.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">No programs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {[
                      { label: "Program",  icon: <MdWorkspacePremium size={14} /> },
                      { label: "Type",     icon: <MdWorkspacePremium size={14} /> },
                      { label: "Field",    icon: <MdLayers size={14} /> },
                      { label: "Location", icon: <MdLocationOn size={14} /> },
                      { label: "Level",    icon: <MdSettings size={14} /> },
                      { label: "Status",   icon: <MdSettings size={14} /> },
                      { label: "Active",   icon: <MdToggleOn size={14} /> },
                      { label: "Actions",  icon: <MdSettings size={14} /> },
                    ].map(({ label, icon }) => (
                      <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                        <span className="flex items-center gap-1.5">{icon}{label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {programs.map((program) => (
                    <tr key={program.uid} onClick={() => navigate(`/admin/programs/${program.uid}`)} className="hover:bg-gray-50 transition cursor-pointer">

                      {/* Program name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 flex-shrink-0">
                            <MdWorkspacePremium size={16} />
                          </div>
                          <div>
                            <p className="font-medium text-navy-800 max-w-[140px] sm:max-w-[200px] truncate" title={program.name}>
                              {program.name}
                            </p>
                            {program.duration && (
                              <p className="text-xs text-gray-400">{program.duration}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeBadge[program.program_type] ?? "bg-gray-50 text-gray-500 border-slate-200"}`}>
                          {program.program_type_display ?? program.program_type}
                        </span>
                      </td>

                      {/* Field */}
                      <td className="px-5 py-3.5">
                        <span className="text-gray-600 text-sm">
                          {program.field?.name ?? "—"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5">
                        <span className="text-gray-600 text-sm">
                          {program.location ? `${program.location.city}, ${program.location.country}` : "—"}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${levelBadge[program.level] ?? "bg-gray-50 text-gray-500"}`}>
                          {program.level_display ?? program.level}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge[program.status] ?? "bg-gray-50 text-gray-500 border-slate-200"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {program.status_display ?? program.status}
                        </span>
                      </td>

                      {/* Active */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          program.is_active
                            ? "bg-green-50 text-green-600 border-green-600"
                            : "bg-red-50 text-red-500 border-red-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${program.is_active ? "bg-green-500" : "bg-red-400"}`} />
                          {program.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openAssign(program)}
                            className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 hover:text-green-700 transition"
                            title="Assign Trainer"
                          >
                            <MdPersonAdd size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/programs/${program.uid}/edit`)}
                            className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
                            title="Edit"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(program)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
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
              <p className="text-xs text-gray-400">
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

      <DeleteProgramModal
        open={deleteOpen}
        program={selectedProgram}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <AssignTrainerModal
        open={assignOpen}
        program={assignProgram}
        onClose={() => setAssignOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ProgramsPage;
