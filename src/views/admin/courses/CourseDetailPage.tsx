// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdSchool, MdCategory, MdLocationOn,
  MdAccessTime, MdSettings, MdLanguage, MdCalendarToday,
  MdPeople, MdEmail, MdPhone, MdLink, MdDescription, MdToggleOn,
} from "react-icons/md";
import useGetCourse from "hooks/courses/useGetCourse";
import Button from "components/ui/buttons/Button";

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  ongoing:   "bg-green-50 text-green-600 border-green-200",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const levelBadge: Record<string, string> = {
  beginner:     "bg-emerald-50 text-emerald-600 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-600 border-amber-200",
  advanced:     "bg-purple-50 text-purple-600 border-purple-200",
};

const modeBadge: Record<string, string> = {
  online:  "bg-cyan-50 text-cyan-600 border-cyan-200",
  offline: "bg-orange-50 text-orange-600 border-orange-200",
  hybrid:  "bg-indigo-50 text-indigo-600 border-indigo-200",
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-navy-700 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-navy-50 dark:bg-navy-900 flex items-center justify-center text-navy-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 dark:text-white break-words">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6 mb-1 px-6">{title}</p>
);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

const CourseDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { course, loading, error } = useGetCourse(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Course not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-navy-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdSchool size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 dark:text-white leading-snug">{course.name}</h1>
            {course.duration && (
              <p className="text-xs text-gray-400 mt-0.5">{course.duration}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge[course.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {course.status_display ?? course.status}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              course.is_active
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-500 border-red-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${course.is_active ? "bg-green-500" : "bg-red-400"}`} />
              {course.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* General Info */}
        <SectionTitle title="General" />
        <div className="px-6">
          <InfoRow
            icon={<MdCategory size={18} />}
            label="Category"
            value={course.category?.name ?? "—"}
          />
          <InfoRow
            icon={<MdLocationOn size={18} />}
            label="Location"
            value={
              course.location
                ? `${course.location.name} — ${course.location.city}, ${course.location.country}`
                : "—"
            }
          />
          <InfoRow
            icon={<MdAccessTime size={18} />}
            label="Duration"
            value={course.duration || "—"}
          />
          <InfoRow
            icon={<MdLanguage size={18} />}
            label="Language"
            value={course.language || "—"}
          />
          <InfoRow
            icon={<MdSettings size={18} />}
            label="Level"
            value={
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${levelBadge[course.level] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                {course.level_display ?? course.level}
              </span>
            }
          />
          <InfoRow
            icon={<MdSettings size={18} />}
            label="Mode"
            value={
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${modeBadge[course.mode] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                {course.mode_display ?? course.mode}
              </span>
            }
          />
        </div>

        {/* Schedule */}
        <SectionTitle title="Schedule" />
        <div className="px-6">
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Start Date"
            value={formatDate(course.start_date)}
          />
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="End Date"
            value={formatDate(course.end_date)}
          />
          <InfoRow
            icon={<MdPeople size={18} />}
            label="Max Participants"
            value={course.max_participants != null ? course.max_participants : "—"}
          />
        </div>

        {/* Contact */}
        <SectionTitle title="Contact" />
        <div className="px-6">
          <InfoRow
            icon={<MdEmail size={18} />}
            label="Contact Email"
            value={
              course.contact_email
                ? <a href={`mailto:${course.contact_email}`} className="text-navy-600 hover:underline">{course.contact_email}</a>
                : "—"
            }
          />
          <InfoRow
            icon={<MdPhone size={18} />}
            label="Contact Phone"
            value={
              course.contact_phone
                ? <a href={`tel:${course.contact_phone}`} className="text-navy-600 hover:underline">{course.contact_phone}</a>
                : "—"
            }
          />
        </div>

        {/* Brochures */}
        <SectionTitle title="Brochures" />
        <div className="px-6">
          <InfoRow
            icon={<MdLink size={18} />}
            label="Brochure URL (EN)"
            value={
              course.brochure_url_en
                ? <a href={course.brochure_url_en} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline break-all">{course.brochure_url_en}</a>
                : "—"
            }
          />
          <InfoRow
            icon={<MdLink size={18} />}
            label="Brochure URL (AR)"
            value={
              course.brochure_url_ar
                ? <a href={course.brochure_url_ar} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline break-all">{course.brochure_url_ar}</a>
                : "—"
            }
          />
        </div>

        {/* Description */}
        {course.description && (
          <>
            <SectionTitle title="Description" />
            <div className="px-6">
              <InfoRow
                icon={<MdDescription size={18} />}
                label="Description"
                value={<span className="whitespace-pre-wrap">{course.description}</span>}
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-navy-700 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/courses/${uid}/edit`)}
            className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit Course
          </button>
        </div>

      </div>
    </div>
  );
};

export default CourseDetailPage;
