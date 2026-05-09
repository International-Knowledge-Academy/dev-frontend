// @ts-nocheck
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdOpenInNew, MdSchool, MdWorkspacePremium,
  MdCalendarToday, MdLayers, MdSettings, MdLocationOn, MdPhotoCamera,
  MdArrowBack,
} from "react-icons/md";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import useTrainer from "hooks/trainers/useTrainer";
import useUpdateTrainer from "hooks/trainers/useUpdateTrainer";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import useTrainerAssignments from "hooks/trainers/useTrainerAssignments";
import Loading from "components/loading/Loading";
import { useToast } from "context/ToastContext";

const formatDate = (s?: string | null) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const statusStyle: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-600",
  ongoing:   "bg-green-50 text-green-600 border-green-600",
  completed: "bg-slate-100 text-slate-500 border-slate-400",
  cancelled: "bg-red-50 text-red-500 border-red-500",
};

const modeStyle: Record<string, string> = {
  online:  "bg-purple-50 text-purple-600 border-purple-600",
  offline: "bg-orange-50 text-orange-600 border-orange-600",
  hybrid:  "bg-teal-50 text-teal-600 border-teal-600",
};

const Field = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-400">{label}</p>
    <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <p className="text-sm font-semibold text-navy-800 mb-4">{title}</p>
    {children}
  </div>
);

const Divider = () => <div className="border-t border-slate-100 my-6" />;

