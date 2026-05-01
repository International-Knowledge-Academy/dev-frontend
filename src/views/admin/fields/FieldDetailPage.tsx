// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdLayers, MdPerson } from "react-icons/md";
import useGetField from "hooks/fields/useGetField";
import Button from "components/ui/buttons/Button";
import { getMediaUrl } from "types/field";

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-6 mb-3 px-4 sm:px-6">{children}</p>
);

const InfoRow = ({ label, children }) => (
  <div className="py-3 border-b border-slate-100 last:border-0">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <div className="text-sm font-medium text-navy-800">{children}</div>
  </div>
);

const FieldDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { field, loading, error } = useGetField(uid);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-400">Loading field...</div>;
  }

  if (error || !field) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Field not found."}</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: field.hex_color || "#1e3a5f", color: field.text_color || "#ffffff" }}
          >
            <MdLayers size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate">{field.name}</h1>
            {field.category?.name && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{field.category.name}</p>
            )}
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 ${
            field.is_active
              ? "bg-green-50 text-green-600 border-green-600"
              : "bg-red-50 text-red-500 border-red-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${field.is_active ? "bg-green-500" : "bg-red-400"}`} />
            {field.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details */}
        <SectionLabel>Details</SectionLabel>
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <InfoRow label="Name">{field.name}</InfoRow>
          <InfoRow label="Category">
            {field.category?.name ?? <span className="italic text-slate-400">None</span>}
          </InfoRow>
          <InfoRow label="Programs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700">
              {field.program_count ?? 0}
            </span>
          </InfoRow>
          {field.description && (
            <div className="md:col-span-2 py-3 border-b border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed">{field.description}</p>
            </div>
          )}
          <InfoRow label="Background Color">
            <div className="flex items-center gap-2">
              {field.hex_color && (
                <span className="w-5 h-5 rounded-md border border-slate-200 flex-shrink-0" style={{ backgroundColor: field.hex_color }} />
              )}
              <span className="font-mono">{field.hex_color || <span className="italic text-slate-400">Not set</span>}</span>
            </div>
          </InfoRow>
          <InfoRow label="Text Color">
            <div className="flex items-center gap-2">
              {field.text_color && (
                <span className="w-5 h-5 rounded-md border border-slate-200 flex-shrink-0" style={{ backgroundColor: field.text_color }} />
              )}
              <span className="font-mono">{field.text_color || <span className="italic text-slate-400">Not set</span>}</span>
            </div>
          </InfoRow>
        </div>

        {/* Color preview */}
        <div className="px-4 sm:px-6 pb-4">
          <div
            className="rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ backgroundColor: field.hex_color || "#1e3a5f", color: field.text_color || "#ffffff" }}
          >
            {field.name}
          </div>
        </div>

        {/* Thumbnail */}
        {getMediaUrl(field.thumbnail) && (
          <>
            <SectionLabel>Thumbnail</SectionLabel>
            <div className="px-4 sm:px-6 pb-4">
              <img
                src={getMediaUrl(field.thumbnail)}
                alt={field.name}
                className="w-48 h-32 rounded-xl object-cover border border-slate-200"
              />
            </div>
          </>
        )}

        {/* Video */}
        {getMediaUrl(field.video) && (
          <>
            <SectionLabel>Video</SectionLabel>
            <div className="px-4 sm:px-6 pb-4">
              <video
                src={getMediaUrl(field.video)}
                controls
                className="w-full max-w-lg rounded-xl border border-slate-200"
              />
            </div>
          </>
        )}

        {/* Trainers */}
        {field.trainers?.length > 0 && (
          <>
            <SectionLabel>Trainers</SectionLabel>
            <div className="px-4 sm:px-6 pb-4 flex flex-col gap-3">
              {field.trainers.map((trainer) => (
                <div key={trainer.uid} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  {trainer.profile_picture ? (
                    <img
                      src={trainer.profile_picture}
                      alt={trainer.user?.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-navy-100 border border-navy-200 flex items-center justify-center flex-shrink-0">
                      <MdPerson size={18} className="text-navy-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800 truncate">{trainer.user?.name}</p>
                    {trainer.title && <p className="text-xs text-slate-400 truncate">{trainer.title}</p>}
                    {trainer.bio   && <p className="text-xs text-slate-500 mt-0.5 truncate">{trainer.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2">
          <Button
            type="button"
            text="Back"
            onClick={() => navigate("/admin/fields")}
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
            text="Edit Field"
            icon={<MdEdit size={15} />}
            onClick={() => navigate(`/admin/fields/${uid}/edit`)}
            className="flex-1 py-2.5"
          />
        </div>

      </div>
    </div>
  );
};

export default FieldDetailPage;
