// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdEmail, MdBadge, MdToggleOn, MdCalendarToday, MdPerson,
  MdDescription, MdDownload, MdWork, MdPhone, MdLocationOn, MdSchool,
  MdVerified, MdLink, MdOpenInNew, MdAdminPanelSettings, MdAccessTime,
} from "react-icons/md";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import useGetUser from "hooks/users/useGetUser";
import Button from "components/ui/buttons/Button";

const roleBadge: Record<string, string> = {
  admin:           "bg-navy-50 text-navy-700 border-navy-200",
  account_manager: "bg-gold-50 text-gold-700 border-gold-200",
};
const roleLabel: Record<string, string> = {
  admin:           "Admin",
  account_manager: "Account Manager",
};

const formatDate = (s?: string | null) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};
const formatDateTime = (s?: string | null) => {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const InfoRow = ({ icon, label, value }) => (
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

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6 mb-1 px-6">{title}</p>
);

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useGetUser(id);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-gray-400">Loading profile...</div>;
  }

  if (error || !user) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "User not found."}</div>;
  }

  const p = user.profile;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="max-w-5xl m-auto space-y-4">

      {/* Header */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">
        <div className="px-6 py-6 flex items-start gap-5">
          <div className="flex-shrink-0">
            {p?.profile_picture ? (
              <img src={p.profile_picture} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-navy-100 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-navy-700 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-navy-800 dark:text-white">{user.name || "—"}</h1>
            {p?.title && <p className="text-sm text-gray-500 mt-0.5">{p.title}</p>}
            <p className="text-sm text-gray-400 mt-0.5 truncate">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleBadge[user.role] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                <MdAdminPanelSettings size={12} />
                {roleLabel[user.role] ?? user.role}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${user.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-500 border-red-200"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-400"}`} />
                {user.is_active ? "Active" : "Inactive"}
              </span>
              {user.is_superuser && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">
                  <MdVerified size={12} /> Superuser
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="primary"
              text="Edit User"
              icon={<MdEdit size={15} />}
              onClick={() => navigate(`/admin/users/${id}/edit`)}
              className="rounded-xl"
            />
            <Button
              type="button"
              text="Back"
              onClick={() => navigate("/admin/users")}
              className="rounded-xl"
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
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">
        <SectionTitle title="Account" />
        <div className="px-6">
          <InfoRow icon={<MdPerson size={18} />} label="Full Name" value={user.name || "—"} />
          <InfoRow icon={<MdEmail size={18} />} label="Email" value={user.email} />
          <InfoRow
            icon={<MdAdminPanelSettings size={18} />}
            label="Role"
            value={<span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${roleBadge[user.role] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>{roleLabel[user.role] ?? user.role}</span>}
          />
          <InfoRow
            icon={<MdVerified size={18} />}
            label="Permissions"
            value={
              <div className="flex flex-wrap gap-1.5">
                {user.is_superuser && <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">Superuser</span>}
                {user.is_staff     && <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">Staff</span>}
                {!user.is_superuser && !user.is_staff && <span className="text-gray-400 text-xs">Standard</span>}
              </div>
            }
          />
        </div>

        <SectionTitle title="Activity" />
        <div className="px-6">
          <InfoRow icon={<MdCalendarToday size={18} />} label="Member Since" value={formatDate(user.created_at)} />
          <InfoRow icon={<MdAccessTime size={18} />} label="Last Login" value={formatDateTime(user.last_login)} />
        </div>
      </div>

      {/* Profile details */}
      {p && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">
          <SectionTitle title="Professional Info" />
          <div className="px-6">
            {p.title && <InfoRow icon={<MdWork size={18} />} label="Title" value={p.title} />}
            {p.bio && (
              <InfoRow
                icon={<MdPerson size={18} />}
                label="Bio"
                value={<span className="whitespace-pre-wrap text-gray-600">{p.bio}</span>}
              />
            )}
            {p.years_experience != null && (
              <InfoRow icon={<MdSchool size={18} />} label="Years of Experience" value={`${p.years_experience} year${p.years_experience !== 1 ? "s" : ""}`} />
            )}
            {p.certifications && (
              <InfoRow icon={<MdVerified size={18} />} label="Certifications" value={<span className="whitespace-pre-wrap text-gray-600">{p.certifications}</span>} />
            )}
            {p.linkedin_url && (
              <InfoRow
                icon={<FaLinkedin size={16} />}
                label="LinkedIn"
                value={<a href={p.linkedin_url} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline inline-flex items-center gap-1">{p.linkedin_url} <MdOpenInNew size={12} /></a>}
              />
            )}
          </div>

          <SectionTitle title="Contact" />
          <div className="px-6">
            {p.primary_email && <InfoRow icon={<MdEmail size={18} />} label="Primary Email" value={p.primary_email} />}
            {p.secondary_email && <InfoRow icon={<MdEmail size={18} />} label="Secondary Email" value={p.secondary_email} />}
            {p.phone && <InfoRow icon={<MdPhone size={18} />} label="Phone" value={p.phone} />}
            {p.whatsapp && <InfoRow icon={<FaWhatsapp size={16} />} label="WhatsApp" value={p.whatsapp} />}
          </div>

          {(p.address || p.city || p.country || p.postal_code) && (
            <>
              <SectionTitle title="Address" />
              <div className="px-6">
                {p.address     && <InfoRow icon={<MdLocationOn size={18} />} label="Address"     value={p.address} />}
                {p.city        && <InfoRow icon={<MdLocationOn size={18} />} label="City"        value={p.city} />}
                {p.country     && <InfoRow icon={<MdLocationOn size={18} />} label="Country"     value={p.country} />}
                {p.postal_code && <InfoRow icon={<MdLocationOn size={18} />} label="Postal Code" value={p.postal_code} />}
              </div>
            </>
          )}

          <SectionTitle title="Documents" />
          <div className="px-6 pb-2">
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

    </div>
  );
};

export default UserProfilePage;