const TrainerProfilePage = () => {
  const { uid }  = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { trainer, loading, error, refetch }                              = useTrainer(uid);
  const { updateTrainer }                                                 = useUpdateTrainer();
  const { upload, uploading, progress }                                   = usePresignedUpload();
  const { assignments, loading: loadingPrograms, count: programCount }   = useTrainerAssignments(uid);
  const { addToast }                                                      = useToast();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !trainer) return;
    e.target.value = "";
    const result = await upload(file, { folder: "trainers/profile-pictures", file_type: "image" });
    if (result) {
      const updated = await updateTrainer(trainer.uid, { profile_picture: result.file_key });
      if (updated) {
        addToast("Profile picture updated", "success");
        refetch();
      } else {
        addToast("Failed to update profile picture", "error");
      }
    }
  };

  if (loading) return <Loading text="Loading trainer..." />;
  if (error || !trainer) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Trainer not found."}</div>
  );

  const initials  = trainer.name
    ? trainer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : trainer.email?.[0]?.toUpperCase() ?? "?";
  const location  = [trainer.city, trainer.country].filter(Boolean).join(", ");

  const hasProfessional = trainer.title || trainer.bio || trainer.years_experience != null || trainer.certifications || trainer.linkedin_url;
  const hasContact      = trainer.primary_email || trainer.secondary_email || trainer.phone || trainer.whatsapp;
  const hasAddress      = trainer.address || trainer.city || trainer.country || trainer.postal_code;

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Identity card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-4">

          {/* Avatar — clickable upload */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="relative group block w-16 h-16 rounded-full ring-4 ring-slate-100 focus:outline-none"
            >
              {trainer.profile_picture?.public_url ? (
                <img src={trainer.profile_picture.public_url} alt={trainer.name}
                  className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-navy-600 text-white flex items-center justify-center text-xl font-bold select-none">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <MdPhotoCamera size={18} className="text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{progress}%</span>
                </div>
              )}
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-navy-800 leading-tight">{trainer.name || "—"}</h1>
            {trainer.title && <p className="text-sm text-slate-500 mt-0.5">{trainer.title}</p>}
            <p className="text-sm text-slate-400 mt-0.5 truncate">{trainer.email}</p>
            {location && <p className="text-xs text-slate-400 mt-0.5">{location}</p>}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
                <MdSchool size={11} /> Trainer
              </span>
              {programCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border bg-navy-50 text-navy-600 border-navy-200">
                  <MdWorkspacePremium size={11} />
                  {programCount} program{programCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button type="button"
              onClick={() => navigate(`/admin/trainers/${uid}/edit`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-medium text-white transition">
              <MdEdit size={13} /> Edit
            </button>
            <button type="button"
              onClick={() => navigate("/admin/trainers")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
              <MdArrowBack size={13} /> Back
            </button>
          </div>
        </div>
      </div>

      {/* ── Details card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

        <Section title="Account">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <Field label="Full Name" value={trainer.name} />
            <Field label="Email"     value={trainer.email} />
          </div>
        </Section>

        {hasProfessional && (
          <>
            <Divider />
            <Section title="Professional">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {trainer.title && <Field label="Title" value={trainer.title} />}
                {trainer.years_experience != null && (
                  <Field label="Experience" value={`${trainer.years_experience} year${trainer.years_experience !== 1 ? "s" : ""}`} />
                )}
                {trainer.linkedin_url && (
                  <Field label="LinkedIn" value={
                    <a href={trainer.linkedin_url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                      <FaLinkedin size={12} className="text-[#0077b5]" /> LinkedIn <MdOpenInNew size={11} className="text-slate-400" />
                    </a>
                  } />
                )}
              </div>
              {trainer.bio && (
                <div className="mt-5">
                  <Field label="Bio" value={<span className="whitespace-pre-wrap font-normal text-slate-600">{trainer.bio}</span>} />
                </div>
              )}
              {trainer.certifications && (
                <div className="mt-5">
                  <Field label="Certifications" value={<span className="whitespace-pre-wrap font-normal text-slate-600">{trainer.certifications}</span>} />
                </div>
              )}
            </Section>
          </>
        )}

        {hasContact && (
          <>
            <Divider />
            <Section title="Contact">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {trainer.primary_email   && <Field label="Primary Email"   value={trainer.primary_email} />}
                {trainer.secondary_email && <Field label="Secondary Email" value={trainer.secondary_email} />}
                {trainer.phone           && <Field label="Phone"           value={trainer.phone} />}
                {trainer.whatsapp        && (
                  <Field label="WhatsApp" value={
                    <span className="inline-flex items-center gap-1.5 font-normal">
                      <FaWhatsapp size={13} className="text-green-500 flex-shrink-0" />
                      {trainer.whatsapp}
                    </span>
                  } />
                )}
              </div>
            </Section>
          </>
        )}

        {hasAddress && (
          <>
            <Divider />
            <Section title="Address">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {trainer.country     && <Field label="Country"     value={trainer.country} />}
                {trainer.city        && <Field label="City"        value={trainer.city} />}
                {trainer.address     && <Field label="Street"      value={trainer.address} />}
                {trainer.postal_code && <Field label="Postal Code" value={trainer.postal_code} />}
              </div>
            </Section>
          </>
        )}

        {trainer.cv?.public_url && (
          <>
            <Divider />
            <Section title="Documents">
              <Field label="CV / Resume" value={
                <a href={trainer.cv.public_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                  <MdOpenInNew size={12} className="text-slate-400" /> View CV
                </a>
              } />
            </Section>
          </>
        )}
      </div>

      {/* ── Assigned Programs ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <p className="text-sm font-semibold text-navy-800">Assigned Programs</p>
          {programCount > 0 && (
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{programCount}</span>
          )}
        </div>

        {loadingPrograms ? (
          <div className="px-6 py-8 text-sm text-slate-400">Loading programs...</div>
        ) : assignments.length === 0 ? (
          <div className="px-6 py-8 text-sm text-slate-400 italic">Not assigned to any programs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    { label: "Program",  icon: <MdWorkspacePremium size={14} /> },
                    { label: "Field",    icon: <MdLayers           size={14} /> },
                    { label: "Status",   icon: <MdSettings         size={14} /> },
                    { label: "Mode",     icon: <MdSettings         size={14} /> },
                    { label: "Location", icon: <MdLocationOn       size={14} /> },
                    { label: "Dates",    icon: <MdCalendarToday    size={14} /> },
                  ].map(({ label, icon }) => (
                    <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-slate-400">
                      <span className="flex items-center gap-1.5">{icon}{label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {assignments.map((a) => {
                  const prog = a.program;
                  return (
                    <tr key={a.uid} onClick={() => navigate(`/admin/programs/${prog.uid}`)}
                      className="hover:bg-slate-50 transition cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: prog.field?.hex_color ?? "#94a3b8" }} />
                          <span className="font-medium text-navy-800 truncate max-w-[180px]" title={prog.name}>
                            {prog.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {prog.field?.name ?? <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${statusStyle[prog.status] ?? "bg-slate-100 text-slate-500 border-slate-400"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {prog.status_display ?? prog.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {prog.mode ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${modeStyle[prog.mode] ?? "bg-slate-100 text-slate-500 border-slate-400"}`}>
                            {prog.mode_display ?? prog.mode}
                          </span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {prog.location
                          ? `${prog.location.city}${prog.location.country ? `, ${prog.location.country}` : ""}`
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {prog.start_date || prog.end_date
                          ? <>{formatDate(prog.start_date)} → {formatDate(prog.end_date)}</>
                          : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default TrainerProfilePage;
