// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdEdit, MdDelete, MdRefresh, MdVisibility,
  MdSchool, MdToggleOn, MdSettings,
  MdLocationOn, MdCategory,
} from "react-icons/md";
import useCourses from "hooks/courses/useCourses";
import useDeleteCourse from "hooks/courses/useDeleteCourse";
import DeleteCourseModal from "./components/DeleteCourseModal";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import { useToast } from "context/ToastContext";
import type { Course } from "types/course";

const LEVEL_OPTIONS  = [
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
];
const MODE_OPTIONS   = [
  { value: "online",  label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid",  label: "Hybrid" },
];
const STATUS_OPTIONS = [
  { value: "upcoming",  label: "Upcoming" },
  { value: "ongoing",   label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  ongoing:   "bg-green-50 text-green-600 border-green-200",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const levelBadge: Record<string, string> = {
  beginner:     "bg-emerald-50 text-emerald-600",
  intermediate: "bg-amber-50 text-amber-600",
  advanced:     "bg-purple-50 text-purple-600",
};

const modeBadge: Record<string, string> = {
  online:  "bg-cyan-50 text-cyan-600",
  offline: "bg-orange-50 text-orange-600",
  hybrid:  "bg-indigo-50 text-indigo-600",
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { courses, count, loading, error, params, setParams, refetch } = useCourses();
  const { deleteCourse, loading: deleting } = useDeleteCourse();

  const [deleteOpen, setDeleteOpen]     = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openDelete = (course: Course) => { setSelectedCourse(course); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    const ok = await deleteCourse(selectedCourse.uid);
    if (ok) {
      setDeleteOpen(false);
      setSelectedCourse(null);
      addToast(`"${selectedCourse.name}" has been deleted`, "success");
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-100">

      {/* Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-5 px-6">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search courses..."
          />
          <FilterSelectField
            value={params.status ?? "all"}
            onChange={(val) => setParams({ status: val === "all" ? undefined : val })}
            icon={MdSchool}
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
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-gray-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-gray-700"
            hoverBorderColor="hover:border-slate-300"
            className="rounded-xl p-2.5"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="dark-navy"
            text="Add Course"
            icon={<MdAdd />}
            onClick={() => navigate("/admin/courses/create")}
          />
          <p className="text-sm text-gray-400">{count} courses</p>
        </div>
      </div>

      <Divider />

      {/* Table */}
      <div className="pb-5 px-6">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:bg-navy-800 dark:border-navy-700">
          {loading ? (
            <Loading text="Fetching courses..." />
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
          ) : courses.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">No courses found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-navy-700">
                    {[
                      { label: "Course",   icon: <MdSchool     size={14} /> },
                      { label: "Category", icon: <MdCategory   size={14} /> },
                      { label: "Location", icon: <MdLocationOn size={14} /> },
                      { label: "Level",    icon: <MdSettings   size={14} /> },
                      { label: "Mode",     icon: <MdSettings   size={14} /> },
                      { label: "Status",   icon: <MdSettings   size={14} /> },
                      { label: "Active",   icon: <MdToggleOn   size={14} /> },
                      { label: "Actions",  icon: <MdSettings   size={14} /> },
                    ].map(({ label, icon }) => (
                      <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                        <span className="flex items-center gap-1.5">{icon}{label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-navy-700">
                  {courses.map((course) => (
                    <tr key={course.uid} className="hover:bg-gray-50 dark:hover:bg-navy-700 transition">

                      {/* Course name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-600 flex-shrink-0">
                            <MdSchool size={16} />
                          </div>
                          <div>
                            <p className="font-medium text-navy-800 dark:text-white max-w-[200px] truncate">
                              {course.name}
                            </p>
                            {course.duration && (
                              <p className="text-xs text-gray-400">{course.duration}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="text-gray-600 dark:text-navy-200 text-sm">
                          {course.category?.name ?? "—"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5">
                        <span className="text-gray-600 dark:text-navy-200 text-sm">
                          {course.location ? `${course.location.city}, ${course.location.country}` : "—"}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${levelBadge[course.level] ?? "bg-gray-50 text-gray-500"}`}>
                          {course.level_display ?? course.level}
                        </span>
                      </td>

                      {/* Mode */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${modeBadge[course.mode] ?? "bg-gray-50 text-gray-500"}`}>
                          {course.mode_display ?? course.mode}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge[course.status] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {course.status_display ?? course.status}
                        </span>
                      </td>

                      {/* Active */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          course.is_active
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-red-50 text-red-500 border-red-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${course.is_active ? "bg-green-500" : "bg-red-400"}`} />
                          {course.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/courses/${course.uid}`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="View"
                          >
                            <MdVisibility size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/courses/${course.uid}/edit`)}
                            className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition"
                            title="Edit"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(course)}
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
            <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100">
              <p className="text-xs text-gray-400">
                Page {params.page ?? 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <PrevButton
                  text="Previous"
                  disabled={!params.page || params.page <= 1}
                  onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                  className="rounded-xl"
                />
                <NextButton
                  text="Next"
                  disabled={(params.page ?? 1) >= totalPages}
                  onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteCourseModal
        open={deleteOpen}
        course={selectedCourse}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default CoursesPage;
