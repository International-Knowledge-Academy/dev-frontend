// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEdit, MdPerson, MdEmail, MdWork, MdStar,
  MdMessage, MdCalendarToday, MdSchool,
} from "react-icons/md";
import { Star } from "lucide-react";
import useGetFeedback from "hooks/feedbacks/useGetFeedback";
import Loading from "components/loading/Loading";

const BASE = "/account-manager/feedbacks";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4">
    <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-navy-800 break-words">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 pt-5 pb-2 border-t border-slate-100">{title}</p>
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={16} className={s <= rating ? "text-gold-400 fill-gold-400" : "text-slate-200 fill-slate-200"} />
    ))}
    <span className="ml-1.5 text-sm font-semibold text-slate-600">{rating} / 5</span>
  </div>
);

const FeedbackDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { feedback, loading, error } = useGetFeedback(uid);

  if (loading) return <Loading text="Loading feedback..." />;

  if (error || !feedback) {
    return <div className="flex items-center justify-center py-20 text-sm text-red-500">{error ?? "Feedback not found."}</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {feedback.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-navy-800 truncate leading-snug">{feedback.name}</h1>
            {feedback.position && <p className="text-xs text-slate-400 mt-0.5 truncate">{feedback.position}</p>}
          </div>
          <div className="flex-shrink-0"><StarDisplay rating={feedback.rating} /></div>
        </div>

        <SectionTitle title="Client" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdPerson size={18} />} label="Name"     value={feedback.name     || "—"} />
          <InfoRow icon={<MdEmail  size={18} />} label="Email"    value={feedback.email    || "—"} />
          <InfoRow icon={<MdWork   size={18} />} label="Position" value={feedback.position || "—"} />
          <InfoRow icon={<MdStar   size={18} />} label="Rating"   value={<StarDisplay rating={feedback.rating} />} />
        </div>

        <SectionTitle title="Feedback Message" />
        <div className="px-4 sm:px-6 pb-2">
          <InfoRow icon={<MdMessage size={18} />} label="Message" value={<p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{feedback.message}</p>} />
        </div>

        {feedback.program && (
          <>
            <SectionTitle title="Program" />
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
              <InfoRow icon={<MdSchool size={18} />} label="Program Name" value={feedback.program.name} />
              <InfoRow icon={<MdSchool size={18} />} label="Type" value={<span className="capitalize">{feedback.program.program_type}</span>} />
            </div>
          </>
        )}

        <SectionTitle title="Timestamps" />
        <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2">
          <InfoRow icon={<MdCalendarToday size={18} />} label="Submitted" value={formatDate(feedback.created_at)} />
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex gap-2 mt-2">
          <button type="button" onClick={() => navigate(BASE)} className="flex-1 rounded-md lg:rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            Back
          </button>
          <button type="button" onClick={() => navigate(`${BASE}/${uid}/edit`)} className="flex-1 rounded-md lg:rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition flex items-center justify-center gap-2">
            <MdEdit size={16} /> Edit Feedback
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeedbackDetailPage;
