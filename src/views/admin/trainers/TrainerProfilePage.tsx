// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdEmail, MdPerson, MdWork, MdPhone, MdLocationOn,
  MdSchool, MdVerified, MdLink, MdOpenInNew, MdAccessTime,
  MdWorkspacePremium, MdStar, MdCalendarToday, MdLayers, MdSettings,
} from "react-icons/md";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import useGetUser from "hooks/users/useGetUser";
import useTrainerAssignments from "hooks/trainers/useTrainerAssignments";
import Button from "components/ui/buttons/Button";

const formatDateTime = (s?: string | null) => {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const formatDate = (s?: string | null) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const statusStyle: Record<string, string> = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-600",
  ongoing:   "bg-green-50 text-green-600 border-green-600",
  completed: "bg-gray-100 text-gray-500 border-gray-500",
  cancelled: "bg-red-50 text-red-500 border-red-500",
};

const modeStyle: Record<string, string> = {
  online:  "bg-purple-50 text-purple-600 border-purple-600",
  offline: "bg-orange-50 text-orange-600 border-orange-600",
  hybrid:  "bg-teal-50 text-teal-600 border-teal-600",
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ title, count }: { title: string; count?: number }) => (
  <div className="flex items-center gap-2 mt-6 mb-1 px-4 sm:px-6">
    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</p>
    {count != null && (
      <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{count}</span>
    )}
  </div>
);

