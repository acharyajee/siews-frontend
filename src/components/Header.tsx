import React from 'react';
import { useTenant } from '../context/TenantContext';
import { TenantId } from '../types';
import { useAuth } from '../context/AuthContext';
import { Shield, Plane, AlertTriangle, FileText, CheckCircle2, Award, Sparkles, TrendingUp, Binary, Download, LogOut, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  criticalAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, criticalAlertCount }) => {
  const { tenant, setTenantId, isCustomSubdomain } = useTenant();
  const { user, claims, logOut } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* 24-Hour Critical Alert Banner (Section 9 of PDF) */}
      {criticalAlertCount > 0 && (
        <div className="bg-red-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>MANDATORY SAFETY ALERT: {criticalAlertCount} occurrence(s) with Risk Score &ge; 16 requiring review within 24 hours.</span>
          </div>
          <button 
            onClick={() => setActiveTab('events')}
            className="underline hover:text-red-100 text-xs ml-4"
          >
            View Critical Queue &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Tenant Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow"
              style={{ backgroundColor: tenant.primary_color }}
            >
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  {tenant.display_name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {tenant.tenant_id.toUpperCase()} OPERATOR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {tenant.subdomain}.aviasafesystems.com
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Risk Matrix
            </button>
            <button
              onClick={() => setActiveTab('nlp')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'nlp'
                  ? 'bg-purple-50 text-purple-800 font-semibold border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              NLP & HFACS
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'patterns'
                  ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              Patterns & Clusters
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'simulation'
                  ? 'bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Binary className="w-3.5 h-3.5 text-indigo-600" />
              Monte Carlo Proof
            </button>
            <button
              onClick={() => setActiveTab('predictive')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'predictive'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-semibold border border-indigo-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Predictive & FRMS
            </button>
            <button
              onClick={() => setActiveTab('assurance')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'assurance'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              GSN Tree
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'report'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              File Report
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'events'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Ledger
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'actions'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              CAP
            </button>
            <button
              onClick={() => setActiveTab('regulator')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'regulator'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Regulator Pack
            </button>
          </nav>

          {/* Dev Tenant Switcher */}
          <div className="flex items-center gap-2">
            {!isCustomSubdomain && (
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">Tenant:</span>
                <select
                  value={tenant.tenant_id}
                  onChange={(e) => setTenantId(e.target.value as TenantId)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="yeti">Yeti Airlines (ATR 72)</option>
                  <option value="sita">Sita Air (Dornier 228)</option>
                  <option value="regulator">State Regulator Oversight</option>
                  <option value="default">Central Platform (SMS)</option>
                </select>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[150px]">
                    {user.email}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {claims?.role || 'OPERATOR'}
                  </div>
                </div>
                <button
                  onClick={() => logOut()}
                  title="Sign Out"
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
