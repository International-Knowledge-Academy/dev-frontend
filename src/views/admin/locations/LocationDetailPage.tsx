// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdLocationOn, MdLocationCity, MdPublic,
  MdPlace, MdMyLocation, MdToggleOn, MdSchool,
  MdCalendarToday, MdInfo,
} from "react-icons/md";
import useGetLocation from "hooks/locations/useGetLocation";
import Button from "components/ui/buttons/Button";

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-navy-700">
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

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

const LocationDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { location, loading, error } = useGetLocation(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading location...
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Location not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-navy-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <MdLocationOn size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 dark:text-white leading-snug">{location.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{location.city}, {location.country}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
              location.is_active
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-500 border-red-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${location.is_active ? "bg-green-500" : "bg-red-400"}`} />
              {location.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Location Info */}
        <SectionTitle title="Location" />
        <div className="px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdLocationCity size={18} />}
            label="City"
            value={location.city || "—"}
          />
          <InfoRow
            icon={<MdPublic size={18} />}
            label="Country"
            value={location.country || "—"}
          />
          <InfoRow
            icon={<MdPlace size={18} />}
            label="Address"
            value={location.address || "—"}
          />
          <InfoRow
            icon={<MdInfo size={18} />}
            label="Venue Details"
            value={location.venue_details || "—"}
          />
        </div>

        {/* Coordinates */}
        <SectionTitle title="Coordinates" />
        <div className="px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdMyLocation size={18} />}
            label="Latitude"
            value={location.latitude || "—"}
          />
          <InfoRow
            icon={<MdMyLocation size={18} />}
            label="Longitude"
            value={location.longitude || "—"}
          />
        </div>

        {/* Stats */}
        <SectionTitle title="Stats" />
        <div className="px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdSchool size={18} />}
            label="Course Count"
            value={
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700 dark:bg-navy-700 dark:text-white">
                {location.course_count}
              </span>
            }
          />
          <InfoRow
            icon={<MdToggleOn size={18} />}
            label="Status"
            value={
              <span className={`font-semibold ${location.is_active ? "text-green-500" : "text-red-500"}`}>
                {location.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
        </div>

        {/* Timestamps */}
        <SectionTitle title="Timestamps" />
        <div className="px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Created"
            value={formatDate(location.created_at)}
          />
          <InfoRow
            icon={<MdCalendarToday size={18} />}
            label="Last Updated"
            value={formatDate(location.updated_at)}
          />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-navy-700 flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/locations")}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/locations/${uid}/edit`)}
            className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
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
