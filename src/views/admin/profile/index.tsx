// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPerson, MdEmail, MdBadge, MdCalendarToday, MdAccessTime,
  MdVerified, MdAdminPanelSettings, MdEdit, MdLock, MdLink,
  MdWork, MdPhone, MdLocationOn, MdSchool, MdOpenInNew,
} from "react-icons/md";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import useMe from "hooks/auth/useMe";
import DropdownButton from "components/ui/buttons/DropdownButton";
import ChangePasswordModal from "components/ui/modals/ChangePasswordModal";

const roleBadge: Record<string, string> = {
  admin:           "bg-navy-50 text-navy-700 border-navy-700",
  account_manager: "bg-gold-50 text-gold-700 border-gold-700",
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
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wide font-medium">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value}</div>
    </div>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {title && (
      <div className="px-5 py-3.5 border-b border-gray-50">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</p>
      </div>
    )}
    <div className="px-5 py-2">{children}</div>
  </div>
);

const ProfileOverview = () => {
  const navigate = useNavigate();
  const { me, loading, error } = useMe();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-sm text-gray-400">
      Loading profile...
    </div>
  );
  if (error || !me) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-500">
      {error ?? "Failed to load profile."}
    </div>
  );

  const p = me.profile;
  const initials = me.name
    ? me.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : me.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div
            className="h-28 w-full"
            style={{ background: "linear-gradient(135deg, #101a3c 0%, #1B2A5E 50%, #3d5494 100%)" }}
          />

          {/* Avatar + info row */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Avatar */}
              <div className="ring-4 ring-white rounded-2xl shadow-md flex-shrink-0">
                {p?.profile_picture ? (
                  <img
                    src={p.profile_picture}
                    alt={me.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-navy-700 text-white flex items-center justify-center text-2xl font-bold">
                    {initials}
                  </div>
                )}
              </div>

              <DropdownButton
                label="Actions"
                variant="primary"
                items={[
                  {
                    label: "Edit Profile",
                    icon: <MdEdit size={15} />,
                    onClick: () => me.uid && navigate(`/admin/users/${me.uid}/edit`),
                  },
                  {
                    label: "Change Password",
                    icon: <MdLock size={15} />,
                    onClick: () => setShowChangePassword(true),
                  },
                ]}
              />
            </div>

            {/* Name / title / badges */}
            <h1 className="text-xl font-bold text-navy-800">{me.name || "—"}</h1>
            {p?.title && <p className="text-sm text-gray-500 mt-0.5">{p.title}</p>}
            <p className="text-sm text-gray-400 mt-0.5">{me.email}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleBadge[me.role] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                <MdAdminPanelSettings size={12} />
                {roleLabel[me.role] ?? me.role}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${me.is_active ? "bg-green-50 text-green-600 border-green-600" : "bg-red-50 text-red-500 border-red-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${me.is_active ? "bg-green-500" : "bg-red-400"}`} />
                {me.is_active ? "Active" : "Inactive"}
              </span>
              {me.is_superuser && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-600">
                  <MdVerified size={12} /> Superuser
                </span>
              )}
              {me.is_staff && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-600">
                  Staff
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left column */}
          <div className="grid grid-cols-1">
            <Card title="Account">
              <InfoRow icon={<MdPerson size={16} />} label="Full Name" value={me.name || "—"} />
              <InfoRow icon={<MdEmail size={16} />} label="Email" value={me.email} />
              
            </Card>

            {(p?.address || p?.city || p?.country || p?.postal_code) && (
              <Card title="Address">
                {p.address     && <InfoRow icon={<MdLocationOn size={16} />} label="Address"     value={p.address} />}
                {p.city        && <InfoRow icon={<MdLocationOn size={16} />} label="City"        value={p.city} />}
                {p.country     && <InfoRow icon={<MdLocationOn size={16} />} label="Country"     value={p.country} />}
                {p.postal_code && <InfoRow icon={<MdLocationOn size={16} />} label="Postal Code" value={p.postal_code} />}
              </Card>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {p && (
              <>
                <Card title="Professional Info">
                  {p.title && <InfoRow icon={<MdWork size={16} />} label="Title" value={p.title} />}
                  {p.bio && (
                    <InfoRow
                      icon={<MdPerson size={16} />}
                      label="Bio"
                      value={<span className="whitespace-pre-wrap text-gray-600 font-normal">{p.bio}</span>}
                    />
                  )}
                  {p.years_experience != null && (
                    <InfoRow
                      icon={<MdSchool size={16} />}
                      label="Experience"
                      value={`${p.years_experience} year${p.years_experience !== 1 ? "s" : ""}`}
                    />
                  )}
                  {p.certifications && (
                    <InfoRow
                      icon={<MdVerified size={16} />}
                      label="Certifications"
                      value={<span className="whitespace-pre-wrap text-gray-600 font-normal">{p.certifications}</span>}
                    />
                  )}
                  {p.linkedin_url && (
                    <InfoRow
                      icon={<FaLinkedin size={14} />}
                      label="LinkedIn"
                      value={
                        <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline inline-flex items-center gap-1">
                          View Profile <MdOpenInNew size={12} />
                        </a>
                      }
                    />
                  )}
                </Card>

                <Card title="Contact">
                  {p.primary_email   && <InfoRow icon={<MdEmail size={16} />}    label="Primary Email"   value={p.primary_email} />}
                  {p.secondary_email && <InfoRow icon={<MdEmail size={16} />}    label="Secondary Email" value={p.secondary_email} />}
                  {p.phone           && <InfoRow icon={<MdPhone size={16} />}    label="Phone"           value={p.phone} />}
                  {p.whatsapp        && <InfoRow icon={<FaWhatsapp size={14} />} label="WhatsApp"        value={p.whatsapp} />}
                </Card>

                <Card title="Documents">
                  <InfoRow
                    icon={<MdLink size={16} />}
                    label="CV / Resume"
                    value={
                      p.cv
                        ? <a href={p.cv} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline inline-flex items-center gap-1">View / Download <MdOpenInNew size={12} /></a>
                        : <span className="text-gray-400 italic font-normal text-xs">No CV uploaded</span>
                    }
                  />
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
};

export default ProfileOverview;
