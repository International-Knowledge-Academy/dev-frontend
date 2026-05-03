// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdEdit, MdDelete, MdRefresh, MdFilterList, MdClose,
  MdWorkspacePremium, MdToggleOn, MdSettings,
  MdLayers, MdPersonAdd, MdCalendarToday,
} from "react-icons/md";
import usePrograms from "hooks/programs/usePrograms";
import useDeleteProgram from "hooks/programs/useDeleteProgram";
import DeleteProgramModal from "./components/DeleteProgramModal";
import AssignTrainerModal from "./components/AssignTrainerModal";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
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
const MODE_OPTIONS = [
  { value: "online",  label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid",  label: "Hybrid" },
];

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-600",
  ongoing:   "bg-green-50 text-green-600 border-green-600",
  completed: "bg-slate-100 text-slate-500 border-slate-400",
  cancelled: "bg-red-50 text-red-500 border-red-500",
};

const typeBadge: Record<string, string> = {
  course:     "bg-navy-50 text-navy-600 border-navy-600",
  diploma:    "bg-gold-50 text-gold-600 border-gold-600",
  contracted: "bg-purple-50 text-purple-600 border-purple-600",
};

const modeBadge: Record<string, string> = {
  online:  "bg-cyan-50 text-cyan-600 border-cyan-600",
  offline: "bg-orange-50 text-orange-600 border-orange-600",
  hybrid:  "bg-teal-50 text-teal-600 border-teal-600",
};

const formatDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

const ProgramsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { programs, count, loading, error, params, setParams, refetch } = usePrograms();
  const { deleteProgram, loading: deleting } = useDeleteProgram();

  const [deleteOpen, setDeleteOpen]           = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [assignOpen, setAssignOpen]           = useState(false);
  const [assignProgram, setAssignProgram]     = useState<Program | null>(null);
  const [filtersOpen, setFiltersOpen]         = useState(false);

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

  const hasActiveFilters = !!(params.program_type || params.status || params.level || params.mode || params.is_active !== undefined);
  const clearFilters = () => setParams({ program_type: undefined, status: undefined, level: undefined, mode: undefined, is_active: undefined });

  const totalPages = Math.ceil(count / 10);

  const filterControls = (
    <>
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
        icon={MdLayers}
        defaultOption="All Levels"
        options={LEVEL_OPTIONS}
      />
      <FilterSelectField
        value={params.mode ?? "all"}
        onChange={(val) => setParams({ mode: val === "all" ? undefined : val })}
        icon={MdSettings}
        defaultOption="All Modes"
        options={MODE_OPTIONS}
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
    </>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 max-w-5xl mx-auto">

      <div className="px-4 sm:px-6 pt-4">

        {/* Desktop toolbar — wraps when filters overflow */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 py-3">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search programs..."
          />
          {filterControls}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md lg:rounded-lg px-2.5 py-2 transition"
            >
              <MdClose size={13} /> Clear
            </button>
          )}
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
              text="Add Program"
              icon={<MdAdd />}
              onClick={() => navigate("/admin/programs/create")}
            />
            <span className="text-sm text-slate-400">{count} programs</span>
          </div>
        </div>

        {/* Mobile row 1 — search + filter toggle */}
        <div className="flex sm:hidden items-center gap-2 py-3">
          <div className="flex-1">
            <SearchInput
              value={params.search ?? ""}
              onChange={(val) => setParams({ search: val })}
              placeholder="Search programs..."
            />
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="p-2.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
            >
              <MdFilterList size={18} />
            </button>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-navy-600 border-2 border-white" />
            )}
          </div>
        </div>

        {/* Mobile filter panel */}
        {filtersOpen && (
          <div className="flex sm:hidden flex-wrap gap-2 pb-3">
            {filterControls}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md lg:rounded-lg px-2.5 py-2 transition"
              >
                <MdClose size={13} /> Clear
              </button>
            )}
          </div>
        )}

        {/* Mobile row 2 — actions */}
        <div className="flex sm:hidden items-center gap-2 pb-3">
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
              text="Add Program"
              icon={<MdAdd />}
              onClick={() => navigate("/admin/programs/create")}
            />
            <span className="text-sm text-slate-400">{count} programs</span>
          </div>
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
            <EmptyState
              icon={<MdWorkspacePremium />}
              title="No programs found"
              description="Try adjusting your search or filters to find training programs."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {[
                      { label: "Program",  icon: <MdWorkspacePremium size={14} /> },
                      { label: "Field",    icon: <MdLayers           size={14} /> },
                      { label: "Mode",     icon: <MdSettings         size={14} /> },
                      { label: "Status",   icon: <MdSettings         size={14} /> },
                      { label: "Dates",    icon: <MdCalendarToday    size={14} /> },
                      { label: "Actions",  icon: <MdSettings         size={14} /> },
                    ].map(({ label, icon }) => (
                      <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                        <span className="flex items-center gap-1.5">{icon}{label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {programs.map((program) => (
                    <tr
                      key={program.uid}
                      onClick={() => navigate(`/admin/programs/${program.uid}`)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >

                      {/* Program */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md lg:rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 flex-shrink-0">
                            <MdWorkspacePremium size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-navy-800 max-w-[160px] truncate" title={program.name}>
                              {program.name}
                            </p>
                          
                          </div>
                        </div>
                      </td>

                      {/* Field */}
                      <td className="px-5 py-3.5">
                        {program.field ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: program.field.hex_color ?? "#94a3b8" }}
                            />
                            <span className="text-slate-600 truncate max-w-[120px]">{program.field.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Mode */}
                      <td className="px-5 py-3.5">
                        {program.mode ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${modeBadge[program.mode] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            {program.mode_display ?? program.mode}
                          </span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${statusBadge[program.status] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {program.status_display ?? program.status}
                          </span>
                          {!program.is_active && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-500 border border-red-200 w-fit">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {program.start_date || program.end_date ? (
                          <>{formatDate(program.start_date) ?? "—"} → {formatDate(program.end_date) ?? "—"}</>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
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
