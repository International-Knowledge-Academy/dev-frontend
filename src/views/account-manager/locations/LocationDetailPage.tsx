// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdLocationOn, MdLocationCity, MdPublic,
  MdPlace, MdMyLocation, MdToggleOn, MdSchool,
  MdCalendarToday, MdInfo, MdPhone,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import useGetLocation from "hooks/locations/useGetLocation";
import Loading from "components/loading/Loading";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 pt-5 pb-2 border-t border-slate-100">
    {title}
  </p>
);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

const LocationDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { location, loading, error } = useGetLocation(uid);

  if (loading) return <Loading text="Loading location..." />;

  if (error || !location) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Location not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdLocationOn size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">{location.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{location.city}, {location.country}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
              location.is_active
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${location.is_active ? "bg-green-500" : "bg-slate-300"}`} />
              {location.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Thumbnail */}
        {location.thumbnail && (
          <>
            <SectionTitle title="Thumbnail" />
            <div className="px-4 sm:px-6 pb-4">
              <img
                src={location.thumbnail}
                alt={location.name}
                className="w-full max-h-56 object-cover rounded-lg border border-slate-100"
              />
            </div>
          </>
        )}

        {/* Location Info */}
        <SectionTitle title="Location" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdLocationCity size={18} />} label="City"          value={location.city          || "—"} />
          <InfoRow icon={<MdPublic       size={18} />} label="Country"       value={location.country       || "—"} />
          <InfoRow icon={<MdPlace        size={18} />} label="Address"       value={location.address       || "—"} />
          <InfoRow icon={<MdInfo         size={18} />} label="Venue Details" value={location.venue_details || "—"} />
        </div>

        {/* Contact */}
        <SectionTitle title="Contact" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdPhone    size={18} />} label="Contact Phone"   value={location.contact_phone   || "—"} />
          <InfoRow icon={<FaWhatsapp size={18} />} label="WhatsApp Number" value={location.whatsapp_number || "—"} />
        </div>

        {/* Coordinates */}
        <SectionTitle title="Coordinates" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdMyLocation size={18} />} label="Latitude"  value={location.latitude  || "—"} />
          <InfoRow icon={<MdMyLocation size={18} />} label="Longitude" value={location.longitude || "—"} />
        </div>

        {/* Stats */}
        <SectionTitle title="Stats" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdSchool size={18} />}
            label="Course Count"
            value={
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700">
                {location.course_count}
              </span>
            }
          />
          <InfoRow
            icon={<MdToggleOn size={18} />}
            label="Status"
            value={
              <span className={`font-semibold ${location.is_active ? "text-green-500" : "text-slate-400"}`}>
                {location.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
        </div>

        {/* Timestamps */}
        <SectionTitle title="Timestamps" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdCalendarToday size={18} />} label="Created"      value={formatDate(location.created_at)} />
          <InfoRow icon={<MdCalendarToday size={18} />} label="Last Updated" value={formatDate(location.updated_at)} />
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/account-manager/locations")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/account-manager/locations/${uid}/edit`)}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit Location
          </button>
        </div>

      </div>
    </div>
  );
};

export default LocationDetailPage;
