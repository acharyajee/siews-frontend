import React, { useState, useEffect } from 'react';
import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchEvents, fetchActions, submitEvent, createAction, advanceActionVerification, fetchAssuranceCase } from './api/client';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { RiskMatrix } from './components/RiskMatrix';
import { ReportWizard } from './components/ReportWizard';
import { EventLedger } from './components/EventLedger';
import { AssuranceCaseView } from './components/AssuranceCaseView';
import { ActionTracker } from './components/ActionTracker';
import { NLPAnalyzer } from './components/NLPAnalyzer';
import { PatternDetectorView } from './components/PatternDetectorView';
import { SimulationView } from './components/SimulationView';
import { RegulatorPackView } from './components/RegulatorPackView';
import { PredictiveFrmsView } from './components/PredictiveFrmsView';
import { SafetyEvent, SafetyAction, AssuranceCase } from './types';
import { AlertCircle } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { tenant } = useTenant();
  const { user, idToken } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState<SafetyEvent[]>([]);
  const [actions, setActions] = useState<SafetyAction[]>([]);
  const [assuranceCase, setAssuranceCase] = useState<AssuranceCase | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const reloadData = async () => {
    if (!user) return;
    setDataLoading(true);
    setDataError(null);
    try {
      const [fetchedEvents, fetchedActions, fetchedCase] = await Promise.all([
        fetchEvents<SafetyEvent[]>(idToken),
        fetchActions<SafetyAction[]>(idToken),
        fetchAssuranceCase<AssuranceCase>(idToken).catch(err => {
          console.warn('Could not fetch assurance case:', err);
          return null;
        }),
      ]);
      setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
      setActions(Array.isArray(fetchedActions) ? fetchedActions : []);
      if (fetchedCase) {
        setAssuranceCase(fetchedCase);
      }
    } catch (err: any) {
      console.error('Failed to fetch data from backend:', err);
      setDataError(err?.message || 'Could not connect to FastAPI backend');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, [user, idToken, tenant.tenant_id]);

  // Scoped events for active tenant (Regulator sees all)
  const isRegulator = tenant.tenant_id === 'regulator' || tenant.tenant_id === 'caan';
  const scopedEvents = events.filter(
    e => isRegulator || e.tenant_id === tenant.tenant_id
  );
  const scopedActions = actions.filter(
    a => isRegulator || a.tenant_id === tenant.tenant_id
  );

  const criticalCount = scopedEvents.filter(e => (e.risk_score || 0) >= 16).length;

  const handleEventSubmitted = async (newEvent: SafetyEvent) => {
    setEvents(prev => [newEvent, ...prev.filter(e => e.event_id !== newEvent.event_id)]);
    setActiveTab('events');
    try {
      const [refreshedActions, refreshedCase] = await Promise.all([
        fetchActions<SafetyAction[]>(idToken),
        fetchAssuranceCase<AssuranceCase>(idToken).catch(() => null),
      ]);
      if (Array.isArray(refreshedActions)) {
        setActions(refreshedActions);
      }
      if (refreshedCase) {
        setAssuranceCase(refreshedCase);
      }
    } catch (err) {
      console.error('Failed to refresh actions and assurance case after event submission:', err);
    }
  };

  const handleVerifyPeriod = async (actionId: string, notes: string) => {
    const updated = await advanceActionVerification<SafetyAction>(actionId, notes, idToken);
    if (updated && updated.action_id) {
      setActions(prev => prev.map(a => a.action_id === actionId ? updated : a));
    } else {
      const refreshedActions = await fetchActions<SafetyAction[]>(idToken);
      if (Array.isArray(refreshedActions)) {
        setActions(refreshedActions);
      }
    }
    // Re-fetch assurance case since evidence proofs may update
    try {
      const refreshedCase = await fetchAssuranceCase<AssuranceCase>(idToken);
      if (refreshedCase) {
        setAssuranceCase(refreshedCase);
      }
    } catch {
      // non-critical
    }
  };

  const handleCreateAction = async (payload: any) => {
    const created = await createAction<SafetyAction>(payload, idToken);
    if (created && created.action_id) {
      setActions(prev => [created, ...prev]);
    } else {
      const refreshedActions = await fetchActions<SafetyAction[]>(idToken);
      if (Array.isArray(refreshedActions)) {
        setActions(refreshedActions);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalAlertCount={criticalCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {dataError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span><strong>Backend Connection Notice:</strong> {dataError}</span>
            </div>
            <button
              onClick={() => reloadData()}
              className="text-xs font-bold text-red-700 underline hover:text-red-900 ml-4 flex-shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {dataLoading && events.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
            <p className="font-semibold uppercase tracking-wider text-slate-600">Loading safety records from backend...</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <RiskMatrix events={scopedEvents} />
        )}

        {activeTab === 'nlp' && (
          <NLPAnalyzer />
        )}

        {activeTab === 'patterns' && (
          <PatternDetectorView />
        )}

        {activeTab === 'simulation' && (
          <SimulationView />
        )}

        {activeTab === 'predictive' && (
          <PredictiveFrmsView />
        )}

        {activeTab === 'assurance' && (
          assuranceCase ? (
            <AssuranceCaseView assuranceCase={assuranceCase} />
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
              <p className="text-xs uppercase font-semibold tracking-wider">Generating live GSN assurance case from backend...</p>
            </div>
          )
        )}

        {activeTab === 'report' && (
          <ReportWizard
            onEventSubmitted={handleEventSubmitted}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'events' && (
          <EventLedger events={scopedEvents} />
        )}

        {activeTab === 'actions' && (
          <ActionTracker
            actions={scopedActions}
            onVerifyPeriod={handleVerifyPeriod}
            onCreateAction={handleCreateAction}
          />
        )}

        {activeTab === 'regulator' && (
          <RegulatorPackView />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>AviaSafe Systems</strong> &bull; ICAO Annex 19 &bull; EASA Part-OPS &bull; State Regulator Compliant
          </div>
          <div className="font-mono text-[11px]">
            Target Domain: <span className="text-slate-800 font-bold">aviasafesystems.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { user, loading, claims } = useAuth();
  const { setTenantId } = useTenant();
  const [showLogin, setShowLogin] = useState<boolean>(false);

  useEffect(() => {
    if (claims?.tenant_id && ['yeti', 'sita', 'regulator', 'caan'].includes(claims.tenant_id)) {
      setTenantId((claims.tenant_id === 'caan' ? 'regulator' : claims.tenant_id) as any);
    }
  }, [claims, setTenantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading AviaSafe Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!showLogin) {
      return <LandingPage onEnterPortal={() => setShowLogin(true)} />;
    }
    return <LoginScreen onBackToLanding={() => setShowLogin(false)} />;
  }

  return <MainDashboard />;
};

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AuthenticatedApp />
      </TenantProvider>
    </AuthProvider>
  );
}
