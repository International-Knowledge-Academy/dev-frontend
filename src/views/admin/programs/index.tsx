// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award, Layers, Calendar, Monitor, UserPlus, Plus, Pencil, Trash2,
  RefreshCw, Filter, X, Activity, CheckCircle,
} from "lucide-react";
import usePrograms from "hooks/programs/usePrograms";
import useDeleteProgram from "hooks/programs/useDeleteProgram";
import DeleteProgramModal from "./components/DeleteProgramModal";
import AssignTrainerModal from "./components/AssignTrainerModal";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import PageHeader from "components/ui/PageHeader";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import InputField from "components/form/InputField";
import SearchableDropdown from "components/form/search/SearchableDropdown";
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
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  ongoing:   "bg-green-50 text-green-600 border-green-200",
  completed: "bg-slate-100 text-slate-500 border-slate-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const modeBadge: Record<string, string> = {
  online:  "bg-cyan-50 text-cyan-600 border-cyan-200",
  offline: "bg-orange-50 text-orange-600 border-orange-200",
  hybrid:  "bg-teal-50 text-teal-600 border-teal-200",
};

const formatDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

/* ─── Stat card ─────────────────────────────────────────────────────────── */

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

/* ─── Main page ─────────────────────────────────────────────────────────── */

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

  const ongoingCount = programs.filter((p) => p.status === "ongoing").length;
  const activeCount  = programs.filter((p) => p.is_active).length;

  const activeFilterCount = [
    !!params.program_type,
    !!params.status,
    !!params.level,
    !!params.mode,
    params.is_active !== undefined,
  ].filter(Boolean).length;

  const hasAnyFilter = activeFilterCount > 0 || !!params.search;

  const clearAllFilters = () =>
    setParams({ program_type: undefined, status: undefined, level: undefined, mode: undefined, is_active: undefined, search: undefined });

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <PageHeader
        title="Training Programs"
        subtitle="Manage your training courses, diplomas, and contracted programs"
        actions={
          <Button
            variant="dark-navy"
            text="Add Program"
            icon={<Plus size={15} />}
            onClick={() => navigate("/admin/programs/create")}
          />
        }
        className="mb-4 px-0 sm:px-0"
      />

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <StatCard icon={Award}        label="Total Programs" value={count}        />
        <StatCard icon={Activity}     label="Ongoing"        value={ongoingCount} accent />
        <StatCard icon={CheckCircle}  label="Active"         value={activeCount}  />
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">

        {/* Row 1 — search + actions */}
        <div className="flex items-center gap-2">

          {/* Desktop: label + badge */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy-700 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          {/* Search — always visible */}
          <InputField
            field="search"
            placeholder="Search programs..."
            formData={{ search: params.search ?? "" }}
            errors={{}}
            updateFormData={(_, v) => setParams({ search: v || undefined })}
            required={false}
            wrapperClassName="flex-1"
          />

          <div className="hidden sm:block w-px h-5 bg-slate-200" />

          {/* Desktop: refresh */}
          <IconButton
            onClick={refetch}
            icon={<RefreshCw size={15} />}
            bgColor="bg-white"
            textColor="text-slate-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-slate-700"
            hoverBorderColor="hover:border-slate-300"
            className="hidden sm:flex p-2 flex-shrink-0"
          />

          {/* Desktop: clear all */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition whitespace-nowrap flex-shrink-0"
            >
              <X size={12} />
              Clear all
            </button>
          )}

          {/* Desktop: showing */}
          {!loading && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              Showing{" "}
              <span className="font-semibold text-slate-600">{programs.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-slate-600">{count}</span>
            </span>
          )}

          {/* Mobile: filter toggle button */}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative sm:hidden flex-shrink-0 p-2 rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-navy-700 text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2 — desktop filter selects (always visible) */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100">
          <div className="min-w-[150px]">
            <SearchableDropdown
              field="program_type"
              options={[{ value: "", label: "All Types" }, ...TYPE_OPTIONS]}
              formData={{ program_type: params.program_type ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ program_type: v || undefined })}
              placeholder="All Types"
              required={false}
            />
          </div>
          <div className="min-w-[150px]">
            <SearchableDropdown
              field="status"
              options={[{ value: "", label: "All Status" }, ...STATUS_OPTIONS]}
              formData={{ status: params.status ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ status: v || undefined })}
              placeholder="All Status"
              required={false}
            />
          </div>
          <div className="min-w-[150px]">
            <SearchableDropdown
              field="level"
              options={[{ value: "", label: "All Levels" }, ...LEVEL_OPTIONS]}
              formData={{ level: params.level ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ level: v || undefined })}
              placeholder="All Levels"
              required={false}
            />
          </div>
          <div className="min-w-[150px]">
            <SearchableDropdown
              field="mode"
              options={[{ value: "", label: "All Modes" }, ...MODE_OPTIONS]}
              formData={{ mode: params.mode ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ mode: v || undefined })}
              placeholder="All Modes"
              required={false}
            />
          </div>
          <div className="min-w-[130px]">
            <SearchableDropdown
              field="is_active"
              options={[
                { value: "",      label: "All"      },
                { value: "true",  label: "Active"   },
                { value: "false", label: "Inactive" },
              ]}
              formData={{ is_active: params.is_active === undefined ? "" : String(params.is_active) }}
              errors={{}}
              updateFormData={(_, v) => setParams({ is_active: v === "" ? undefined : v === "true" })}
              placeholder="All"
              required={false}
            />
          </div>
        </div>

        {/* Mobile: expanded filter panel */}
        {filtersOpen && (
          <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <SearchableDropdown
              field="program_type"
              options={[{ value: "", label: "All Types" }, ...TYPE_OPTIONS]}
              formData={{ program_type: params.program_type ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ program_type: v || undefined })}
              placeholder="All Types"
              required={false}
            />
            <SearchableDropdown
              field="status"
              options={[{ value: "", label: "All Status" }, ...STATUS_OPTIONS]}
              formData={{ status: params.status ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ status: v || undefined })}
              placeholder="All Status"
              required={false}
            />
            <SearchableDropdown
              field="level"
              options={[{ value: "", label: "All Levels" }, ...LEVEL_OPTIONS]}
              formData={{ level: params.level ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ level: v || undefined })}
              placeholder="All Levels"
              required={false}
            />
            <SearchableDropdown
              field="mode"
              options={[{ value: "", label: "All Modes" }, ...MODE_OPTIONS]}
              formData={{ mode: params.mode ?? "" }}
              errors={{}}
              updateFormData={(_, v) => setParams({ mode: v || undefined })}
              placeholder="All Modes"
              required={false}
            />
            <SearchableDropdown
              field="is_active"
              options={[
                { value: "",      label: "All"      },
                { value: "true",  label: "Active"   },
                { value: "false", label: "Inactive" },
              ]}
              formData={{ is_active: params.is_active === undefined ? "" : String(params.is_active) }}
              errors={{}}
              updateFormData={(_, v) => setParams({ is_active: v === "" ? undefined : v === "true" })}
              placeholder="All"
              required={false}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={refetch}
                  icon={<RefreshCw size={14} />}
                  bgColor="bg-white"
                  textColor="text-slate-500"
                  borderColor="border-slate-200"
                  hoverTextColor="hover:text-slate-700"
                  hoverBorderColor="hover:border-slate-300"
                  className="p-2"
                />
                {hasAnyFilter && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    <X size={12} />
                    Clear all
                  </button>
                )}
              </div>
              {!loading && (
                <span className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-600">{programs.length}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-slate-600">{count}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {loading ? (
              <Loading text="Fetching programs..." />
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
            ) : programs.length === 0 ? (
              <EmptyState
                icon={<Award />}
                title="No programs found"
                description="Try adjusting your search or filters to find training programs."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Program", icon: <Award    size={13} /> },
                        { label: "Field",   icon: <Layers   size={13} /> },
                        { label: "Mode",    icon: <Monitor  size={13} /> },
                        { label: "Status",  icon: <Activity size={13} /> },
                        { label: "Dates",   icon: <Calendar size={13} /> },
                        { label: "Actions", icon: null },
                      ].map(({ label, icon }) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-xs font-bold tracking-widest uppercase text-slate-400"
                        >
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
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >

                        {/* Program */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 flex-shrink-0 group-hover:bg-navy-100 transition-colors">
                              <Award size={16} />
                            </div>
                            <span className="font-semibold text-navy-800 truncate max-w-[160px]" title={program.name}>
                              {program.name}
                            </span>
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
                              <span className="text-slate-600 truncate max-w-[120px]" title={program.field.name}>
                                {program.field.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Mode */}
                        <td className="px-5 py-3.5">
                          {program.mode ? (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${modeBadge[program.mode] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                              {program.mode_display ?? program.mode}
                            </span>
                          ) : <span className="text-slate-300">—</span>}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${statusBadge[program.status] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
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
                              className="p-1.5 rounded-md text-slate-400 hover:bg-green-50 hover:text-green-600 transition"
                              title="Assign Trainer"
                            >
                              <UserPlus size={14} />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/programs/${program.uid}/edit`)}
                              className="p-1.5 rounded-md text-slate-400 hover:bg-navy-50 hover:text-navy-700 transition"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => openDelete(program)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
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
