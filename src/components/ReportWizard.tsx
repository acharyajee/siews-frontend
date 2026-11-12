import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { submitEvent } from '../api/client';
import { SafetyEvent, ReportType, FlightPhase } from '../types';
import { Shield, Lock, Send, AlertCircle } from 'lucide-react';

interface ReportWizardProps {
  onEventSubmitted: (newEvent: SafetyEvent) => void;
  onCancel: () => void;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({ onEventSubmitted, onCancel }) => {
  const { tenant } = useTenant();
  const { idToken } = useAuth();

  const [reportType, setReportType] = useState<ReportType>('VRS');
  const [aircraftType, setAircraftType] = useState(
    tenant.fleets[0]?.aircraft_type || 'Commercial Aircraft'
  );
  const [registration, setRegistration] = useState(
    tenant.fleets[0]?.registrations[0] || '9N-AXX'
  );
  const [flightNumber, setFlightNumber] = useState('');
  const [phaseOfFlight, setPhaseOfFlight] = useState<FlightPhase>('APPROACH');
  const [systemAffected, setSystemAffected] = useState('');
  const [location, setLocation] = useState(tenant.operating_bases[0]?.split(' ')[0] || 'VNKT');
  const [reporterRole, setReporterRole] = useState('FIRST_OFFICER');
  const [occurrenceDate, setOccurrenceDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [narrative, setNarrative] = useState('');
  const [confidential, setConfidential] = useState(true);
  const [reporterIdentity, setReporterIdentity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quality gate client-side sanity checks
  const isNarrativeValid = narrative.trim().length >= 20;
  const isSystemValid = systemAffected.trim().length >= 3;
  const isReady = isNarrativeValid && isSystemValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) {
      setErrorMsg('Please satisfy all quality gate fields (narrative length >= 20 chars, system affected).');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      report_type: reportType,
      aircraft_type: aircraftType,
      registration: registration.trim(),
      flight_number: flightNumber.trim() || undefined,
      phase_of_flight: phaseOfFlight,
      system_affected: systemAffected.trim(),
      location: location.trim(),
      occurrence_date: new Date(occurrenceDate).toISOString(),
      reporter_role: reporterRole,
      narrative: narrative.trim(),
      confidential: reportType === 'VRS' ? confidential : false,
      reporter_identity: reporterIdentity.trim() || undefined,
    };

    try {
      const createdEvent = await submitEvent<SafetyEvent>(payload, idToken);
      onEventSubmitted(createdEvent);
    } catch (err: any) {
      let msg = err?.message || 'Failed to submit safety report';
      try {
        const parsed = JSON.parse(msg);
        if (parsed.message) {
          msg = parsed.message;
          if (Array.isArray(parsed.details) && parsed.details.length > 0) {
            const reasons = parsed.details
              .map((d: any) => d.failure_reason || d.rule_name || JSON.stringify(d))
              .join('; ');
            msg += `: ${reasons}`;
          }
        }
      } catch {
        // Not a JSON error, keep raw message
      }
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
      <div 
        className="px-6 py-4 text-white flex items-center justify-between"
        style={{ backgroundColor: tenant.primary_color }}
      >
        <div>
          <h2 className="text-lg font-bold">Safety Occurrence Reporting Wizard</h2>
          <p className="text-xs text-white/80">
            Compliant with ICAO Annex 19 & State Safety Management Directives
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-300" />
          <span>Tenant: {tenant.display_name}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-bold text-red-900">Submission Rejected by Safety Quality Gate:</span>
              <p className="text-red-800 leading-relaxed break-words">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Report Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Reporting Framework
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { setReportType('VRS'); setConfidential(true); }}
              className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                reportType === 'VRS'
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Lock className={`w-5 h-5 mt-0.5 ${reportType === 'VRS' ? 'text-blue-600' : 'text-slate-400'}`} />
              <div>
                <div className="text-sm font-bold text-slate-900">VRS (Voluntary Reporting)</div>
                <div className="text-xs text-slate-500">Non-punitive, reporter identity tokenized and protected.</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setReportType('MOR'); setConfidential(false); }}
              className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                reportType === 'MOR'
                  ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertCircle className={`w-5 h-5 mt-0.5 ${reportType === 'MOR' ? 'text-amber-600' : 'text-slate-400'}`} />
              <div>
                <div className="text-sm font-bold text-slate-900">MOR (Mandatory Occurrence)</div>
                <div className="text-xs text-slate-500">Mandatory reporting criteria under State Regulator and ICAO regulations.</div>
              </div>
            </button>
          </div>
        </div>

