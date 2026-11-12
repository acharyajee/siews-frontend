import React from 'react';
import { SafetyEvent } from '../types';
import { useTenant } from '../context/TenantContext';
import { AlertCircle, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

interface RiskMatrixProps {
  events: SafetyEvent[];
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ events }) => {
  const { tenant } = useTenant();

  const likelihoodLabels = [
    { score: 5, name: '5 - Frequent' },
    { score: 4, name: '4 - Likely' },
    { score: 3, name: '3 - Possible' },
    { score: 2, name: '2 - Unlikely' },
    { score: 1, name: '1 - Rare' },
  ];

  const consequenceLabels = [
    { score: 1, name: '1 - Negligible' },
    { score: 2, name: '2 - Minor' },
    { score: 3, name: '3 - Major' },
    { score: 4, name: '4 - Hazardous' },
    { score: 5, name: '5 - Catastrophic' },
  ];

  // Helper to get cell color class based on score ladder
  const getCellClass = (l: number, c: number) => {
    const score = l * c;
    if (score >= 16) return 'bg-red-500 text-white font-bold hover:bg-red-600';
    if (score >= 11) return 'bg-amber-500 text-white font-bold hover:bg-amber-600';
    if (score >= 6) return 'bg-yellow-100 text-yellow-900 font-semibold hover:bg-yellow-200';
    return 'bg-emerald-50 text-emerald-800 font-medium hover:bg-emerald-100';
  };

  // Count events in each cell
  const getEventsInCell = (l: number, c: number) => {
    return events.filter(e => (e.likelihood || 3) === l && (e.consequence || 3) === c);
  };

  const trendPenalizedEvents = events.filter(e => e.trend_penalty_applied);
  const criticalEvents = events.filter(e => (e.risk_score || 0) >= 16);

  return (
    <div className="space-y-6">
      {/* Top Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Total Occurrences</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{events.length}</div>
          <p className="text-xs text-slate-500 mt-1">VRS & MOR ingested records</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Critical Risks (&ge; 16)</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">{criticalEvents.length}</div>
          <p className="text-xs text-slate-500 mt-1">24h SLA Task Force Alert</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>28-Day Trend Penalties</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{trendPenalizedEvents.length}</div>
          <p className="text-xs text-slate-500 mt-1">&ge; 3 recurring cluster events (+1 band)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Active Aircraft Fleet</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-slate-800 mt-2 truncate">
            {tenant.fleets.map(f => f.aircraft_type).join(', ') || 'General Fleet'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Normalized to ECCAIRS 2</p>
        </div>
      </div>

      {/* 5x5 Risk Matrix Grid */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              5 &times; 5 Aviation Safety Risk Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Core formula: Risk Score = Likelihood &times; Consequence. Dynamic exposure &amp; 28-day recurrence weighting active.
            </p>
          </div>
          {/* Scoring Ladder Legend */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300"></span> 1-5 Low</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200 border border-yellow-400"></span> 6-10 Medium</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500"></span> 11-15 High</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span> 16-25 Critical</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[650px]">
            {/* Column Headers (Consequence) */}
            <div className="grid grid-cols-6 gap-2 mb-2 text-xs font-semibold text-slate-600 text-center">
              <div className="p-2 text-right text-slate-400 font-bold uppercase tracking-wider">Likelihood \ Consequence</div>
              {consequenceLabels.map(c => (
                <div key={c.score} className="p-2 bg-slate-100 rounded-lg">
                  {c.name}
                </div>
              ))}
            </div>

            {/* Rows (Likelihood) */}
            {likelihoodLabels.map(l => (
              <div key={l.score} className="grid grid-cols-6 gap-2 mb-2">
                <div className="p-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg flex items-center justify-end text-right">
                  {l.name}
                </div>
                {consequenceLabels.map(c => {
                  const score = l.score * c.score;
                  const matchingEvents = getEventsInCell(l.score, c.score);
                  return (
                    <div
                      key={c.score}
                      className={`h-16 rounded-lg p-2 transition-all cursor-pointer flex flex-col justify-between border ${getCellClass(l.score, c.score)}`}
                    >
                      <div className="text-[11px] opacity-75">
                        Score: {score}
                      </div>
                      <div className="text-center font-bold text-lg">
                        {matchingEvents.length > 0 ? (
                          <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs">
                            {matchingEvents.length} event{matchingEvents.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="opacity-25 text-xs">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Causal Analysis Bow-Tie Summary (Section 4 in PDF) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Active Bow-Tie Hazard & Barrier Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-blue-700 uppercase">Precursor Threat Line</span>
              <p className="text-xs text-slate-700 mt-1 font-medium">STOL High-Elevation Runway Contamination</p>
              <div className="mt-2 text-[11px] text-slate-500">Barrier: Enhanced reverse thrust monitoring & runway friction friction coefficient protocol.</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-amber-700 uppercase">Technical Escalation Path</span>
              <p className="text-xs text-slate-700 mt-1 font-medium">ATA 27 Flap Asymmetry Sensor Micro-Drift</p>
              <div className="mt-2 text-[11px] text-slate-500">Barrier: Minimum Cut Set FTA redundant channel sensor check before line dispatch.</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-purple-700 uppercase">HFACS / Human Factors Barrier</span>
              <p className="text-xs text-slate-700 mt-1 font-medium">Crew Fatigue & High Turnaround Load</p>
              <div className="mt-2 text-[11px] text-slate-500">Barrier: Automated rostering limit check during adverse weather windows.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
