// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdLayers, MdPerson } from "react-icons/md";
import useGetField from "hooks/fields/useGetField";

const FieldDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { field, loading, error } = useGetField(uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading field...
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Field not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-navy-700 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: field.hex_color || "#1e3a5f",
              color: field.text_color || "#ffffff",
            }}
          >
            <MdLayers size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 dark:text-white">{field.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{field.uid}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
            field.is_active
              ? "bg-green-50 text-green-600 border-green-600"
              : "bg-red-50 text-red-500 border-red-600"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${field.is_active ? "bg-green-500" : "bg-red-400"}`} />
            {field.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details grid */}
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Name</p>
            <p className="text-sm font-medium text-navy-800 dark:text-white">{field.name}</p>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Category</p>
            <p className="text-sm font-medium text-navy-800 dark:text-white">
              {field.category?.name ?? <span className="italic text-gray-400">None</span>}
            </p>
          </div>

          {/* Programs count */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Programs</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700 dark:bg-navy-700 dark:text-white">
              {field.program_count ?? 0}
            </span>
          </div>

          {/* Description */}
          {field.description && (
            <div className="md:col-span-2">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-600 dark:text-navy-300 leading-relaxed">{field.description}</p>
            </div>
          )}

          {/* Background Color */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Background Color</p>
            <div className="flex items-center gap-2">
              {field.hex_color && (
                <span
                  className="w-6 h-6 rounded-md border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: field.hex_color }}
                />
              )}
              <span className="text-sm font-medium text-navy-800 dark:text-white font-mono">
                {field.hex_color || <span className="italic text-gray-400">Not set</span>}
              </span>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Text Color</p>
            <div className="flex items-center gap-2">
              {field.text_color && (
                <span
                  className="w-6 h-6 rounded-md border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: field.text_color }}
                />
              )}
              <span className="text-sm font-medium text-navy-800 dark:text-white font-mono">
                {field.text_color || <span className="italic text-gray-400">Not set</span>}
              </span>
            </div>
          </div>

          {/* Thumbnail */}
          {field.thumbnail && (
            <div className="md:col-span-2">
              <p className="text-xs text-gray-400 mb-2">Thumbnail</p>
              <img
                src={field.thumbnail}
                alt={field.name}
                className="w-40 h-28 rounded-xl object-cover border border-gray-200"
              />
            </div>
          )}

          {/* Video URL */}
          {field.video && (
            <div className="md:col-span-2">
              <p className="text-xs text-gray-400 mb-1">Video URL</p>
              <a
                href={field.video}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-navy-600 hover:underline break-all"
              >
                {field.video}
              </a>
            </div>
          )}
        </div>

        {/* Trainers */}
        {field.trainers && field.trainers.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 dark:border-navy-700">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Trainers</p>
            <div className="flex flex-col gap-3">
              {field.trainers.map((trainer) => (
                <div key={trainer.uid} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-navy-700 border border-gray-100 dark:border-navy-600">
                  {trainer.profile_picture ? (
                    <img
                      src={trainer.profile_picture}
                      alt={trainer.user?.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-navy-100 border border-navy-200 flex items-center justify-center flex-shrink-0">
                      <MdPerson size={18} className="text-navy-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800 dark:text-white">{trainer.user?.name}</p>
                    <p className="text-xs text-gray-400">{trainer.title}</p>
                    {trainer.bio && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{trainer.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-navy-700 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/fields")}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/fields/${uid}/edit`)}
            className="flex-1 rounded-xl bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <MdEdit size={16} />
            Edit Field
          </button>
        </div>

      </div>
    </div>
  );
};

export default FieldDetailPage;
