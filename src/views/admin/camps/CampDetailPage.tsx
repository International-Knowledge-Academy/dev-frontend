// @ts-nocheck
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tent, Users, Calendar, FileText, Upload, Download, Trash2, Pencil,
  MapPin, DollarSign, Clock, AlignLeft, Star,
} from "lucide-react";
import useGetCamp from "hooks/camps/useGetCamp";
import useCampBrochure from "hooks/camps/useCampBrochure";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";

const STATUS_COLORS = {
  upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  open:      "bg-green-50 text-green-600 border-green-200",
  closed:    "bg-red-50 text-red-500 border-red-200",
  completed: "bg-slate-50 text-slate-500 border-slate-200",
};
const STATUS_DOT = {
  upcoming:  "bg-blue-400",
  open:      "bg-green-500",
  closed:    "bg-red-400",
  completed: "bg-slate-300",
};
const STATUS_LABELS = {
  upcoming:  "Upcoming",
  open:      "Open for Registration",
  closed:    "Closed for Registration",
  completed: "Completed",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3.5">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">
      <Icon size={17} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value ?? "—"}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 px-4 sm:px-6 border-b border-slate-100 py-3">
    {title}
  </p>
);

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

const CampDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { camp, loading, error } = useGetCamp(uid);
  const {
    hasBrochure, fileName: brochureFileName, downloadUrl,
    loading: brochureLoading, uploading, progress,
    upload, update: updateBrochure, remove,
  } = useCampBrochure(uid);
  const fileInputRef = useRef(null);

  const handleBrochureFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const ok = hasBrochure ? await updateBrochure(file) : await upload(file);
    if (ok) addToast("Brochure saved.", "success");
    else    addToast("Failed to save brochure.", "error");
  };

  const handleRemove = async () => {
    const ok = await remove();
    if (ok) addToast("Brochure removed.", "success");
    else    addToast("Failed to remove brochure.", "error");
  };

  if (loading) return <Loading text="Loading club..." />;

  if (error || !camp) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error ?? "Club not found."}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center text-white flex-shrink-0">
            <Tent size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">{camp.name}</h1>
            {camp.min_age != null && camp.max_age != null && (
              <p className="text-xs text-slate-400 mt-0.5">Ages {camp.min_age} – {camp.max_age}</p>
            )}
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 ${STATUS_COLORS[camp.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[camp.status] ?? "bg-slate-300"}`} />
            {STATUS_LABELS[camp.status] ?? camp.status}
          </span>
        </div>

        {/* Details */}
        <SectionTitle title="Details" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={Tent}        label="Club Name"  value={camp.name} />
          {camp.location  && <InfoRow icon={MapPin}     label="Location"   value={camp.location} />}
          {camp.min_age != null && camp.max_age != null && (
            <InfoRow icon={Users} label="Age Range" value={`${camp.min_age} – ${camp.max_age} years`} />
          )}
          {camp.capacity  != null && <InfoRow icon={Users}       label="Capacity"   value={camp.capacity} />}
          {camp.camp_fee  && <InfoRow icon={DollarSign}  label="Camp Fee"   value={`KD ${camp.camp_fee}`} />}
          {camp.start_date && <InfoRow icon={Calendar}   label="Start Date" value={formatDate(camp.start_date)} />}
          {camp.end_date   && <InfoRow icon={Calendar}   label="End Date"   value={formatDate(camp.end_date)} />}
          {camp.deadline   && <InfoRow icon={Clock}      label="Deadline"   value={formatDate(camp.deadline)} />}
          <InfoRow icon={Calendar} label="Created" value={formatDate(camp.created_at)} />
        </div>

        {/* Description */}
        {camp.description && (
          <>
            <SectionTitle title="Description" />
            <div className="px-4 sm:px-6">
              <InfoRow icon={AlignLeft} label="Description" value={camp.description} />
            </div>
          </>
        )}

        {/* Highlights */}
        {camp.highlights && (
          <>
            <SectionTitle title="Highlights" />
            <div className="px-4 sm:px-6">
              <InfoRow icon={Star} label="Highlights" value={camp.highlights} />
            </div>
          </>
        )}

        {/* Brochure */}
        <SectionTitle title="Brochure" />
        <div className="px-4 sm:px-6 pb-5">
          <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleBrochureFile} />
          {uploading ? (
            <div className="space-y-1.5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-navy-700">Uploading...</span>
                <span className="text-xs font-semibold text-navy-600">{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-navy-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap py-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-gold-600" />
                </div>
                <div className="min-w-0">
                  {brochureLoading ? (
                    <p className="text-xs text-slate-400">Loading...</p>
                  ) : hasBrochure ? (
                    <p className="text-xs text-slate-600 truncate max-w-[220px]">{brochureFileName ?? "brochure.pdf"}</p>
                  ) : (
                    <p className="text-xs text-slate-400">No brochure uploaded yet</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md lg:rounded-lg text-xs font-semibold bg-navy-700 text-white hover:bg-navy-800 transition"
                >
                  <Upload size={12} /> {hasBrochure ? "Replace" : "Upload PDF"}
                </button>
                {hasBrochure && (
                  <>
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md lg:rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-700 transition"
                    >
                      <Download size={12} /> Download
                    </a>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={brochureLoading}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md lg:rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 transition"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/clubs")}
            className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/clubs/${uid}/edit`)}
            className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2"
          >
            <Pencil size={15} /> Edit Club
          </button>
        </div>

      </div>
    </div>
  );
};

export default CampDetailPage;