        {/* Operational Context Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Aircraft Fleet Type</label>
            <select
              value={aircraftType}
              onChange={(e) => setAircraftType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {tenant.fleets.map(f => (
                <option key={f.aircraft_type} value={f.aircraft_type}>{f.aircraft_type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Aircraft Registration</label>
            <input
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 9N-AMM"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Flight Number (Optional)</label>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 uppercase font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. YT-671"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phase of Flight</label>
            <select
              value={phaseOfFlight}
              onChange={(e) => setPhaseOfFlight(e.target.value as FlightPhase)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="PARKED">PARKED</option>
              <option value="TAXI">TAXI</option>
              <option value="TAKEOFF">TAKEOFF</option>
              <option value="CLIMB">CLIMB</option>
              <option value="EN_ROUTE">EN_ROUTE</option>
              <option value="DESCENT">DESCENT</option>
              <option value="APPROACH">APPROACH</option>
              <option value="LANDING">LANDING</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="GROUND_HANDLING">GROUND HANDLING</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Airport</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. VNKT (Kathmandu), VNLK (Lukla)"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Occurrence Date & Time</label>
            <input
              type="datetime-local"
              value={occurrenceDate}
              onChange={(e) => setOccurrenceDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Affected System & Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              System Affected (ATA Chapter / Component)
            </label>
            <input
              type="text"
              value={systemAffected}
              onChange={(e) => setSystemAffected(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. ATA 27 Flight Controls - Flap Asymmetry"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reporter Role</label>
            <select
              value={reporterRole}
              onChange={(e) => setReporterRole(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="CAPTAIN">CAPTAIN</option>
              <option value="FIRST_OFFICER">FIRST OFFICER</option>
              <option value="CABIN_CREW">CABIN CREW</option>
              <option value="DISPATCHER">DISPATCHER</option>
              <option value="LINE_ENGINEER">LINE MAINTENANCE ENGINEER</option>
              <option value="SAFETY_OFFICER">SAFETY OFFICER</option>
            </select>
          </div>
        </div>

        {/* Narrative & Quality Gate Counter */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Descriptive Occurrence Narrative
            </label>
            <span className={`text-[11px] font-mono ${isNarrativeValid ? 'text-emerald-600' : 'text-slate-400'}`}>
              {narrative.length} / 20 chars minimum
            </span>
          </div>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={4}
            className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Describe sequence of events, ambient weather conditions, flight deck indications, crew actions taken, and operational outcome..."
            required
          />
        </div>

        {/* Confidentiality & Tokenization Shield (Section 1 & 13 in PDF) */}
        {reportType === 'VRS' && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-emerald-900 space-y-1">
              <span className="font-bold">Cryptographic Identity Tokenization Active</span>
              <p className="text-emerald-800">
                In compliance with non-punitive safety reporting guidelines, your email and name will be cryptographically detached into an isolated vault before analytical processing.
              </p>
              <input
                type="text"
                value={reporterIdentity}
                onChange={(e) => setReporterIdentity(e.target.value)}
                placeholder="Optional identity for safety officer feedback (e.g. pilot@operator.com)"
                className="mt-2 text-xs p-2 rounded border border-emerald-300 w-full max-w-sm bg-white"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isReady || submitting}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all ${
              isReady && !submitting
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <span>Validating Quality Gate...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit to Safety Quality Gate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
