// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdAdminPanelSettings, MdVerified, MdOpenInNew, MdLink } from "react-icons/md";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import useGetUser from "hooks/users/useGetUser";
import Button from "components/ui/buttons/Button";

const roleBadgeStyle: Record<string, string> = {
  admin:           "bg-navy-50 text-navy-700 border-navy-200",
  account_manager: "bg-gold-50 text-gold-700 border-gold-200",
  trainer:         "bg-green-50 text-green-700 border-green-200",
};
const roleLabel: Record<string, string> = {
  admin:           "Admin",
  account_manager: "Account Manager",
  trainer:         "Trainer",
};

const SectionTitle = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{children}</p>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 w-28 flex-shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-navy-800 font-medium flex-1 min-w-0 break-words">{value}</span>
  </div>
);

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useGetUser(id);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading profile...</div>;
  }
  if (error || !user) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "User not found."}</div>;
  }

  const p = user.profile;
  const initials = user.name
    ? user.name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";

  const hasProfessional = p?.bio || p?.years_experience != null || p?.certifications || p?.linkedin_url;
  const hasContact      = p?.primary_email || p?.secondary_email || p?.phone || p?.whatsapp;
  const hasAddress      = p?.address || p?.city || p?.country || p?.postal_code;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 sm:px-6 py-5">

        {/* Main row: avatar | info | buttons */}
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className="flex-shrink-0">
            {p?.profile_picture ? (
              <img
                src={p.profile_picture}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-slate-100"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-navy-700 text-white flex items-center justify-center text-lg sm:text-xl font-bold ring-4 ring-slate-100 select-none">
                {initials}
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-navy-800 truncate">{user.name || "—"}</h1>
            {p?.title && (
              <p className="text-sm text-slate-500 mt-0.5 truncate">{p.title}</p>
            )}
            <p className="text-sm text-slate-400 mt-0.5 truncate">{user.email}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${roleBadgeStyle[user.role] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                <MdAdminPanelSettings size={11} />
                {roleLabel[user.role] ?? user.role}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
                user.is_active
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-400"}`} />
                {user.is_active ? "Active" : "Inactive"}
              </span>
              {user.is_superuser && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  <MdVerified size={11} /> Superuser
                </span>
              )}
            </div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Button
              type="button"
              text="Back"
              onClick={() => navigate("/admin/users")}
              bgColor="bg-white"
              textColor="text-slate-600"
              borderColor="border-slate-200"
              hoverBgColor="hover:bg-slate-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="button"
              variant="primary"
              text="Edit"
              icon={<MdEdit size={14} />}
              onClick={() => navigate(`/admin/users/${id}/edit`)}
            />
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="flex sm:hidden gap-2 mt-4 pt-4 border-t border-slate-100">
          <Button
            type="button"
            text="Back"
            onClick={() => navigate("/admin/users")}
            className="flex-1 py-2.5"
            bgColor="bg-white"
            textColor="text-slate-600"
            borderColor="border-slate-200"
            hoverBgColor="hover:bg-slate-50"
            hoverTextColor=""
            hoverBorderColor=""
          />
          <Button
            type="button"
            variant="primary"
            text="Edit"
            icon={<MdEdit size={14} />}
            onClick={() => navigate(`/admin/users/${id}/edit`)}
            className="flex-1 py-2.5"
          />
        </div>
      </div>

      {/* ── Professional | Contact ────────────────────────────────────────── */}
      {(hasProfessional || hasContact) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Professional */}
          {hasProfessional && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <SectionTitle>Professional</SectionTitle>

              {p?.bio && (
                <div className="py-2.5 border-b border-slate-50">
                  <p className="text-xs text-slate-400 mb-1">Bio</p>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{p.bio}</p>
                </div>
              )}
              {p?.years_experience != null && (
                <InfoRow
                  label="Experience"
                  value={`${p.years_experience} year${p.years_experience !== 1 ? "s" : ""}`}
                />
              )}
              {p?.certifications && (
                <div className="py-2.5 border-b border-slate-50 last:border-0">
                  <p className="text-xs text-slate-400 mb-1">Certifications</p>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{p.certifications}</p>
                </div>
              )}
              {p?.linkedin_url && (
                <div className="py-2.5">
                  <p className="text-xs text-slate-400 mb-1">LinkedIn</p>
                  <a
                    href={p.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-800 hover:underline break-all"
                  >
                    <FaLinkedin size={13} className="flex-shrink-0" />
                    View Profile
                    <MdOpenInNew size={11} className="flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Contact */}
          {hasContact && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <SectionTitle>Contact</SectionTitle>
              {p?.primary_email   && <InfoRow label="Primary Email"   value={p.primary_email} />}
              {p?.secondary_email && <InfoRow label="Secondary Email" value={p.secondary_email} />}
              {p?.phone           && <InfoRow label="Phone"           value={p.phone} />}
              {p?.whatsapp && (
                <InfoRow
                  label="WhatsApp"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <FaWhatsapp size={13} className="text-green-500 flex-shrink-0" />
                      {p.whatsapp}
                    </span>
                  }
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Address ──────────────────────────────────────────────────────── */}
      {hasAddress && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <SectionTitle>Address</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {p?.address     && <InfoRow label="Street"      value={p.address} />}
            {p?.city        && <InfoRow label="City"        value={p.city} />}
            {p?.country     && <InfoRow label="Country"     value={p.country} />}
            {p?.postal_code && <InfoRow label="Postal Code" value={p.postal_code} />}
          </div>
        </div>
      )}

      {/* ── Documents ────────────────────────────────────────────────────── */}
      {p?.cv && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <SectionTitle>Documents</SectionTitle>
          <a
            href={p.cv}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md lg:rounded-lg border border-navy-200 bg-navy-50 text-sm font-medium text-navy-700 hover:bg-navy-100 transition"
          >
            <MdLink size={16} />
            View / Download CV
            <MdOpenInNew size={13} />
          </a>
        </div>
      )}

    </div>
  );
};

export default UserProfilePage;
