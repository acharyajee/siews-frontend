import React, { useState } from 'react';
import { 
  Shield, 
  Plane, 
  Activity, 
  Cpu, 
  FileCheck, 
  ArrowRight, 
  Lock, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Scale, 
  Share2, 
  ChevronRight,
  Database,
  HelpCircle,
  TrendingUp,
  Users,
  Award,
  Hash,
  Sparkles,
  Filter,
  Search,
  Calendar,
  Tag,
  LogOut,
  Plus,
  X,
  Binary,
  Play,
  ShieldAlert,
  Sliders,
  Send,
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: () => void;
}

const COLOR_PRIMARY = '#1b4332';
const COLOR_SAGE_LIGHT = '#f8faf8';
const COLOR_EMERALD_900 = '#1b4332';
const COLOR_SLATE_50 = '#f8fafc';
const COLOR_SLATE_900 = '#0f172a';

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal }) => {
  const [activeTab, setActiveTab] = useState<'phase1' | 'phase2' | 'phase3' | 'phase4'>('phase1');

  const tabContent = {
    phase1: {
      title: '01 Governed SDCPS',
      subtitle: 'Annex 19 Appendix 3 Tokenization & Quality Gates',
      icon: Database,
      items: [
        { label: 'Multi-tenant occurrence intake with strict cryptographic isolation', detail: 'TOK-... pseudonymization protects reporter identity from safety events' },
        { label: 'Automated Quality Gate: field integrity, chronological sequence validation, SHA-256 deduplication', detail: 'Ensures data reliability before analytical processing' },
        { label: 'Dynamic 5×5 ICAO Risk Engine: automated likelihood/consequence escalation for rolling 28-day precursor trend clustering', detail: 'Rolling trend detection with +1 escalation per precursor cluster' },
        { label: '24-Hour SLA Escalation: high-risk scores (≥16) mobilize immediate safety task-force notifications', detail: 'Rapid response to critical safety events' },
      ],
    },
    phase2: {
      title: '02 Causal NLP & SPC',
      subtitle: 'HFACS/MEDA Tagging & Control Charts',
      icon: Sparkles,
      items: [
        { label: 'Dual Causal Taxonomy: real-time extraction against HFACS (human factors) and Boeing/FAA MEDA maintenance errors', detail: 'Automated taxonomy tagging for causal inference' },
        { label: 'Safety Officer Review Queue: causal inferences with confidence under 0.80 route into human-in-the-loop review', detail: 'Human adjudication gate for AI-assisted tags' },
        { label: 'Spatio-Temporal Clustering: Haversine density windowing pinpoints geographic hotspots and runway precursor chains', detail: 'Geographic and temporal pattern detection' },
        { label: 'SPC Control Charts (μ ± 3σ): automated Nelson rule violation alerts detecting systemic drift before occurrence spikes', detail: 'Statistical process control for fleet-wide monitoring' },
      ],
    },
    phase3: {
      title: '03 Probabilistic Proofs',
      subtitle: 'Monte Carlo Risk Dispersion & GSN Assurance',
      icon: Award,
      items: [
        { label: 'Monte Carlo Stochastic Simulation: 5,000-cycle dispersion calculating 95th-percentile VaR95 and ES95', detail: 'Probabilistic risk dispersion modeling' },
        { label: 'Barrier Sensitivity & RBD: One-At-a-Time (OAT) barrier failure elasticity (ΔR) and series/parallel Reliability Block Diagrams', detail: 'Marginal risk reduction analysis per barrier' },
        { label: '4-State Continuous-Time Markov Chain: latent failure exposure modeling measuring steady-state availability (A_ss) and unreliability', detail: 'Latent failure exposure over time' },
        { label: 'Dynamic GSN Assurance Trees: Goals, Strategies, Claims, and Evidence Solutions with cryptographic SHA-256 audit freeze', detail: 'Defensible proof structures for regulatory submission' },
      ],
    },
    phase4: {
      title: '04 Predictive FRMS',
      subtitle: 'SAFTE Alertness Modeling & Holt-Poisson Forecasting',
      icon: TrendingUp,
      items: [
        { label: 'Bio-Mathematical FRMS (SAFTE): three-process alertness modeling combining homeostatic sleep debt, circadian rhythm, and sleep inertia', detail: 'Crew alertness prediction across duty periods' },
        { label: 'WOCL & STOL Duty Limits: encroachment penalties on Window of Circadian Low and Short Take-Off/Landing mountain sector constraints', detail: 'Operational duty limit enforcement' },
        { label: 'Predictive Holt-Poisson Forecasting: 30/60/90-day double exponential smoothing with Poisson exceedance probability per 10k flight sectors', detail: 'Forward-looking risk forecasting' },
        { label: 'State Regulator ADREP Sync: canonical ICAO ADREP/ECCAIRS XML/JSON gateway sync with 64-character SHA-256 transmission receipts', detail: 'Regulatory data synchronization' },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ============================= */}
      {/* Tier A: Header Navigation */}
      {/* ============================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-50 border-b border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-900 flex items-center justify-center text-white shadow-md shadow-emerald-950">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">AviaSafe <span className="text-emerald-600">SIEWS</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-emerald-800/10 text-emerald-400 rounded border border-emerald-600/20">ICAO Annex 19</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-500">
              <a href="#phase1" className="hover:text-emerald-600 transition">Phase 1</a>
              <a href="#phase2" className="hover:text-emerald-600 transition">Phase 2</a>
              <a href="#phase3" className="hover:text-emerald-600 transition">Phase 3</a>
              <a href="#phase4" className="hover:text-emerald-600 transition">Phase 4</a>
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={onEnterPortal}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-slate-50 font-semibold text-xs rounded-lg transition shadow-md shadow-emerald-950/30"
              >
                <span>Sign In to Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-900 rounded-full text-xs text-slate-50 font-bold">NEW</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================= */}
      {/* Tier B: Hero Section (Split Layout) */}
      {/* ============================= */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(27,67,50,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
                A cleaner start for your aviation safety intelligence
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
                Converting operational occurrence logs, SMS reports, and crew fatigue signals into proactive early warnings—before precursor drift matures into accidents or serious incidents.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onEnterPortal}
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-slate-50 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50"
                >
                  <span>Launch SIEWS Operator & Regulator Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#phase1"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900/50 hover:bg-slate-800 text-slate-400 font-semibold text-sm rounded-xl border border-slate-700 transition"
                >
                  <span>Explore 4-Phase Architecture</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
              </div>
            </div>
            <div className="relative order-2 order-sm-1 flex flex-col sm:flex-row items-start gap-4">
              {/* Interactive Feature Showcase Card */}
              <div className="order-1 w-full sm:w-auto bg-white rounded-2xl border border-emerald-900/10 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-slate-600">Live ECCAIRS/ADREP Records</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                    <Play className="w-3 h-3" />
                    <span>Live</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-200 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Voluntary reports ingested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-200 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
                    <span>HFACS/MEDA tags applied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-200 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Risk scores computed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-200 text-emerald-400 flex items-center justify-center text-xs font-bold">4</span>
                    <span>Advisory generated</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300/20 transition">
                    <Sparkles className="w-3 h-3 align-middle" /> Live
                  </button>
                  <button className="bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300/20 transition">
                    <span>Pause</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* Tier C: Interactive Workflow Tabs (The 4-Phase Architecture) */}
      {/* ============================= */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 mb-2">Core Engineering Foundation</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">The 4-Phase SIEWS Analytical Architecture</p>
            <p className="mt-3 text-slate-400 text-sm">
              Engineered according to ICAO Doc 9859 Safety Management Manual and Doc 10159 Safety Intelligence principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phase 1 Card */}
            <div 
              key="phase1" 
              onClick={() => setActiveTab('phase1')}
              className={`p-8 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-500/20 transition cursor-pointer ${
                activeTab === 'phase1' ? 'ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-900/5 text-emerald-400 border border-emerald-500/20">
                  Phase 1
                </span>
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Governed SDCPS & Just-Culture Protection</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Multi-tenant occurrence intake with strict cryptographic isolation between air operators and civil aviation regulators.
              </p>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Annex 19 Appendix 3 Tokenization:</strong> Salted cryptographic pseudonymization (<code className="text-emerald-300">TOK-...</code>) isolates reporter identity from safety events.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Automated Quality Gate:</strong> Mandatory field integrity, chronological sequence validation, and SHA-256 deduplication.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dynamic 5×5 ICAO Risk Engine:</strong> Automated +1 likelihood/consequence escalation for rolling 28-day precursor trend clustering.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24-Hour SLA Escalation:</strong> High-risk scores (≥ 16) mobilize immediate safety task-force notifications.</span>
                </li>
              </ul>
            </div>

            {/* Phase 2 Card */}
            <div 
              key="phase2" 
              onClick={() => setActiveTab('phase2')}
              className={`p-8 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-500/20 transition cursor-pointer ${
                activeTab === 'phase2' ? 'ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-900/5 text-emerald-400 border border-emerald-500/20">
                  Phase 2
                </span>
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Causal NLP & Statistical Surveillance</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Automated causal taxonomy tagging and statistical surveillance identifying precursor drift across fleets and airfields.
              </p>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dual Causal Taxonomy:</strong> Real-time extraction against HFACS (Human Factors) and Boeing/FAA MEDA maintenance errors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Safety Officer Review Queue:</strong> Causal inferences with confidence under 0.80 route into a human-in-the-loop review queue for expert adjudication.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Spatio-Temporal Clustering:</strong> Haversine density windowing pinpoints geographic hotspots and runway precursor chains.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>SPC Control Charts (μ &plusmn; 3σ):</strong> Automated Nelson rule violation alerts detecting systemic drift before occurrence spikes.</span>
                </li>
              </ul>
            </div>

            {/* Phase 3 Card */}
            <div 
              key="phase3" 
              onClick={() => setActiveTab('phase3')}
              className={`p-8 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-500/20 transition cursor-pointer ${
                activeTab === 'phase3' ? 'ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-900/5 text-emerald-400 border border-emerald-500/20">
                  Phase 3
                </span>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Probabilistic Proofs & GSN Assurance Cases</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Mathematical evidence engines and Goal Structuring Notation (GSN) delivering defensible proof to civil aviation authorities.
              </p>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Monte Carlo Stochastic Simulation:</strong> 5,000-cycle dispersion calculating 95th-percentile Value-at-Risk (VaR95) and Expected Shortfall (ES95).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Barrier Sensitivity & RBD:</strong> One-At-a-Time (OAT) barrier failure elasticity (&Delta;R) and series/parallel system Reliability Block Diagrams.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>4-State Continuous-Time Markov Chain:</strong> Latent failure exposure modeling measuring steady-state availability (A_ss) and unreliability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dynamic GSN Assurance Trees:</strong> Goals, Strategies, Claims, and Evidence Solutions with cryptographic SHA-256 audit freeze.</span>
                </li>
              </ul>
            </div>

            {/* Phase 4 Card */}
            <div 
              key="phase4" 
              onClick={() => setActiveTab('phase4')}
              className={`p-8 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-500/20 transition cursor-pointer ${
                activeTab === 'phase4' ? 'ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-900/5 text-emerald-400 border border-emerald-500/20">
                  Phase 4
                </span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bio-Mathematical FRMS & Predictive Forecasting</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Crew alertness modeling under ICAO Annex 6, Holt-Poisson telemetry forecasting, and real-time State Regulator ADREP synchronization.
              </p>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Bio-Mathematical FRMS (SAFTE):</strong> Three-Process alertness modeling combining homeostatic sleep debt, circadian rhythm, and sleep inertia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>WOCL & STOL Duty Limits:</strong> Encroachment penalties on Window of Circadian Low and Short Take-Off/Landing mountain sector constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Predictive Holt-Poisson Forecasting:</strong> 30/60/90-day double exponential smoothing with Poisson exceedance probability per 10k flight sectors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>State Regulator ADREP Sync:</strong> Canonical ICAO ADREP / ECCAIRS XML/JSON gateway sync with 64-character SHA-256 transmission receipts.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};