const TrainerProfilePage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  const { user, loading, error }                               = useGetUser(uid);
  const { assignments, loading: loadingPrograms, count: programCount } = useTrainerAssignments(user?.profile?.uid);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-gray-400">Loading profile...</div>;
  }

  if (error || !user) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Trainer not found."}</div>;
  }

  const p = user.profile;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="max-w-5xl m-auto space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-5 sm:py-6 flex items-start gap-3 sm:gap-5">
          <div className="flex-shrink-0">
            {p?.profile_picture ? (
              <img
                src={p.profile_picture}
                alt={user.name}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-green-100 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-navy-800">{user.name || "—"}</h1>
            {p?.title && <p className="text-sm text-gray-500 mt-0.5">{p.title}</p>}
            <p className="text-sm text-gray-400 mt-0.5 truncate" title={user.email}>{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-green-50 text-green-700 border-green-700">
                <MdSchool size={12} />
                Trainer
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                user.is_active
                  ? "bg-green-50 text-green-600 border-green-600"
                  : "bg-red-50 text-red-500 border-red-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-400"}`} />
                {user.is_active ? "Active" : "Inactive"}
              </span>
              {programCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-navy-50 text-navy-600 border-navy-600">
                  <MdWorkspacePremium size={12} />
                  {programCount} program{programCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="primary"
              text="Edit Trainer"
              icon={<MdEdit size={15} />}
              onClick={() => navigate(`/admin/trainers/${uid}/edit`)}
            />
            <Button
              type="button"
              text="Back"
              onClick={() => navigate("/admin/trainers")}
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
          </div>
        </div>
      </div>

      {/* Account & activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle title="Account" />
        <div className="px-6">
          <InfoRow icon={<MdPerson size={18} />} label="Full Name" value={user.name || "—"} />
          <InfoRow icon={<MdEmail  size={18} />} label="Email"     value={user.email} />
        </div>
        <SectionTitle title="Activity" />
        <div className="px-6">
          <InfoRow icon={<MdAccessTime size={18} />} label="Last Login" value={formatDateTime(user.last_login)} />
        </div>
      </div>

      {/* Profile details */}
      {p && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionTitle title="Professional Info" />
          <div className="px-4 sm:px-6">
            {p.title && <InfoRow icon={<MdWork size={18} />} label="Title" value={p.title} />}
            {p.bio && (
              <InfoRow
                icon={<MdPerson size={18} />}
                label="Bio"
                value={<span className="whitespace-pre-wrap text-gray-600">{p.bio}</span>}
              />
            )}
            {p.years_experience != null && (
              <InfoRow
                icon={<MdSchool size={18} />}
                label="Years of Experience"
                value={`${p.years_experience} year${p.years_experience !== 1 ? "s" : ""}`}
              />
            )}
            {p.certifications && (
              <InfoRow
                icon={<MdVerified size={18} />}
                label="Certifications"
                value={<span className="whitespace-pre-wrap text-gray-600">{p.certifications}</span>}
              />
            )}
            {p.linkedin_url && (
              <InfoRow
                icon={<FaLinkedin size={16} />}
                label="LinkedIn"
                value={
                  <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline inline-flex items-center gap-1">
                    {p.linkedin_url} <MdOpenInNew size={12} />
                  </a>
                }
              />
            )}
          </div>

          <SectionTitle title="Contact" />
          <div className="px-4 sm:px-6">
            {p.primary_email   && <InfoRow icon={<MdEmail    size={18} />} label="Primary Email"   value={p.primary_email} />}
            {p.secondary_email && <InfoRow icon={<MdEmail    size={18} />} label="Secondary Email" value={p.secondary_email} />}
            {p.phone           && <InfoRow icon={<MdPhone    size={18} />} label="Phone"           value={p.phone} />}
            {p.whatsapp        && <InfoRow icon={<FaWhatsapp size={16} />} label="WhatsApp"        value={p.whatsapp} />}
          </div>

          {(p.address || p.city || p.country || p.postal_code) && (
            <>
              <SectionTitle title="Address" />
              <div className="px-4 sm:px-6">
                {p.address     && <InfoRow icon={<MdLocationOn size={18} />} label="Address"     value={p.address} />}
                {p.city        && <InfoRow icon={<MdLocationOn size={18} />} label="City"        value={p.city} />}
                {p.country     && <InfoRow icon={<MdLocationOn size={18} />} label="Country"     value={p.country} />}
                {p.postal_code && <InfoRow icon={<MdLocationOn size={18} />} label="Postal Code" value={p.postal_code} />}
              </div>
            </>
          )}

          <SectionTitle title="Documents" />
          <div className="px-4 sm:px-6 pb-2">
            <InfoRow
              icon={<MdLink size={18} />}
              label="CV / Resume"
              value={
                p.cv
                  ? <a href={p.cv} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline inline-flex items-center gap-1">View / Download CV <MdOpenInNew size={12} /></a>
                  : <span className="text-gray-400 italic text-sm">No CV uploaded</span>
              }
            />
          </div>
        </div>
      )}

      {/* Assigned Programs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Assigned Programs</p>
          {programCount > 0 && (
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{programCount}</span>
          )}
        </div>

        {loadingPrograms ? (
          <div className="px-6 py-8 text-sm text-gray-400">Loading programs...</div>
        ) : assignments.length === 0 ? (
          <div className="px-6 py-8 text-sm text-gray-400 italic">Not assigned to any programs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    { label: "Program",  icon: <MdWorkspacePremium size={14} /> },
                    { label: "Field",    icon: <MdLayers size={14} /> },
                    { label: "Status",   icon: <MdSettings size={14} /> },
                    { label: "Mode",     icon: <MdSettings size={14} /> },
                    { label: "Location", icon: <MdLocationOn size={14} /> },
                    { label: "Dates",    icon: <MdCalendarToday size={14} /> },
                  ].map(({ label, icon }) => (
                    <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                      <span className="flex items-center gap-1.5">{icon}{label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assignments.map((a) => {
                  const prog = a.program;
                  return (
                    <tr
                      key={a.uid}
                      onClick={() => navigate(`/admin/programs/${prog.uid}`)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      {/* Program */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: prog.field?.hex_color ?? "#94a3b8" }}
                          />
                          <span className="font-medium text-navy-800 truncate max-w-[180px]" title={prog.name}>
                            {prog.name}
                          </span>
                        </div>
                      </td>

                      {/* Field */}
                      <td className="px-5 py-3.5 text-gray-500 text-sm">
                        {prog.field?.name ?? <span className="text-gray-300 italic">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${statusStyle[prog.status] ?? "bg-gray-100 text-gray-500 border-gray-500"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {prog.status_display ?? prog.status}
                        </span>
                      </td>

                      {/* Mode */}
                      <td className="px-5 py-3.5">
                        {prog.mode ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${modeStyle[prog.mode] ?? "bg-gray-100 text-gray-500 border-gray-500"}`}>
                            {prog.mode_display ?? prog.mode}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5 text-gray-500 text-sm">
                        {prog.location
                          ? `${prog.location.city}${prog.location.country ? `, ${prog.location.country}` : ""}`
                          : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {prog.start_date || prog.end_date
                          ? <>{formatDate(prog.start_date)} → {formatDate(prog.end_date)}</>
                          : <span className="text-gray-300">—</span>}
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
