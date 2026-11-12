import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { fetchPatternAnalysis } from '../api/client';
import { TrendingUp, MapPin, Link2, AlertCircle, BarChart3, Clock, RefreshCw } from 'lucide-react';

interface Cluster {
  cluster_id: string;
  location: string;
  runway?: string;
  time_window: string;
  event_count: number;
  primary_hazard: string;
  recommended_mitigation: string;
}

interface Chain {
  chain_id: string;
  precursor_hazard: string;
  escalation_hazard: string;
  lead_time_days: number;
  occurrence_frequency: number;
  common_systems: string[];
}

interface ControlPoint {
  period: string;
  rate_per_1000_cycles: number;
  mean_rate: number;
  upper_control_limit: number;
  lower_control_limit: number;
  out_of_control: boolean;
}

export const PatternDetectorView: React.FC = () => {
  const { tenant } = useTenant();
  const { idToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([
    {
      cluster_id: 'CLUST-VNKT-01',
      location: 'VNKT / Tribhuvan International',
      runway: 'RWY 02',
      time_window: '10:00 - 13:00 UTC (Thermal Inversion)',
      event_count: 3,
      primary_hazard: 'Flap Asymmetry & Glideslope Micro-Fluctuations',
      recommended_mitigation: 'Enforce mandatory radar-monitored visual approach protocol when thermal updrafts exceed 15 kts.'
    },
    {
      cluster_id: 'CLUST-VNLK-01',
      location: 'VNLK / Tenzing-Hillary Lukla',
      runway: 'RWY 06 STOL',
      time_window: '06:30 - 09:30 UTC (Morning Turnaround)',
      event_count: 2,
      primary_hazard: 'Wheel Brake Thermal Saturation on Short Upslope Landing',
      recommended_mitigation: 'Mandate portable cooling fan deployment during rapid 15-minute STOL turnaround windows.'
    }
  ]);

  const [chains, setChains] = useState<Chain[]>([
    {
      chain_id: 'CHN-01',
      precursor_hazard: 'Minor Pressure Drop (ATA 29)',
      escalation_hazard: 'Flap Asymmetry Advisory (ATA 27)',
      lead_time_days: 4.5,
      occurrence_frequency: 3,
      common_systems: ['ATA 27', 'ATA 29']
    },
    {
      chain_id: 'CHN-02',
      precursor_hazard: 'Wet Runway Medium Friction',
      escalation_hazard: 'Anti-Skid Release Pulse',
      lead_time_days: 2.1,
      occurrence_frequency: 2,
      common_systems: ['ATA 32']
    }
  ]);

  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([
    { period: '2026-W41', rate_per_1000_cycles: 3.2, mean_rate: 4.8, upper_control_limit: 8.5, lower_control_limit: 1.1, out_of_control: false },
    { period: '2026-W42', rate_per_1000_cycles: 4.5, mean_rate: 4.8, upper_control_limit: 8.5, lower_control_limit: 1.1, out_of_control: false },
    { period: '2026-W43', rate_per_1000_cycles: 3.8, mean_rate: 4.8, upper_control_limit: 8.5, lower_control_limit: 1.1, out_of_control: false },
    { period: '2026-W44', rate_per_1000_cycles: 7.7, mean_rate: 4.8, upper_control_limit: 8.5, lower_control_limit: 1.1, out_of_control: false }
  ]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await fetchPatternAnalysis<any>(idToken);
      if (report) {
        if (Array.isArray(report.spatio_temporal_clusters) && report.spatio_temporal_clusters.length > 0) {
          setClusters(report.spatio_temporal_clusters);
        }
        if (Array.isArray(report.precursor_chains) && report.precursor_chains.length > 0) {
          setChains(report.precursor_chains);
        }
        if (Array.isArray(report.control_chart) && report.control_chart.length > 0) {
          setControlPoints(report.control_chart);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Could not fetch live pattern surveillance report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [idToken, tenant.tenant_id]);

  const latestUcl = controlPoints[0]?.upper_control_limit ?? 8.5;
  const latestMean = controlPoints[0]?.mean_rate ?? 4.8;
  const latestLcl = controlPoints[0]?.lower_control_limit ?? 1.1;

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Aviation Pattern Detection & Statistical Surveillance
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated cluster mining, precursor chain sequences, and Statistical Process Control (SPC) per 1,000 flight cycles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Refresh Surveillance Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>28-Day Rolling Surveillance Window</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Spatio-Temporal Clusters */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            Active Spatio-Temporal Airfield Clusters ({clusters.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((c) => (
              <div key={c.cluster_id} className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm">{c.location}</span>
                  <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                    {c.runway ? `${c.runway} • ` : ''}{c.event_count} Events
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Time Window:</strong> {c.time_window}
                </div>
                <div className="text-slate-800 font-semibold">
                  Primary Anomaly: {c.primary_hazard}
                </div>
                <div className="p-2 rounded bg-white border border-blue-200 text-[11px] text-blue-800">
                  <strong>Mandated Mitigation:</strong> {c.recommended_mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sequence Mining: Precursor Chains */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-purple-600" />
          Precursor Sequence Chains ({chains.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chains.map((ch) => (
            <div key={ch.chain_id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span>{ch.precursor_hazard} &rarr; {ch.escalation_hazard}</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
                  Avg Lead: {ch.lead_time_days} Days
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="p-1.5 rounded bg-white border border-slate-200 font-medium text-slate-800">
                  {ch.precursor_hazard}
                </span>
                <span className="text-purple-600 font-bold">&rarr;</span>
                <span className="p-1.5 rounded bg-red-50 border border-red-200 font-bold text-red-700">
                  {ch.escalation_hazard}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Frequency: {ch.occurrence_frequency} occurrences across {ch.common_systems.join(', ') || 'fleet'}.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistical Process Control (SPC) Control Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Statistical Process Control (SPC) — Incident Rate per 1,000 Flight Cycles
            </h3>
            <p className="text-[11px] text-slate-500">
              Calculates Mean (&mu;) and Upper Control Limit (UCL = &mu; + 3&sigma;) to detect abnormal rate deviations.
            </p>
          </div>
          <div className="text-xs font-mono font-semibold text-slate-600 flex items-center gap-3">
            <span>UCL: <strong className="text-red-600">{latestUcl.toFixed(2)}</strong></span>
            <span>Mean (&mu;): <strong className="text-blue-600">{latestMean.toFixed(2)}</strong></span>
            <span>LCL: <strong className="text-emerald-600">{latestLcl.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Visual Bar Representation of Weekly Rates */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {controlPoints.map((pt) => {
            const rate = pt.rate_per_1000_cycles;
            const heightPercent = Math.min(100, (rate / (latestUcl * 1.2 || 10)) * 100);
            return (
              <div key={pt.period} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="text-xs font-mono font-bold text-slate-700">{pt.period}</div>
                <div className="h-28 flex items-end justify-center bg-white rounded-lg border border-slate-200 p-2">
                  <div
                    style={{ height: `${Math.max(12, heightPercent)}%` }}
                    className={`w-12 rounded-t-lg transition-all flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                      pt.out_of_control || rate > latestUcl * 0.85 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                  >
                    {rate.toFixed(1)}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Rate / 1k cycles
                </div>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  pt.out_of_control
                    ? 'bg-red-100 text-red-800'
                    : rate > latestUcl * 0.85
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {pt.out_of_control ? 'Out of Control' : rate > latestUcl * 0.85 ? 'Trending Up' : 'In Control'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
