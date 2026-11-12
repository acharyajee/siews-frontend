import React from 'react';
import { AssuranceCase, GSNNode } from '../types';
import { useTenant } from '../context/TenantContext';
import { Award, Hash, CheckCircle, FileCheck, Layers, Link2 } from 'lucide-react';

interface AssuranceCaseViewProps {
  assuranceCase: AssuranceCase;
}

export const AssuranceCaseView: React.FC<AssuranceCaseViewProps> = ({ assuranceCase }) => {
  const { tenant } = useTenant();

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'GOAL': return 'border-blue-600 bg-blue-50/50 text-blue-900';
      case 'STRATEGY': return 'border-purple-600 bg-purple-50/50 text-purple-900';
      case 'CLAIM': return 'border-amber-600 bg-amber-50/50 text-amber-900';
      case 'EVIDENCE': return 'border-emerald-600 bg-emerald-50/50 text-emerald-900';
      case 'CONTEXT': return 'border-slate-400 bg-slate-50 text-slate-700';
      case 'ASSUMPTION': return 'border-slate-400 bg-slate-50 text-slate-700';
      default: return 'border-slate-300 bg-white text-slate-800';
    }
  };

  const getNodeBadge = (type: string) => {
    switch (type) {
      case 'GOAL': return 'bg-blue-600 text-white';
      case 'STRATEGY': return 'bg-purple-600 text-white';
      case 'CLAIM': return 'bg-amber-600 text-white';
      case 'EVIDENCE': return 'bg-emerald-600 text-white';
      case 'CONTEXT': return 'bg-slate-500 text-white';
      case 'ASSUMPTION': return 'bg-slate-500 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const nodes = assuranceCase.nodes || [];
  const goals = nodes.filter(n => n.node_type === 'GOAL');
  const strategies = nodes.filter(n => n.node_type === 'STRATEGY');
  const claims = nodes.filter(n => n.node_type === 'CLAIM');
  const evidence = nodes.filter(n => n.node_type === 'EVIDENCE');
  const contexts = nodes.filter(n => n.node_type === 'CONTEXT' || n.node_type === 'ASSUMPTION');

  return (
    <div className="space-y-6">
      {/* Case Header & Version Freeze Stamp */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">{assuranceCase.title}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Issue v{assuranceCase.version}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {assuranceCase.scope_context} &bull; Mapped to {(assuranceCase.regulatory_mapping || []).join(', ')}
            </p>
          </div>

          {/* Model Hash & Regulatory Seal */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right">
            <div className="flex items-center gap-1.5 justify-end text-xs font-bold text-slate-700">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Deterministic Model Hash</span>
            </div>
            <div className="font-mono text-[10px] text-slate-500 tracking-wider truncate max-w-xs mt-0.5">
              {assuranceCase.model_hash}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
              &check; Inputs & Evidence Graph Cryptographically Frozen
            </div>
          </div>
        </div>

        {/* Tree Hierarchy Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">Notation:</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Goal (Claim of safety)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-600"></span> Strategy (Argumentation path)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span> Sub-Claim (Specific condition)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Evidence / Solution (Verified record)</span>
        </div>
      </div>

      {/* GSN Visual Hierarchy */}
      <div className="space-y-6">
        {/* Tier 1: Root Goal */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Root Claim</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.map(g => (
              <div key={g.node_id} className={`p-4 rounded-xl border-2 shadow-sm ${getNodeColor(g.node_type)} md:col-span-2`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getNodeBadge(g.node_type)}`}>
                    {g.node_id}: {g.node_type}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    VALIDATED
                  </span>
                </div>
                <div className="text-sm font-bold">{g.title}</div>
                <div className="text-xs text-slate-600 mt-1">{g.description}</div>
              </div>
            ))}

            {contexts.map(c => (
              <div key={c.node_id} className={`p-4 rounded-xl border shadow-sm ${getNodeColor(c.node_type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getNodeBadge(c.node_type)}`}>
                    {c.node_id}: {c.node_type}
                  </span>
                </div>
                <div className="text-xs font-bold">{c.title}</div>
                <div className="text-[11px] text-slate-600 mt-1">{c.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Strategies */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Argumentation Strategies</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.map(s => (
              <div key={s.node_id} className={`p-4 rounded-xl border-2 shadow-sm ${getNodeColor(s.node_type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getNodeBadge(s.node_type)}`}>
                    {s.node_id}: {s.node_type}
                  </span>
                </div>
                <div className="text-sm font-bold">{s.title}</div>
                <div className="text-xs text-slate-600 mt-1">{s.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Sub-Claims */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">3. Defensible Claims</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {claims.map(c => (
              <div key={c.node_id} className={`p-3.5 rounded-xl border-2 shadow-sm ${getNodeColor(c.node_type)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${getNodeBadge(c.node_type)}`}>
                    {c.node_id}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xs font-bold">{c.title}</div>
                <div className="text-[11px] text-slate-600 mt-1">{c.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 4: Solutions & Linked Evidence */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">4. Traceable Solutions & Empirical Evidence</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {evidence.map(e => (
              <div key={e.node_id} className={`p-3.5 rounded-xl border-2 shadow-sm ${getNodeColor(e.node_type)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${getNodeBadge(e.node_type)}`}>
                    {e.node_id}: EVIDENCE
                  </span>
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xs font-bold">{e.title}</div>
                <div className="text-[11px] text-slate-600 mt-1">{e.description}</div>
                {e.evidence_links && e.evidence_links.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/50 flex flex-wrap gap-1">
                    {e.evidence_links.map((link, i) => (
                      <span key={i} className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                        {link}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
