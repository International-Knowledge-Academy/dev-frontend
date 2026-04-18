// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdWorkspacePremium, MdLayers, MdLocationOn,
  MdAccessTime, MdSettings, MdLanguage, MdCalendarToday,
  MdPeople, MdEmail, MdPhone, MdLink, MdDescription, MdToggleOn,
  MdFlag, MdAttachMoney,
} from "react-icons/md";
import useGetProgram from "hooks/programs/useGetProgram";

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  ongoing:   "bg-green-50 text-green-600 border-green-200",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const typeBadge: Record<string, string> = {
  course:     "bg-navy-50 text-navy-600 border-navy-200",
  diploma:    "bg-gold-50 text-gold-600 border-gold-200",
  contracted: "bg-purple-50 text-purple-600 border-purple-200",
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

const ProgramDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { program, loading, error } = useGetProgram(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading program...
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Program not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-navy-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdWorkspacePremium size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 dark:text-white leading-snug">{program.name}</h1>
            {program.duration && (
              <p className="text-xs text-gray-400 mt-0.5">{program.duration}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeBadge[program.program_type] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
              {program.program_type_display ?? program.program_type}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge[program.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {program.status_display ?? program.status}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              program.is_active
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-500 border-red-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${program.is_active ? "bg-green-500" : "bg-red-400"}`} />
              {program.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* General Info */}
        <SectionTitle title="General" />
        <div className="px-6">
          <InfoRow
            icon={<MdLayers size={18} />}
            label="Field"
            value={program.field?.name ?? "—"}
          />
          <InfoRow
            icon={<MdLocationOn size={18} />}
            label="Location"
            value={
              program.location
                ? `${program.location.name} — ${program.location.city}, ${program.location.country}`
                : "—"
            }
          />
          <InfoRow
            icon={<MdAccessTime size={18} />}
            label="Duration"
            value={program.duration || "—"}
          />
          <InfoRow
            icon={<MdLanguage size={18} />}
            label="Language"
            value={program.language || "—"}
          />
          <InfoRow
            icon={<MdSettings size={18} />}
            label="Level"
            value={
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${levelBadge[program.level] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                {program.level_display ?? program.level}
              </span>
            }
          />
          <InfoRow
            icon={<MdSettings size={18} />}
            label="Mode"
            value={
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${modeBadge[program.mode] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                {program.mode_display ?? program.mode}
              </span>
            }
          />
          {(program.price || program.currency) && (
            <InfoRow
              icon={<MdAttachMoney size={18} />}
              label="Price"
              value={program.price ? `${program.price} ${program.currency ?? ""}`.trim() : "—"}
            />
          )}
        </div>

        {/* Schedule */}
        <SectionTitle title="Schedule" />
        <div className="px-6">
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Start Date"
            value={formatDate(program.start_date)}
          />
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="End Date"
            value={formatDate(program.end_date)}
          />
          <InfoRow
            icon={<MdPeople size={18} />}
            label="Max Participants"
            value={program.max_participants != null ? program.max_participants : "—"}
          />
        </div>

        {/* Contact */}
        <SectionTitle title="Contact" />
        <div className="px-6">
          <InfoRow
            icon={<MdEmail size={18} />}
            label="Contact Email"
            value={
              program.contact_email
                ? <a href={`mailto:${program.contact_email}`} className="text-navy-600 hover:underline">{program.contact_email}</a>
                : "—"
            }
          />
          <InfoRow
            icon={<MdPhone size={18} />}
            label="Contact Phone"
            value={
              program.contact_phone
                ? <a href={`tel:${program.contact_phone}`} className="text-navy-600 hover:underline">{program.contact_phone}</a>
                : "—"
            }
          />
        </div>

        {/* Brochure */}
        {program.brochure_url && (
          <>
            <SectionTitle title="Brochure" />
            <div className="px-6">
              <InfoRow
                icon={<MdLink size={18} />}
                label="Brochure URL"
                value={
                  <a href={program.brochure_url} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline break-all">
                    {program.brochure_url}
                  </a>
                }
              />
            </div>
          </>
        )}

        {/* Content */}
        {(program.description || program.objectives || program.target_audience || program.prerequisites) && (
          <>
            <SectionTitle title="Content" />
            <div className="px-6">
              {program.description && (
                <InfoRow
                  icon={<MdDescription size={18} />}
                  label="Description"
                  value={<span className="whitespace-pre-wrap">{program.description}</span>}
                />
              )}
              {program.objectives && (
                <InfoRow
                  icon={<MdFlag size={18} />}
                  label="Objectives"
                  value={<span className="whitespace-pre-wrap">{program.objectives}</span>}
                />
              )}
              {program.target_audience && (
                <InfoRow
                  icon={<MdPeople size={18} />}
                  label="Target Audience"
                  value={<span className="whitespace-pre-wrap">{program.target_audience}</span>}
                />
              )}
              {program.prerequisites && (
                <InfoRow
                  icon={<MdSettings size={18} />}
                  label="Prerequisites"
                  value={<span className="whitespace-pre-wrap">{program.prerequisites}</span>}
                />
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-navy-700 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/programs")}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/programs/${uid}/edit`)}
            className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit Program
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProgramDetailPage;
