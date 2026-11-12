import React from 'react';
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
  Users
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">AviaSafe <span className="text-emerald-400">SIEWS</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-slate-800 text-slate-400 rounded border border-slate-700">ICAO Annex 19</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-400">
              <a href="#architecture" className="hover:text-slate-200 transition">Architecture</a>
              <a href="#alignment" className="hover:text-slate-200 transition">SMS/SSP Matrix</a>
              <a href="#early-warning" className="hover:text-slate-200 transition">Early Warning</a>
              <a href="#governance" className="hover:text-slate-200 transition">Governance</a>
            </nav>
            <button
              onClick={onEnterPortal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition shadow-md shadow-emerald-950/30"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 mb-8 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>ICAO Annex 19 &bull; Doc 9859 (SMM) &bull; Doc 10159 (Safety Intelligence) &bull; Annex 6 (FRMS)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
            Integrated Aviation Safety Intelligence &amp; <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">Early Warning System (SIEWS)</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-200">
            AviaSafe Systems
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Converting operational, maintenance, flight-data, and crew fatigue signals into actionable early warnings—before precursor drift matures into accidents or serious incidents.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterPortal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50"
            >
              <span>Launch SIEWS Operator &amp; Regulator Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#architecture"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl border border-slate-800 transition"
            >
              <span>Explore 4-Phase Architecture</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400">&lt; 0.80</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Human-in-the-Loop</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Automated NLP adjudication queue</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-400">5,000+</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Monte Carlo Cycles</div>
              <div className="text-[11px] text-slate-500 mt-0.5">VaR95 &amp; ES95 dispersion modeling</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-sky-400">3-Process</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">SAFTE FRMS Model</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Circadian WOCL &amp; sleep debt decay</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-teal-400">SHA-256</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Regulator Pack</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Canonical ADREP/ECCAIRS receipts</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Phase Technical Architecture Grid */}
      <section id="architecture" className="py-20 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-2">Core Engineering Foundation</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">The 4-Phase SIEWS Analytical Architecture</p>
            <p className="mt-3 text-slate-400 text-sm">
              Engineered according to ICAO Doc 9859 Safety Management Manual and Doc 10159 Safety Intelligence principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phase 1 Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                  Phase 1
                </span>
                <Database className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Governed SDCPS &amp; Just-Culture Protection</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Multi-tenant occurrence intake with strict cryptographic isolation between air operators and civil aviation regulators.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
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
                  <span><strong>Dynamic 5&times;5 ICAO Risk Engine:</strong> Automated +1 likelihood/consequence escalation for rolling 28-day precursor trend clustering.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24-Hour SLA Escalation:</strong> High-risk scores (&ge; 16) mobilize immediate safety task-force notifications.</span>
                </li>
              </ul>
            </div>

            {/* Phase 2 Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-sky-950/80 text-sky-300 border border-sky-800/40">
                  Phase 2
                </span>
                <Cpu className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Causal NLP &amp; Statistical Surveillance</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Automated causal taxonomy tagging and statistical surveillance identifying precursor drift across fleets and airfields.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Dual Causal Taxonomy:</strong> Real-time extraction against HFACS (Human Factors) and Boeing/FAA MEDA maintenance errors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Safety Officer Review Queue:</strong> Causal inferences with confidence &lt; 0.80 route into a human-in-the-loop review queue for expert adjudication.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Spatio-Temporal Clustering:</strong> Haversine density windowing pinpoints geographic hotspots and runway precursor chains.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>SPC Control Charts (&mu; &plusmn; 3&sigma;):</strong> Automated Nelson rule violation alerts detecting systemic drift before occurrence spikes.</span>
                </li>
              </ul>
            </div>

            {/* Phase 3 Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                  Phase 3
                </span>
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Probabilistic Proofs &amp; GSN Assurance Cases</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Mathematical evidence engines and Goal Structuring Notation (GSN) delivering defensible proof to civil aviation authorities.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Monte Carlo Stochastic Simulation:</strong> 5,000-cycle dispersion calculating 95th-percentile Value-at-Risk (VaR95) and Expected Shortfall (ES95).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Barrier Sensitivity &amp; RBD:</strong> One-At-a-Time (OAT) barrier failure elasticity (&Delta;R) and series/parallel system Reliability Block Diagrams.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>4-State Continuous-Time Markov Chain:</strong> Latent failure exposure modeling measuring steady-state availability (A_ss) and unreliability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Dynamic GSN Assurance Trees:</strong> Goals, Strategies, Claims, and Evidence Solutions with cryptographic SHA-256 audit freeze.</span>
                </li>
              </ul>
            </div>

            {/* Phase 4 Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-teal-950/80 text-teal-300 border border-teal-800/40">
                  Phase 4
                </span>
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bio-Mathematical FRMS &amp; Predictive Forecasting</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Crew alertness modeling under ICAO Annex 6, Holt-Poisson telemetry forecasting, and real-time State Regulator ADREP synchronization.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Bio-Mathematical FRMS (SAFTE):</strong> Three-Process alertness modeling combining homeostatic sleep debt, circadian rhythm, and sleep inertia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>WOCL &amp; STOL Duty Limits:</strong> Encroachment penalties on Window of Circadian Low and Short Take-Off/Landing mountain sector constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Predictive Holt-Poisson Forecasting:</strong> 30/60/90-day double exponential smoothing with Poisson exceedance probability per 10k flight sectors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>State Regulator ADREP Sync:</strong> Canonical ICAO ADREP / ECCAIRS XML/JSON gateway sync with 64-character SHA-256 transmission receipts.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SMS & State Safety Programme Alignment Table */}
      <section id="alignment" className="py-20 border-b border-slate-900 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Regulatory Cross-Reference</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">ICAO SMS &amp; State Safety Programme (SSP) Alignment</p>
            <p className="mt-3 text-slate-400 text-sm">
              Concrete mapping between the 6 foundational SMS/SSP requirements and operational AviaSafe SIEWS capabilities.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6 w-1/4">SMS / SSP Requirement</th>
                  <th className="py-4 px-6 w-1/4">ICAO Guidance Reference</th>
                  <th className="py-4 px-6 w-1/2">Concrete SIEWS Solution Capability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>1. Identify Hazards</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">ICAO Doc 9859 §2.5</td>
                  <td className="py-4 px-6">
                    Aggregate VRS/MOR reports, audit findings, FRMS indicators, and FDM signals into ADREP-standardized hazard records.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>2. Assess &amp; Mitigate Risk</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">ICAO Doc 9859 §2.6</td>
                  <td className="py-4 px-6">
                    Link hazards to 5&times;5 dynamic risk scoring, Monte Carlo barrier sensitivity (&Delta;R), owners, and due dates.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>3. Monitor Performance</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">ICAO Annex 19 §3.3</td>
                  <td className="py-4 px-6">
                    Display SPIs, exposure-adjusted rates per 10,000 sectors, &mu; &plusmn; 3&sigma; SPC limits, and 95% confidence intervals.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>4. Take Timely Action</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">ICAO Doc 10159 §4.2</td>
                  <td className="py-4 px-6">
                    Issue tiered early-warning alerts when 30/60/90-day Holt-Poisson exceedance probabilities rise.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>5. Demonstrate Improvement</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">ICAO Doc 9859 §9.4</td>
                  <td className="py-4 px-6">
                    Enforce mandatory 2-control-period verification before corrective action closure and track residual risk.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>6. Support State Oversight</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">ICAO Annex 19 App. 3</td>
                  <td className="py-4 px-6">
                    Generate live GSN safety assurance cases and transmit SHA-256 signed ICAO ADREP/ECCAIRS bundles to the State Regulator.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Decision-Support & Algorithmic Governance Callout Section */}
      <section id="early-warning" className="py-20 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-teal-400 mb-2">Predictive Decision-Support</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">Structured Early-Warning Alert Architecture</p>
            <p className="mt-3 text-slate-400 text-sm">
              Every automated alert follows a deterministic 5-question investigative framework before escalating to the Safety Action Group.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3 border border-indigo-800/40">1</div>
              <h4 className="text-sm font-bold text-white mb-1">What Changed?</h4>
              <p className="text-xs text-slate-400">Observed parameter drift, FDM exceedances, or spike in voluntary MOR tags.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-sky-950/80 text-sky-400 flex items-center justify-center font-bold text-xs mb-3 border border-sky-800/40">2</div>
              <h4 className="text-sm font-bold text-white mb-1">Where It Changed?</h4>
              <p className="text-xs text-slate-400">Airfield coordinate cluster, fleet airframe tail number, or specific duty pattern.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center font-bold text-xs mb-3 border border-amber-800/40">3</div>
              <h4 className="text-sm font-bold text-white mb-1">Why It Matters?</h4>
              <p className="text-xs text-slate-400">Precursor correlation to accident scenarios, VaR95 shift, or Nelson rule trigger.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 text-rose-400 flex items-center justify-center font-bold text-xs mb-3 border border-rose-800/40">4</div>
              <h4 className="text-sm font-bold text-white mb-1">What To Do?</h4>
              <p className="text-xs text-slate-400">Targeted CAP dispatch: procedure revision, simulator recurrent session, or roster rest.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3 border border-emerald-800/40">5</div>
              <h4 className="text-sm font-bold text-white mb-1">Whether It Worked?</h4>
              <p className="text-xs text-slate-400">2-control-period verification cycle tracking rate stabilization before closure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithmic Governance Section */}
      <section id="governance" className="py-20 border-b border-slate-900 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-8 sm:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/60 mb-4">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Algorithmic Governance &amp; Human-in-the-Loop</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Safety Action Groups Retain Total Decision Authority
              </h3>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                AviaSafe SIEWS is strictly built as an analytical decision-support copilot—not an autonomous decision-maker. All automated causal tags with confidence &lt; 0.80 are queued for manual adjudicative review. Corrective actions and risk acceptance remain exclusively within the purview of certified Safety Officers, Flight Operations Inspectors, and Accountable Managers.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Explainable AI (XAI) Causal Inferences</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Deterministic SHA-256 Audit Trail</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Role-Based Separation of Duties (RBAC)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 mb-4">
            <Plane className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Ready to Deploy Defensible Safety Intelligence?</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Access the multi-tenant operator interface or regulator portal using our pre-seeded demonstration profiles.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={onEnterPortal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-950/40"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} AviaSafe Systems. ICAO Annex 19 / Doc 9859 / Doc 10159 / Annex 6 Compliant.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Protected Under Annex 19 Appendix 3</span>
              </span>
              <span>&bull;</span>
              <span>System v1.4.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
