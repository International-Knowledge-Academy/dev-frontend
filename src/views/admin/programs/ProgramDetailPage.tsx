// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdArrowBack, MdWorkspacePremium, MdLocationOn,
  MdCalendarToday, MdPeople, MdEmail, MdPhone, MdOpenInNew,
  MdSchool, MdAccessTime,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import useGetProgram from "hooks/programs/useGetProgram";

const statusBadge: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  ongoing:   "bg-green-50 text-green-700 border-green-200",
  completed: "bg-slate-100 text-slate-500 border-slate-200",
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
  hybrid:  "bg-teal-50 text-teal-600 border-teal-200",
};

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-400">{label}</p>
    <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-sm font-semibold text-navy-800 mb-4">{title}</p>
    {children}
  </div>
);

const Divider = () => <div className="border-t border-slate-100 my-6" />;

const formatDate     = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const formatDateTime = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null;

const ProgramDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { program, loading, error } = useGetProgram(uid);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading program...</div>
  );
  if (error || !program) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Program not found."}</div>
  );

  const hasContact  = program.contact_email || program.contact_phone || program.brochure_url;
  const hasContent  = program.description || program.objectives || program.target_audience || program.prerequisites;
  const hasTrainers = program.trainer_profiles?.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Identity card ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-4">

          {/* Icon */}
          <div className="flex-shrink-0">
            {program.thumbnail ? (
              <img
                src={program.thumbnail}
                alt={program.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-100"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: program.field?.hex_color ?? "#1e3a5f" }}
              >
                <MdWorkspacePremium size={28} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-navy-800 leading-tight">{program.name}</h1>
            {program.duration && (
              <p className="text-sm text-slate-500 mt-0.5">{program.duration}</p>
            )}
            {program.field && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: program.field.hex_color ?? "#94a3b8" }}
                />
                <span className="text-xs text-slate-400">{program.field.name}</span>
              </div>
            )}
            {program.location && (
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MdLocationOn size={12} />
                {program.location.city}{program.location.country ? `, ${program.location.country}` : ""}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${typeBadge[program.program_type] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                {program.program_type_display ?? program.program_type}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border capitalize ${statusBadge[program.status] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {program.status_display ?? program.status}
              </span>
              {!program.is_active && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border bg-red-50 text-red-500 border-red-200">
                  Inactive
                </span>
              )}
              {program.price && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border bg-slate-50 text-slate-600 border-slate-200">
                  {program.price} {program.currency ?? ""}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/admin/programs/${uid}/edit`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-medium text-white transition"
            >
              <MdEdit size={13} /> Edit
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/programs")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <MdArrowBack size={13} /> Back
            </button>
          </div>
        </div>
      </div>

      {/* ── Details card ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

        <Section title="Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
            <Field label="Mode" value={
              program.mode ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border capitalize ${modeBadge[program.mode] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                  {program.mode_display ?? program.mode}
                </span>
              ) : null
            } />
            <Field label="Level" value={
              program.level ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${levelBadge[program.level] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                  {program.level_display ?? program.level}
                </span>
              ) : null
            } />
            {program.language && <Field label="Language" value={program.language} />}
            {program.duration  && <Field label="Duration"  value={program.duration} />}
          </div>
        </Section>

        <Divider />

        <Section title="Schedule">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
            <Field label="Start Date" value={
              <span className="flex items-center gap-1.5">
                <MdCalendarToday size={13} className="text-slate-400" />
                {formatDate(program.start_date) ?? "—"}
              </span>
            } />
            <Field label="End Date" value={
              <span className="flex items-center gap-1.5">
                <MdCalendarToday size={13} className="text-slate-400" />
                {formatDate(program.end_date) ?? "—"}
              </span>
            } />
            {program.max_participants != null && (
              <Field label="Max Participants" value={
                <span className="flex items-center gap-1.5">
                  <MdPeople size={13} className="text-slate-400" />
                  {program.max_participants}
                </span>
              } />
            )}
          </div>
        </Section>

        {program.location && (
          <>
            <Divider />
            <Section title="Location">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <Field label="Venue" value={program.location.name} />
                {program.location.city && (
                  <Field label="City / Country" value={[program.location.city, program.location.country].filter(Boolean).join(", ")} />
                )}
                {program.location.address && (
                  <div className="col-span-2">
                    <Field label="Address" value={program.location.address} />
                  </div>
                )}
                {program.location.venue_details && (
                  <div className="col-span-2">
                    <Field label="Venue Details" value={
                      <span className="whitespace-pre-wrap font-normal text-slate-600">{program.location.venue_details}</span>
                    } />
                  </div>
                )}
                {program.location.contact_phone && (
                  <Field label="Venue Phone" value={
                    <a href={`tel:${program.location.contact_phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                      <MdPhone size={12} className="text-slate-400" /> {program.location.contact_phone}
                    </a>
                  } />
                )}
                {program.location.whatsapp_number && (
                  <Field label="Venue WhatsApp" value={
                    <span className="inline-flex items-center gap-1.5 font-normal text-sm">
                      <FaWhatsapp size={13} className="text-green-500 flex-shrink-0" />
                      {program.location.whatsapp_number}
                    </span>
                  } />
                )}
              </div>
            </Section>
          </>
        )}

        {hasContact && (
          <>
            <Divider />
            <Section title="Contact">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {program.contact_email && (
                  <Field label="Email" value={
                    <a href={`mailto:${program.contact_email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                      <MdEmail size={12} className="text-slate-400" /> {program.contact_email}
                    </a>
                  } />
                )}
                {program.contact_phone && (
                  <Field label="Phone" value={
                    <a href={`tel:${program.contact_phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                      <MdPhone size={12} className="text-slate-400" /> {program.contact_phone}
                    </a>
                  } />
                )}
                {program.brochure_url && (
                  <Field label="Brochure" value={
                    <a href={program.brochure_url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                      <MdOpenInNew size={12} className="text-slate-400" /> View Brochure
                    </a>
                  } />
                )}
              </div>
            </Section>
          </>
        )}

        {(program.created_at || program.updated_at) && (
          <>
            <Divider />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {program.created_at && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MdAccessTime size={13} />
                  <span>Created {formatDateTime(program.created_at)}</span>
                </div>
              )}
              {program.updated_at && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MdAccessTime size={13} />
                  <span>Updated {formatDateTime(program.updated_at)}</span>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* ── Content card ───────────────────────────────────────────── */}
      {hasContent && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <Section title="Content">
            <div className="space-y-5">
              {program.description && (
                <Field label="Description" value={
                  <span className="whitespace-pre-wrap font-normal text-slate-600">{program.description}</span>
                } />
              )}
              {program.objectives && (
                <Field label="Objectives" value={
                  <span className="whitespace-pre-wrap font-normal text-slate-600">{program.objectives}</span>
                } />
              )}
              {program.target_audience && (
                <Field label="Target Audience" value={
                  <span className="whitespace-pre-wrap font-normal text-slate-600">{program.target_audience}</span>
                } />
              )}
              {program.prerequisites && (
                <Field label="Prerequisites" value={
                  <span className="whitespace-pre-wrap font-normal text-slate-600">{program.prerequisites}</span>
                } />
              )}
            </div>
          </Section>
        </div>
      )}

      {/* ── Trainers card ──────────────────────────────────────────── */}
      {hasTrainers && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-semibold text-navy-800">Assigned Trainers</p>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
              {program.trainer_profiles.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {program.trainer_profiles.map((trainer) => {
              const initials = trainer.user?.name
                ? trainer.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                : "?";
              return (
                <div
                  key={trainer.uid}
                  onClick={() => trainer.user?.uid && navigate(`/admin/trainers/${trainer.user.uid}`)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                >
                  {trainer.profile_picture ? (
                    <img
                      src={trainer.profile_picture}
                      alt={trainer.user?.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{trainer.user?.name ?? "—"}</p>
                    <p className="text-xs text-slate-400 truncate">{trainer.title || trainer.user?.email || ""}</p>
                  </div>
                  <MdSchool size={14} className="text-slate-300 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgramDetailPage;
