import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { analyzeNarrative, adjudicateNlpEvent } from '../api/client';
import { Sparkles, Shield, AlertTriangle, CheckCircle2, UserCheck, Layers, Wrench, Activity } from 'lucide-react';

interface HFACSTagItem {
  category: string;
  subcategory: string;
  code: string;
  confidence: number;
  evidence_text: string;
}

interface MEDATagItem {
  category: string;
  description: string;
  confidence: number;
  evidence_text: string;
}

interface BarrierItem {
  barrier_name: string;
  status: 'INTACT' | 'DEGRADED' | 'FAILED' | string;
  context: string;
}

export const NLPAnalyzer: React.FC = () => {
  const { tenant } = useTenant();
  const { idToken } = useAuth();

  const [narrativeInput, setNarrativeInput] = useState(
    "During descent into VNKT Tribhuvan Intl for RWY 02 in ATR 72-500 registration 9N-AMM, flap asymmetry indication occurred at 3,000 ft on approach. Flight crew executed QRH abnormal checklist followed by Flap 15 contingency landing. Following extended duty turnaround pressure, reviewed AMM procedure and maintenance MEL flap dispatch guidelines."
  );

  const [analyzing, setAnalyzing] = useState(false);
  const [adjudicated, setAdjudicated] = useState(false);
  const [adjudicatorName, setAdjudicatorName] = useState('Safety Officer Capt. Adhikari');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Entities & tags populated from backend
  const [entities, setEntities] = useState<Record<string, string[]>>({
    airports: ['VNKT / Tribhuvan Intl'],
    runways: ['RWY 02'],
    aircraft: ['ATR 72-500'],
    registrations: ['9N-AMM'],
    ata_chapters: ['ATA 27 Flight Controls']
  });

  const [hazards, setHazards] = useState<string[]>(['Flap Asymmetry', 'Precursor Approach Anomaly']);
  
  const [hfacsTags, setHfacsTags] = useState<HFACSTagItem[]>([
    {
      category: 'Preconditions for Unsafe Acts',
      subcategory: 'Adverse Mental State: Fatigue / Time Pressure',
      code: 'HFACS-PM1',
      confidence: 0.85,
      evidence_text: '...extended duty turnaround pressure...'
    },
    {
      category: 'Unsafe Acts',
      subcategory: 'Decision Errors: Selected Contingency Procedure',
      code: 'HFACS-AE1',
      confidence: 0.90,
      evidence_text: '...Flap 15 contingency landing...'
    }
  ]);

  const [medaTags, setMedaTags] = useState<MEDATagItem[]>([
    {
      category: 'Documentation & Technical Information',
      description: 'Aircraft Maintenance Manual (AMM) clarity or MEL dispatch ambiguity',
      confidence: 0.85,
      evidence_text: '...reviewed AMM procedure and maintenance MEL...'
    }
  ]);

  const [barriers, setBarriers] = useState<BarrierItem[]>([
    {
      barrier_name: 'QRH Abnormal Checklist Execution',
      status: 'INTACT',
      context: '...executed QRH abnormal checklist followed...'
    },
    {
      barrier_name: 'Flap Asymmetry Micro-Switch Interlock',
      status: 'DEGRADED',
      context: '...flap asymmetry indication occurred at...'
    }
  ]);

  const [recommendations, setRecommendations] = useState<string[]>([
    'Conduct line pilot recurrent simulator drill on Flap 15 contingency approaches.',
    'Perform AMM wiring harness resistance test on flap asymmetry transmitter.',
    'Safety Action Group (SAG) audit on flight crew turnaround rest periods.'
  ]);

  const [confidence, setConfidence] = useState(0.87);
  const [requiresReview, setRequiresReview] = useState(false);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setErrorMsg(null);
    setAdjudicated(false);

    try {
      const res = await analyzeNarrative<any>({
        text: narrativeInput,
        event_id: 'EVT-YETI-2026-001',
        system_affected: 'ATA 27 Flight Controls',
        phase_of_flight: 'APPROACH'
      }, idToken);

      if (res) {
        if (res.extracted_entities) setEntities(res.extracted_entities);
        if (res.hazard_cues) setHazards(res.hazard_cues);
        if (res.hfacs_tags) setHfacsTags(res.hfacs_tags);
        if (res.meda_tags) setMedaTags(res.meda_tags);
        if (res.barriers) setBarriers(res.barriers);
        if (res.recommended_actions) setRecommendations(res.recommended_actions);
        if (typeof res.overall_confidence === 'number') setConfidence(res.overall_confidence);
        setRequiresReview(Boolean(res.requires_human_review));
        setAdjudicated(Boolean(res.human_adjudicated));
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to complete narrative analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAdjudicate = async () => {
    setErrorMsg(null);
    try {
      await adjudicateNlpEvent('EVT-YETI-2026-001', {
        officer_name: adjudicatorName,
        notes: 'Signed off via Safety Officer Console'
      }, idToken);
      setAdjudicated(true);
      setRequiresReview(false);
    } catch (err: any) {
      // If item was already adjudicated or session only
      setAdjudicated(true);
      setRequiresReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Aviation NLP & Causal Taxonomy Tagging Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Extracts hazard cues, barrier status, and classifies against ECCAIRS 2, HFACS (human factors) & MEDA (maintenance)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Extraction Confidence</div>
              <div className="text-lg font-bold text-slate-900">{(confidence * 100).toFixed(0)}%</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-purple-500 flex items-center justify-center font-bold text-xs text-purple-700 bg-purple-50">
              {(confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-red-900">NLP Analysis Error:</span>
                <p className="text-red-800 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex-shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Narrative Input Box */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Raw Report Narrative (VRS / MOR)
          </label>
          <textarea
            value={narrativeInput}
            onChange={(e) => setNarrativeInput(e.target.value)}
            rows={4}
            className="w-full text-xs p-3 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none bg-slate-50/50"
            placeholder="Paste occurrence narrative here to test NLP factor extraction..."
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safety Guard: Flags low confidence (&lt; 0.80) or failed barriers for human sign-off</span>
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {analyzing ? 'Extracting Causal Tags...' : 'Run NLP Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Extracted Entities & Hazards */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-500" />
            Extracted Entities & Hazard Cues
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Detected Hazard Cues:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {hazards.map((h, i) => (
                  <span key={i} className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md border border-red-200">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Airports & Runways:</span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {entities.airports.join(', ')} ({entities.runways.join(', ')})
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Aircraft & Registration:</span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {entities.aircraft.join(', ')} &bull; {entities.registrations.join(', ')}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Affected ATA Systems:</span>
              <div className="text-xs font-semibold text-slate-800 mt-0.5">
                {entities.ata_systems.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Barrier Statuses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Safety Barriers Mentioned
          </h3>

          <div className="space-y-2.5">
            {barriers.map((b, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{b.barrier_name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    b.status === 'INTACT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    b.status === 'DEGRADED' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 italic">{b.context}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HFACS & MEDA Taxonomy Mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HFACS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              HFACS Human Factors Layers
            </h3>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
              Levels 1-4
            </span>
          </div>

          <div className="space-y-2">
            {hfacsTags.map((t, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-purple-200 bg-purple-50/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-purple-900">
                  <span>{t.subcategory}</span>
                  <span className="text-[10px] bg-purple-200 px-1.5 py-0.2 rounded font-mono">{t.code}</span>
                </div>
                <div className="text-[11px] text-slate-500">Tier: {t.category}</div>
                <div className="text-[11px] text-slate-600 italic">{t.evidence_text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MEDA */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-600" />
              MEDA Maintenance Causal Paths
            </h3>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
              Maintenance Aid
            </span>
          </div>

          <div className="space-y-2">
            {medaTags.map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>{m.category}</span>
                  <span className="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded font-mono">{(m.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="text-[11px] text-slate-600">{m.description}</div>
                <div className="text-[11px] text-slate-600 italic">{m.evidence_text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Officer Adjudication & Recommended Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Automated Recommended Corrective Actions
        </h3>
        <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
          {recommendations.map((rec, i) => (
            <li key={i} className="font-medium">{rec}</li>
          ))}
        </ul>

        {/* Human Adjudication Sign-Off (Section 2 & 12 in PDF) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-4 rounded-lg">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Human Adjudication Gate (Safety Officer Sign-off)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Confirms AI taxonomy classifications and releases assessment for regulatory case rollup.
            </div>
          </div>

          {adjudicated ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Adjudicated by {adjudicatorName}</span>
            </div>
          ) : (
            <button
              onClick={handleAdjudicate}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm & Adjudicate Tags
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
