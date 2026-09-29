import React, { useState, useEffect, useRef } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useEvents } from '../context/EventContext';
import {
  Users,
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';

export const VolunteerAllocationModal = () => {
  const { isVolunteerModalOpen, setIsVolunteerModalOpen } = useEvents();

  const [participants, setParticipants] = useState(600);
  const [volunteers, setVolunteers] = useState(35);
  const [allocation, setAllocation] = useState(null);
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const outerWrapperRef = useRef(null);
  const contentRef = useRef(null);
  const modalCardRef = useRef(null);

  const fetchAllocation = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.allocateVolunteers(participants, volunteers);
      setAllocation(data);

      const counts = {};
      data.departments?.forEach((d) => {
        counts[d.key] = d.count;
      });
      setDepartmentCounts(counts);
    } catch (err) {
      console.error('Failed to calculate volunteer allocation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVolunteerModalOpen) {
      fetchAllocation();

      const resetScroll = () => {
        if (outerWrapperRef.current) outerWrapperRef.current.scrollTop = 0;
        if (contentRef.current) contentRef.current.scrollTop = 0;
        if (modalCardRef.current) modalCardRef.current.scrollTop = 0;
      };

      resetScroll();
      requestAnimationFrame(resetScroll);
    }
  }, [isVolunteerModalOpen]);

  if (!isVolunteerModalOpen) return null;

  const handleSliderChange = (key, val) => {
    setDepartmentCounts((prev) => ({
      ...prev,
      [key]: Number(val),
    }));
  };

  const totalAssigned = Object.values(departmentCounts).reduce((a, b) => a + b, 0);

  return (
    <div
      ref={outerWrapperRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 md:p-8 flex justify-center items-start"
    >
      <div
        ref={modalCardRef}
        className="relative w-full max-w-3xl rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl border border-white my-auto max-h-[90vh] flex flex-col text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                AI Volunteer Allocation Engine
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                  5-Department Dispatch
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Algorithmic headcount balancing with real-time operational load simulation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVolunteerModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Scrollable Content */}
        <div
          ref={contentRef}
          className="overflow-y-auto flex-1 pr-1.5 space-y-6 my-4"
        >
          {/* Input Parameters Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/50">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Total Expected Attendees
              </label>
              <input
                type="number"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Total Volunteers Available
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  value={volunteers}
                  onChange={(e) => setVolunteers(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
                <button
                  onClick={fetchAllocation}
                  disabled={loading}
                  className="px-4 py-2 forest-pill-active rounded-xl text-xs font-bold shrink-0 shadow-xs"
                >
                  Recalculate
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          {allocation && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Staffing Ratio</span>
                <p className="text-xl font-extrabold text-slate-900 font-mono">
                  {allocation.participantToVolunteerRatio}
                </p>
                <p className="text-[11px] text-slate-500">Attendees per volunteer</p>
              </div>

              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Risk Assessment</span>
                <p className="text-xl font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  {allocation.riskLevel}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">Operational stability index</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Headcount Balance</span>
                <p className="text-xl font-extrabold text-slate-900 font-mono">
                  {totalAssigned} / {volunteers}
                </p>
                <p className="text-[11px] text-slate-500">Assigned vs capacity</p>
              </div>
            </div>
          )}

          {/* 5 Core Departments with Interactive Override Sliders */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              Departmental Distribution & Manual Override Sliders
            </h3>

            <div className="space-y-2.5">
              {allocation?.departments?.map((dept) => {
                const currentVal = departmentCounts[dept.key] ?? dept.count;
                return (
                  <div
                    key={dept.key}
                    className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{dept.department}</span>
                        <span className="ml-2 text-emerald-800 font-mono text-[11px] font-semibold">
                          ({dept.percentage}% baseline)
                        </span>
                      </div>
                      <span className="font-bold text-emerald-800 font-mono text-sm bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                        {currentVal} Staff
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-tight">
                      {dept.responsibilities}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min="1"
                        max={Math.max(15, volunteers)}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(dept.key, e.target.value)}
                        className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <span className="text-[10px] text-slate-500 font-semibold w-16 text-right">
                        {Math.round((currentVal / (totalAssigned || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Recommendations & 3-Shift Timeline */}
          {allocation && (
            <div className="pt-5 border-t border-slate-200 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  AI Dispatch Advisory
                </h4>
                <div className="space-y-1.5">
                  {allocation.recommendations?.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-slate-800 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  Recommended Shift Roster
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {allocation.shiftSchedule?.map((shift, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <p className="font-bold text-slate-900">{shift.shift}</p>
                      <p className="text-[11px] font-mono text-emerald-700 font-bold">{shift.time}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{shift.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => setIsVolunteerModalOpen(false)}
            className="px-6 py-2.5 forest-pill-active rounded-2xl text-xs font-bold shadow-pill"
          >
            Apply Staffing Plan
          </button>
        </div>
      </div>
    </div>
  );
};
