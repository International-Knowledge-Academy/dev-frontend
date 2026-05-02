// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdLock, MdVerified, MdAdminPanelSettings, MdOpenInNew } from "react-icons/md";
import useMe from "hooks/auth/useMe";
import ChangePasswordModal from "components/ui/modals/ChangePasswordModal";

const roleBadge: Record<string, string> = {
  admin:           "bg-navy-50 text-navy-700 border-navy-200",
  account_manager: "bg-gold-50 text-gold-700 border-gold-200",
};
const roleLabel: Record<string, string> = {
  admin:           "Admin",
  account_manager: "Account Manager",
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

const ProfileOverview = () => {
  const navigate = useNavigate();
  const { me, loading, error } = useMe();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading profile...</div>
  );
  if (error || !me) return (
    <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Failed to load profile."}</div>
  );

  const p        = me.profile;
  const initials = me.name
    ? me.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : me.email?.[0]?.toUpperCase() ?? "?";
  const location = [p?.city, p?.country].filter(Boolean).join(", ");

  const hasProfessional = p && (p.title || p.bio || p.years_experience != null || p.certifications || p.linkedin_url);
  const hasContact      = p && (p.primary_email || p.secondary_email || p.phone || p.whatsapp);
  const hasAddress      = p && (p.address || p.city || p.country || p.postal_code);

  const goEdit = () => me.uid && navigate(`/admin/users/${me.uid}/edit`);

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-4">

        {/* ── Identity card ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="flex-shrink-0">
              {p?.profile_picture ? (
                <img src={p.profile_picture} alt={me.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-navy-700 text-white flex items-center justify-center text-xl font-bold ring-4 ring-slate-100 select-none">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-navy-800 leading-tight">{me.name || "—"}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{p?.title || roleLabel[me.role] || me.role}</p>
              {location && <p className="text-xs text-slate-400 mt-0.5">{location}</p>}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${roleBadge[me.role] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                  <MdAdminPanelSettings size={11} />
                  {roleLabel[me.role] ?? me.role}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${me.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${me.is_active ? "bg-green-500" : "bg-red-400"}`} />
                  {me.is_active ? "Active" : "Inactive"}
                </span>
                {me.is_superuser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    <MdVerified size={11} /> Superuser
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button type="button" onClick={goEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-medium text-white transition">
                <MdEdit size={13} /> Edit Profile
              </button>
              <button type="button" onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                <MdLock size={13} /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* ── Details card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

          {/* Account */}
          <Section title="Account">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Full Name" value={me.name} />
              <Field label="Email"     value={me.email} />
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
                        className="text-navy-600 hover:underline inline-flex items-center gap-1 font-normal">
                        View Profile <MdOpenInNew size={11} />
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
                  {p.whatsapp        && <Field label="WhatsApp"        value={p.whatsapp} />}
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
                    className="text-navy-600 hover:underline inline-flex items-center gap-1 font-normal">
                    View / Download CV <MdOpenInNew size={11} />
                  </a>
                } />
              </Section>
            </>
          )}

        </div>
      </div>

      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
    </>
  );
};

export default ProfileOverview;
