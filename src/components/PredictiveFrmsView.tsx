import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import {
  fetchPredictiveForecast,
  ingestFdmTelemetry,
  fetchFatigueFleetOverview,
  assessCrewFatigue,
  syncToStateRegulator,
  fetchRegulatorSyncHistory
} from '../api/client';
import {
  TrendingUp,
  Brain,
  Share2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Sliders,
  Send
} from 'lucide-react';

export const PredictiveFrmsView: React.FC = () => {
  const { idToken } = useAuth();
  const { tenant } = useTenant();

  // 1. Predictive State
  const [predictiveReport, setPredictiveReport] = useState<any>(null);
  const [loadingPredictive, setLoadingPredictive] = useState<boolean>(true);
  const [ingestingFdm, setIngestingFdm] = useState<boolean>(false);

  // 2. Fatigue State
  const [fatigueOverview, setFatigueOverview] = useState<any>(null);
  const [loadingFatigue, setLoadingFatigue] = useState<boolean>(true);
  const [assessingSingle, setAssessingSingle] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Fatigue Simulator Form
  const [simCrewId, setSimCrewId] = useState<string>('SIM-CREW-909');
  const [simRole, setSimRole] = useState<string>('CAPTAIN');
  const [simReportHour, setSimReportHour] = useState<number>(4.0);
  const [simSleep24, setSimSleep24] = useState<number>(5.0);
  const [simSleep48, setSimSleep48] = useState<number>(11.5);
  const [simConsecutiveDays, setSimConsecutiveDays] = useState<number>(5);
  const [simPriorRest, setSimPriorRest] = useState<number>(9.5);
  const [simStolSectors, setSimStolSectors] = useState<number>(3);

  // 3. Regulator ADREP Sync State
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [loadingSync, setLoadingSync] = useState<boolean>(true);
  const [transmittingSync, setTransmittingSync] = useState<boolean>(false);
  const [latestReceipt, setLatestReceipt] = useState<any>(null);

  // Error Banner
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAll = async () => {
    setErrorMsg(null);

    // Load Predictive
    setLoadingPredictive(true);
    fetchPredictiveForecast(idToken)
      .then((data: any) => setPredictiveReport(data))
      .catch((err: any) => {
        console.warn('Predictive forecast error:', err);
        setErrorMsg(prev => prev || err?.message || 'Failed to load predictive forecast.');
      })
      .finally(() => setLoadingPredictive(false));

    // Load Fatigue
    setLoadingFatigue(true);
    fetchFatigueFleetOverview(idToken)
      .then((data: any) => setFatigueOverview(data))
      .catch((err: any) => {
        console.warn('Fatigue overview error:', err);
        setErrorMsg(prev => prev || err?.message || 'Failed to load fatigue overview.');
      })
      .finally(() => setLoadingFatigue(false));

    // Load Sync History
    setLoadingSync(true);
    fetchRegulatorSyncHistory(idToken)
      .then((data: any) => setSyncHistory(Array.isArray(data) ? data : []))
      .catch((err: any) => {
        console.warn('Sync history error:', err);
      })
      .finally(() => setLoadingSync(false));
  };

  useEffect(() => {
    loadAll();
  }, [idToken, tenant.tenant_id]);

  // Handler: Ingest FDM Exceedances
  const handleIngestFdm = async () => {
    setIngestingFdm(true);
    setErrorMsg(null);
    try {
      const sampleExceedances = [
        {
          parameter_code: 'UNSTABILIZED_APPROACH_GLIDEPATH',
          aircraft_type: tenant.fleets[0]?.aircraft_type || 'ATR 72-500',
          phase_of_flight: 'APPROACH',
          exceedance_severity: 4,
          peak_value: 1.85,
          threshold_limit: 1.0,
          sectors_flown_window: 650
        },
        {
          parameter_code: 'HIGH_DESCENT_RATE_TERRAIN_WARNING',
          aircraft_type: tenant.fleets[0]?.aircraft_type || 'ATR 72-500',
          phase_of_flight: 'APPROACH',
          exceedance_severity: 5,
          peak_value: 2150.0,
          threshold_limit: 1200.0,
          sectors_flown_window: 650
        }
      ];
      const updated = await ingestFdmTelemetry(sampleExceedances, idToken);
      if (updated) {
        setPredictiveReport(updated);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to ingest FDM exceedance telemetry.');
    } finally {
      setIngestingFdm(false);
    }
  };

  // Handler: Run Simulator
  const handleRunSimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssessingSingle(true);
    setErrorMsg(null);
    try {
      const sectors = [];
      const totalSectors = Math.max(1, simStolSectors);
      for (let i = 0; i < totalSectors; i++) {
        sectors.push({
          flight_number: `SIM-${100 + i}`,
          departure_icao: 'VNKT',
          arrival_icao: i % 2 === 0 ? 'VNLK' : 'VNKT',
          duration_hours: 0.7,
          is_high_altitude_stol: true
        });
      }

      const payload = {
        crew_id: simCrewId,
        role: simRole,
        report_time_local_hour: Number(simReportHour),
        prior_sleep_hours_24h: Number(simSleep24),
        prior_sleep_hours_48h: Number(simSleep48),
        consecutive_duty_days: Number(simConsecutiveDays),
        rest_period_before_duty_hours: Number(simPriorRest),
        sectors: sectors
      };

      const res = await assessCrewFatigue(payload, idToken);
      setSimResult(res);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to run fatigue assessment simulation.');
    } finally {
      setAssessingSingle(false);
    }
  };

  // Handler: Transmit ADREP
  const handleTransmitAdrep = async () => {
    setTransmittingSync(true);
    setErrorMsg(null);
    try {
      const receipt: any = await syncToStateRegulator(idToken);
      if (receipt) {
        setLatestReceipt(receipt);
        setSyncHistory(prev => [receipt, ...prev]);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to transmit ADREP bundle to State Regulator.');
    } finally {
      setTransmittingSync(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Phase 4: Predictive Analytics, FRMS & Regulator ADREP
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  ICAO ANNEX 6 & 19
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bio-Mathematical Crew Alertness (SAFTE), Holt-Poisson Telemetry Forecasting & State Aviation Regulator Gateway
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadAll}
          className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh All Telemetry</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong>Phase 4 Telemetry Notice:</strong> {errorMsg}
          </div>
        </div>
      )}

      {/* SECTION 1: PREDICTIVE FORECASTING */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Predictive Analytics & FDM Telemetry Forecasting
              </h2>
              <p className="text-xs text-slate-500">
                Holt Double Exponential Smoothing ($\alpha=0.45, \beta=0.30$) & Poisson Exceedance Rates
              </p>
            </div>
          </div>

          <button
            onClick={handleIngestFdm}
            disabled={ingestingFdm}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{ingestingFdm ? 'Processing Telemetry...' : 'Ingest FDM Exceedance Telemetry'}</span>
          </button>
        </div>

        {loadingPredictive ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
            Computing double exponential smoothing forecast curves...
          </div>
        ) : predictiveReport ? (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall 30d Escalation Probability</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {(predictiveReport.overall_30d_escalation_probability * 100).toFixed(1)}%
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Poisson probability of threshold breach in 30 days</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Model Methodology</span>
                <div className="text-xs font-bold text-slate-800 mt-1 font-mono leading-relaxed truncate" title={predictiveReport.model_methodology}>
                  {predictiveReport.model_methodology}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Dynamic trend projection & Poisson intervals</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">FDM Ingest Status</span>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs">
                    {predictiveReport.fdm_exceedance_summary?.samples_processed || 0} samples
                  </span>
                  <span className="text-xs text-slate-600">
                    High Exceedances: {predictiveReport.fdm_exceedance_summary?.high_severity_exceedances || 0}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Primary: {predictiveReport.fdm_exceedance_summary?.primary_parameter || 'Normal'}</p>
              </div>
            </div>

            {/* System Forecast Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictiveReport.system_forecasts?.map((sys: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sys.system_or_hazard}</div>
                      <div className="text-[11px] text-slate-500">Current: {sys.current_rate_per_10k_sectors} / 10k sectors</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      sys.trend_direction === 'INCREASING'
                        ? 'bg-rose-100 text-rose-800'
                        : sys.trend_direction === 'DECREASING'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {sys.trend_direction} (slope: {sys.trend_slope})
                    </span>
                  </div>

                  {/* Horizons Table */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {sys.forecasts?.map((fc: any, fidx: number) => (
                      <div key={fidx} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{fc.horizon_days} Days</div>
                        <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                          {fc.predicted_rate_per_10k_sectors}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          [{fc.lower_95_ci} – {fc.upper_95_ci}]
                        </div>
                        <div className="text-[10px] text-rose-600 font-semibold mt-1">
                          P: {(fc.poisson_exceedance_prob * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
                    <strong className="text-amber-900">Recommended Action:</strong> {sys.recommended_preventive_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* SECTION 2: BIO-MATHEMATICAL CREW FRMS */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
            <Brain className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Bio-Mathematical Crew FRMS (SAFTE / Three-Process & ICAO FDP)
            </h2>
            <p className="text-xs text-slate-500">
              Circadian WOCL (02:00–06:00), Cumulative Sleep Debt & Mountain STOL Duty Analysis
            </p>
          </div>
        </div>

        {loadingFatigue ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
            Evaluating representative fleet duty rosters...
          </div>
        ) : fatigueOverview ? (
          <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Crew Evaluated</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{fatigueOverview.total_crew_evaluated}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Active duty roster cohort</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Elevated / Critical Risk</span>
                <div className="text-2xl font-black text-rose-600 mt-1">{fatigueOverview.critical_or_high_count}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Requires immediate operational mitigation</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mean Fleet Alertness</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{fatigueOverview.mean_effectiveness}%</div>
                <p className="text-[11px] text-slate-500 mt-0.5">SAFTE Cognitive Effectiveness baseline</p>
              </div>
            </div>

            {/* Roster Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fatigueOverview.assessments?.map((crew: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{crew.crew_id}</div>
                      <div className="text-[11px] text-slate-500">
                        FDP: {crew.total_fdp_hours}h / Max: {crew.max_allowable_fdp_hours}h &bull; STOL Sectors: {crew.stol_sector_count}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                      crew.fatigue_risk_level === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : crew.fatigue_risk_level === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : crew.fatigue_risk_level === 'MODERATE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {crew.fatigue_risk_level} (KSS: {crew.karolinska_sleepiness_scale})
                    </span>
                  </div>

                  {/* Effectiveness Gauge */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>SAFTE Effectiveness: {crew.effectiveness_score}%</span>
                      <span>WOCL Encroachment: {crew.wocl_encroachment_hours}h</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          crew.effectiveness_score >= 85
                            ? 'bg-emerald-500'
                            : crew.effectiveness_score >= 77
                            ? 'bg-blue-500'
                            : crew.effectiveness_score >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-600'
                        }`}
                        style={{ width: `${Math.min(100, crew.effectiveness_score)}%` }}
                      />
                    </div>
                  </div>

                  {/* Regulatory Flags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {crew.regulatory_flags?.map((flag: string, fidx: number) => (
                      <span key={fidx} className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {flag}
                      </span>
                    ))}
                  </div>

                  {/* Mitigations */}
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-800">Action:</strong> {crew.recommended_mitigations?.[0] || 'Standard operations.'}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Crew Duty & Sleep Simulator */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Interactive Crew Duty & Sleep Simulator
                </h3>
              </div>

              <form onSubmit={handleRunSimulator} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Report Time (Local Hr)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="23.5"
                      value={simReportHour}
                      onChange={(e) => setSimReportHour(parseFloat(e.target.value))}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prior 24h Sleep (Hrs)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="14"
                      value={simSleep24}
                      onChange={(e) => setSimSleep24(parseFloat(e.target.value))}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prior 48h Sleep (Hrs)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={simSleep48}
                      onChange={(e) => setSimSleep48(parseFloat(e.target.value))}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">STOL Sectors</label>
                    <input
                      type="number"
                      min="0"
                      max="8"
                      value={simStolSectors}
                      onChange={(e) => setSimStolSectors(parseInt(e.target.value))}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500">
                    Calculates WOCL encroachment, FDP ceiling, homeostatic sleep debt, and KSS score.
                  </div>
                  <button
                    type="submit"
                    disabled={assessingSingle}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{assessingSingle ? 'Evaluating...' : 'Simulate Bio-Mathematical Alertness'}</span>
                  </button>
                </div>
              </form>

              {simResult && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Simulation Outcome: {simResult.crew_id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                      simResult.fatigue_risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      simResult.fatigue_risk_level === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      simResult.fatigue_risk_level === 'MODERATE' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {simResult.fatigue_risk_level} (KSS: {simResult.karolinska_sleepiness_scale})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                    <div>SAFTE Score: <strong>{simResult.effectiveness_score}%</strong></div>
                    <div>WOCL Encroachment: <strong>{simResult.wocl_encroachment_hours}h</strong></div>
                    <div>FDP: <strong>{simResult.total_fdp_hours}h</strong> (Max: {simResult.max_allowable_fdp_hours}h)</div>
                    <div>Exceedance: <strong>{simResult.fdp_exceedance_hours}h</strong></div>
                  </div>
                  <div className="text-[11px] text-slate-600 pt-1">
                    <strong>Mitigation:</strong> {simResult.recommended_mitigations?.[0] || 'Alertness acceptable.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* SECTION 3: STATE REGULATOR ADREP SYNC */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
              <Share2 className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. State Regulator ADREP / ECCAIRS Gateway Sync
              </h2>
              <p className="text-xs text-slate-500">
                Canonical ICAO ADREP taxonomy formatting with tamper-evident SHA-256 transmission signatures
              </p>
            </div>
          </div>

          <button
            onClick={handleTransmitAdrep}
            disabled={transmittingSync}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{transmittingSync ? 'Transmitting Bundle...' : 'Transmit ADREP Bundle to State Regulator'}</span>
          </button>
        </div>

        {latestReceipt && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>State Regulator Gateway: {latestReceipt.status}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
              <div>Sync ID: <strong className="font-mono">{latestReceipt.sync_id}</strong></div>
              <div>Events Synced: <strong>{latestReceipt.events_synced_count}</strong> (High Risk: {latestReceipt.high_risk_events_count})</div>
              <div>Protocol: <strong>{latestReceipt.protocol_version}</strong></div>
            </div>
            <div className="text-[11px] text-slate-600 font-mono break-all pt-1">
              SHA-256 Receipt: <strong>{latestReceipt.payload_sha256}</strong>
            </div>
          </div>
        )}

        {/* Sync History Ledger */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-slate-500" />
            <span>Regulator Transmission Ledger</span>
          </h3>

          {loadingSync ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading sync history...</div>
          ) : syncHistory.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2 font-bold text-slate-600 border-b border-slate-200 grid grid-cols-4">
                <span>Sync Reference</span>
                <span>Events</span>
                <span>Transmitted</span>
                <span>Receipt Hash</span>
              </div>
              <div className="divide-y divide-slate-100">
                {syncHistory.map((s, idx) => (
                  <div key={idx} className="px-4 py-2.5 grid grid-cols-4 items-center">
                    <span className="font-mono font-semibold text-slate-800">{s.sync_id}</span>
                    <span className="text-slate-600">{s.events_synced_count} reports</span>
                    <span className="text-slate-500">{new Date(s.transmitted_at).toLocaleTimeString()}</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate" title={s.payload_sha256}>
                      {s.payload_sha256}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No previous transmissions recorded for {tenant.display_name}. Click above to transmit canonical ADREP reports.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
