import React, { useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useEvents } from '../context/EventContext';
import { MessageSquare, Star, X, Send, Loader2, CheckCircle2 } from 'lucide-react';

export const FeedbackModal = () => {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen, selectedEventForModal } = useEvents();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isFeedbackModalOpen || !selectedEventForModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) return;

    setLoading(true);
    try {
      await analyticsService.submitFeedback(selectedEventForModal._id, rating, reviewText);
      setSubmitted(true);
      setTimeout(() => {
        setIsFeedbackModalOpen(false);
        setSubmitted(false);
        setReviewText('');
      }, 1800);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl border border-white my-8 text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Share Event Feedback</h2>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                {selectedEventForModal.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFeedbackModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-extrabold text-slate-900">Thank You!</h3>
            <p className="text-xs text-slate-600">
              Your review will be processed by our Gemini Sentiment Engine.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Your Experience & Review *
              </label>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you love? How was the dynamic check-in? Any technical suggestions?"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 placeholder-slate-400 shadow-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !reviewText}
                className="w-full py-3 forest-pill-active font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-pill disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-300" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
