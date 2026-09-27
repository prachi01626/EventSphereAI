import React, { useState } from 'react';
import { eventService } from '../services/eventService';
import { useEvents } from '../context/EventContext';
import {
  Sparkles,
  X,
  Wand2,
  Clock,
  CheckCircle,
  Loader2,
  Send,
} from 'lucide-react';

export const EventCopilotModal = () => {
  const { isCopilotOpen, setIsCopilotOpen, fetchEvents } = useEvents();

  const [theme, setTheme] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('75000');
  const [venueType, setVenueType] = useState('Innovation Pavilion & High-Tech Convention Center');
  const [loadingAi, setLoadingAi] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);

  const [blueprint, setBlueprint] = useState(null);

  if (!isCopilotOpen) return null;

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!theme) return;

    setLoadingAi(true);
    try {
      const response = await eventService.getCopilotBlueprint({
        theme,
        targetAudience,
        budget: Number(budget),
        venueType,
      });

      if (response.success && response.blueprint) {
        setBlueprint(response.blueprint);
      }
    } catch (err) {
      console.error('Copilot error:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSaveEvent = async () => {
    if (!blueprint) return;
    setSavingEvent(true);
    try {
      await eventService.createEvent({
        title: blueprint.title,
        description: blueprint.description,
        category: blueprint.category || 'Technology',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        venue: blueprint.venue,
        ticketPrice: blueprint.suggestedTicketPrice || 499,
        budget: Number(budget),
        agenda: blueprint.agenda,
        customFormFields: blueprint.customFormFields,
        promotionalCopy: blueprint.promotionalCopy,
      });

      await fetchEvents();
      setIsCopilotOpen(false);
      setBlueprint(null);
      setTheme('');
    } catch (err) {
      console.error('Failed to save generated event:', err);
    } finally {
      setSavingEvent(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl border border-white my-8 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Gemini AI Event Copilot
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                  Orchestrator
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Transform a single prompt into an end-to-end production-ready event blueprint
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Prompter */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Event Theme or Core Concept *
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Autonomous Agentic AI Summit or Spatial UI Design Workshop"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., AI Researchers, Founders & Product Leads"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Estimated Budget (₹ INR)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="75000"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={loadingAi || !theme}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl forest-pill-active font-bold text-xs shadow-pill transition-all disabled:opacity-50"
            >
              {loadingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                  Generating with Gemini Engine...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-emerald-300" />
                  Generate AI Event Blueprint
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Blueprint Preview Section */}
        {blueprint && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-fadeIn">
            <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200/60 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    {blueprint.category || 'Technology'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{blueprint.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{blueprint.venue}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Suggested Ticket</span>
                  <p className="text-lg font-extrabold text-emerald-800">
                    ₹{blueprint.suggestedTicketPrice || 499}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white/90 p-4 rounded-2xl border border-emerald-200/50">
                {blueprint.description}
              </p>

              {/* 4-Step Agenda */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  4-Step Generated Agenda Timeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {blueprint.agenda?.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 p-3 rounded-2xl border border-emerald-200/50 text-xs shadow-xs"
                    >
                      <span className="text-emerald-700 font-mono font-bold">{step.time}</span>
                      <p className="font-bold text-slate-900 mt-1">{step.topic}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.speaker}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Form Fields */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  Custom Registration Form Fields ({blueprint.customFormFields?.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blueprint.customFormFields?.map((f, idx) => (
                    <div
                      key={idx}
                      className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-xs text-slate-700 flex items-center gap-2 shadow-xs"
                    >
                      <span className="font-bold text-slate-800">{f.fieldName}</span>
                      <span className="text-[10px] text-emerald-700 uppercase font-mono font-semibold">
                        ({f.fieldType})
                      </span>
                      {f.required && (
                        <span className="text-rose-500 text-[10px] font-bold">*req</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotional Copy */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
                  AI Promotional Copy
                </h4>
                <p className="text-xs italic text-slate-700 bg-white/90 p-3.5 rounded-2xl border border-emerald-200/50">
                  "{blueprint.promotionalCopy}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setBlueprint(null)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Reset
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={savingEvent}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl forest-pill-active font-bold text-xs shadow-pill transition-all disabled:opacity-50"
              >
                {savingEvent ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    Publishing Event...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-300" />
                    Publish to Live Event Sphere
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
