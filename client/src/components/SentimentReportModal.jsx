import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useEvents } from '../context/EventContext';
import {
  Sparkles,
  X,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  Loader2,
} from 'lucide-react';

export const SentimentReportModal = () => {
  const { isSentimentModalOpen, setIsSentimentModalOpen, selectedEventForModal } = useEvents();

  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getSentimentAnalysis(selectedEventForModal?._id);
      setSentimentData(data);
    } catch (err) {
      console.error('Failed to load sentiment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSentimentModalOpen) {
      fetchSentiment();
    }
  }, [isSentimentModalOpen, selectedEventForModal]);

  if (!isSentimentModalOpen) return null;

  const analysis = sentimentData?.analysis || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl border border-white my-8 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Gemini AI Sentiment Intelligence
              </h2>
              <p className="text-xs text-slate-500">
                Natural Language Processing over all attendee feedback & reviews
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSentimentModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
            <p className="text-xs text-slate-600 font-semibold">Analyzing attendee review sentiments...</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {/* Overall Verdict Banner */}
            <div className="bg-emerald-50/80 p-5 rounded-3xl border border-emerald-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Overall Verdict</span>
                <h3 className="text-xl font-extrabold text-slate-900">{analysis.overallVerdict || 'Positive'}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">Engine</span>
                <p className="text-xs font-mono font-bold text-emerald-800">
                  {sentimentData?.aiEngine || 'Gemini Flash AI'}
                </p>
              </div>
            </div>

            {/* Sentiment Breakdown Gauges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Smile className="w-4 h-4 text-emerald-600" /> {analysis.positivePercent || 85}% Positive
                </span>
                <span className="flex items-center gap-1.5 text-amber-800">
                  <Meh className="w-4 h-4 text-amber-600" /> {analysis.neutralPercent || 10}% Neutral
                </span>
                <span className="flex items-center gap-1.5 text-rose-800">
                  <Frown className="w-4 h-4 text-rose-600" /> {analysis.negativePercent || 5}% Negative
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                <div
                  style={{ width: `${analysis.positivePercent || 85}%` }}
                  className="bg-emerald-600 h-full"
                ></div>
                <div
                  style={{ width: `${analysis.neutralPercent || 10}%` }}
                  className="bg-amber-500 h-full"
                ></div>
                <div
                  style={{ width: `${analysis.negativePercent || 5}%` }}
                  className="bg-rose-500 h-full"
                ></div>
              </div>
            </div>

            {/* Key Highlights */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                Key Highlights from Attendees
              </h4>
              <div className="space-y-2">
                {analysis.keyHighlights?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                Actionable AI Recommendations for Next Edition
              </h4>
              <div className="space-y-2">
                {analysis.actionableRecommendations?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/60 text-xs text-slate-800 flex items-start gap-2.5 font-medium"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center font-mono font-bold text-emerald-900 shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
