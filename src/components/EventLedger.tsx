import React, { useState } from 'react';
import { SafetyEvent } from '../types';
import { Shield, Filter, Search, Calendar, Tag, AlertTriangle } from 'lucide-react';

interface EventLedgerProps {
  events: SafetyEvent[];
}

export const EventLedger: React.FC<EventLedgerProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(e => {
    if (filterType !== 'ALL' && e.report_type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.event_id.toLowerCase().includes(q) ||
        e.system_affected.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.narrative.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRiskBadge = (score?: number) => {
    if (!score) return <span className="text-slate-400 text-xs">Unscored</span>;
    if (score >= 16) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
          {score} Critical
        </span>
      );
    }
    if (score >= 11) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          {score} High
        </span>
      );
    }
    if (score >= 6) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
          {score} Med
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        {score} Low
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50">
        <div>
          <h2 className="text-base font-bold text-slate-900">Occurrence & Evidence Ledger</h2>
          <p className="text-xs text-slate-500">
            ECCAIRS 2 / ADREP normalized taxonomy with HFACS human factors tagging
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ATA, airport, narrative..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 w-56 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2 py-1 rounded ${filterType === 'ALL' ? 'bg-slate-200 font-bold text-slate-900' : 'text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('MOR')}
              className={`px-2 py-1 rounded ${filterType === 'MOR' ? 'bg-amber-100 font-bold text-amber-900' : 'text-slate-600'}`}
            >
              MOR
            </button>
            <button
              onClick={() => setFilterType('VRS')}
              className={`px-2 py-1 rounded ${filterType === 'VRS' ? 'bg-blue-100 font-bold text-blue-900' : 'text-slate-600'}`}
            >
              VRS (Confidential)
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Event ID / Type</th>
              <th className="py-3 px-4">Aircraft & Phase</th>
              <th className="py-3 px-4">System Affected (ATA)</th>
              <th className="py-3 px-4">HFACS & Causal Factors</th>
              <th className="py-3 px-4">Risk Evaluation</th>
              <th className="py-3 px-4">Reporter Identity</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map((e) => (
              <tr key={e.event_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono font-bold text-slate-900">{e.event_id}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      e.report_type === 'VRS' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {e.report_type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {e.location}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-medium text-slate-800">{e.aircraft_type}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {e.registration} &bull; <span className="uppercase">{e.phase_of_flight}</span>
                  </div>
                </td>

                <td className="py-3 px-4 max-w-xs">
                  <div className="font-semibold text-slate-900">{e.system_affected}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {e.narrative}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {e.hfacs_tags.length > 0 ? (
                      e.hfacs_tags.map((tag, idx) => (
                        <span key={idx} className="bg-purple-50 text-purple-700 text-[10px] px-1.5 py-0.5 rounded border border-purple-200">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No HFACS tags</span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    {getRiskBadge(e.risk_score)}
                    {e.trend_penalty_applied && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-mono font-bold" title="28-day recurrence penalty applied">
                        +1 Trend
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    L:{e.likelihood || '-'} &times; C:{e.consequence || '-'}
                  </div>
                </td>

                <td className="py-3 px-4">
                  {e.tokenized_reporter_id ? (
                    <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      <span>{e.tokenized_reporter_id}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[11px]">{e.reporter_role}</span>
                  )}
                </td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    e.status === 'ACTION_REQUIRED' ? 'bg-red-50 text-red-700 border border-red-200' :
                    e.status === 'INVESTIGATING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
