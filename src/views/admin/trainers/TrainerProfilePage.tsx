// @ts-nocheck
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdOpenInNew, MdSchool, MdVerified, MdWorkspacePremium,
  MdCalendarToday, MdLayers, MdSettings, MdLocationOn, MdPhotoCamera,
  MdArrowBack,
} from "react-icons/md";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import useGetUser from "hooks/users/useGetUser";
import useUpdateProfile from "hooks/users/useUpdateProfile";
import usePresignedUpload from "hooks/storage/usePresignedUpload";
import useTrainerAssignments from "hooks/trainers/useTrainerAssignments";

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
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, loading, error, refetch }                                = useGetUser(uid);
  const { updateProfile }                                                = useUpdateProfile();
  const { upload, uploading, progress }                                  = usePresignedUpload();
  const { assignments, loading: loadingPrograms, count: programCount }   = useTrainerAssignments(user?.profile?.uid);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    e.target.value = "";
    const result = await upload(file, { folder: "users/profiles", file_type: "image" });
    if (result) {
      await updateProfile(user.uid, { profile_picture: result.public_url });
      refetch();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading profile...</div>
  );
  if (error || !user) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Trainer not found."}</div>
  );

  const p = user.profile;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";
  const location = [p?.city, p?.country].filter(Boolean).join(", ");

  const hasProfessional = p && (p.title || p.bio || p.years_experience != null || p.certifications || p.linkedin_url);
  const hasContact      = p && (p.primary_email || p.secondary_email || p.phone || p.whatsapp);
  const hasAddress      = p && (p.address || p.city || p.country || p.postal_code);

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Identity card ──────────────────────────────────────────────── */}
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
              {p?.profile_picture ? (
                <img src={p.profile_picture} alt={user.name}
                  className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold select-none">
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
            <h1 className="text-lg font-bold text-navy-800 leading-tight">{user.name || "—"}</h1>
            {p?.title && <p className="text-sm text-slate-500 mt-0.5">{p.title}</p>}
            <p className="text-sm text-slate-400 mt-0.5 truncate">{user.email}</p>
            {location && <p className="text-xs text-slate-400 mt-0.5">{location}</p>}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
                <MdSchool size={11} /> Trainer
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
                user.is_active
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-400"}`} />
                {user.is_active ? "Active" : "Inactive"}
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

      {/* ── Details card ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

        <Section title="Account">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <Field label="Full Name" value={user.name} />
            <Field label="Email"     value={user.email} />
          </div>
        </Section>

        {hasProfessional && (
          <>
            <Divider />
            <Section title="Professional">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {p.title            && <Field label="Title"      value={p.title} />}
                {p.years_experience != null && (
                  <Field label="Experience" value={`${p.years_experience} year${p.years_experience !== 1 ? "s" : ""}`} />
                )}
                {p.linkedin_url && (
                  <Field label="LinkedIn" value={
                    <a href={p.linkedin_url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                      <FaLinkedin size={12} className="text-[#0077b5]" /> LinkedIn <MdOpenInNew size={11} className="text-slate-400" />
                    </a>
                  } />
                )}
              </div>
              {p.bio && (
                <div className="mt-5">
                  <Field label="Bio" value={<span className="whitespace-pre-wrap font-normal text-slate-600">{p.bio}</span>} />
                </div>
              )}
              {p.certifications && (
                <div className="mt-5">
                  <Field label="Certifications" value={<span className="whitespace-pre-wrap font-normal text-slate-600">{p.certifications}</span>} />
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
                {p.primary_email   && <Field label="Primary Email"   value={p.primary_email} />}
                {p.secondary_email && <Field label="Secondary Email" value={p.secondary_email} />}
                {p.phone           && <Field label="Phone"           value={p.phone} />}
                {p.whatsapp        && (
                  <Field label="WhatsApp" value={
                    <span className="inline-flex items-center gap-1.5 font-normal">
                      <FaWhatsapp size={13} className="text-green-500 flex-shrink-0" />
                      {p.whatsapp}
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
                {p.country     && <Field label="Country"     value={p.country} />}
                {p.city        && <Field label="City"        value={p.city} />}
                {p.address     && <Field label="Street"      value={p.address} />}
                {p.postal_code && <Field label="Postal Code" value={p.postal_code} />}
              </div>
            </Section>
          </>
        )}

        {p?.cv && (
          <>
            <Divider />
            <Section title="Documents">
              <Field label="CV / Resume" value={
                <a href={p.cv} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition">
                  <MdOpenInNew size={12} className="text-slate-400" /> View CV
                </a>
              } />
            </Section>
          </>
        )}
      </div>

      {/* ── Assigned Programs ──────────────────────────────────────────── */}
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
