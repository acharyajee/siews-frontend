import React, { useState } from 'react';
import { SafetyAction } from '../types';
import { CheckCircle2, AlertTriangle, ChevronRight, Plus, X } from 'lucide-react';

interface ActionTrackerProps {
  actions: SafetyAction[];
  onVerifyPeriod: (actionId: string, notes: string) => Promise<void> | void;
  onCreateAction?: (payload: any) => Promise<void> | void;
}

export const ActionTracker: React.FC<ActionTrackerProps> = ({ actions, onVerifyPeriod, onCreateAction }) => {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // New action modal / form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEventId, setNewEventId] = useState('');
  const [newType, setNewType] = useState('TRAINING');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleVerify = async (actionId: string) => {
    if (!evidenceNotes.trim()) return;
    setVerifying(true);
    setActionError(null);
    try {
      await onVerifyPeriod(actionId, evidenceNotes.trim());
      setEvidenceNotes('');
      setSelectedActionId(null);
    } catch (err: any) {
      setActionError(err?.message || 'Verification update failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateAction) return;
    setCreating(true);
    setActionError(null);
    try {
      await onCreateAction({
        event_id: newEventId.trim() || 'EVT-MANUAL-001',
        title: newTitle.trim(),
        action_type: newType,
        owner_name: newOwnerName.trim(),
        owner_email: newOwnerEmail.trim(),
        due_date: new Date(newDueDate).toISOString(),
        description: newDescription.trim() || newTitle.trim(),
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewEventId('');
      setNewOwnerName('');
      setNewOwnerEmail('');
      setNewDescription('');
    } catch (err: any) {
      setActionError(err?.message || 'Failed to create corrective action.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Safety Corrective Action Plans (CAP)
            </h2>
            <p className="text-xs text-slate-500">
              Closed-loop governance: Mandates proof of effect across 2 control periods prior to regulatory closure.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                {actions.filter(a => a.status !== 'VERIFIED_CLOSED').length} Active
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {actions.filter(a => a.status === 'VERIFIED_CLOSED').length} Verified Closed
              </span>
            </div>
            {onCreateAction && (
              <button
                onClick={() => { setShowCreateModal(true); setActionError(null); }}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Action</span>
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-red-900">Action Permission / Validation Notice:</span>
                <p className="text-red-800 leading-relaxed">{actionError}</p>
              </div>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex-shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {showCreateModal && (
          <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Create Safety Corrective Action</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Event ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EVT-YETI-001"
                    value={newEventId}
                    onChange={(e) => setNewEventId(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Action Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="TRAINING">TRAINING</option>
                    <option value="MAINTENANCE_TASK">MAINTENANCE_TASK</option>
                    <option value="PROCEDURE_CHANGE">PROCEDURE_CHANGE</option>
                    <option value="EQUIPMENT">EQUIPMENT</option>
                    <option value="ROSTERING_LIMIT">ROSTERING_LIMIT</option>
                    <option value="NOTOC_UPDATE">NOTOC_UPDATE</option>
                    <option value="POLICY_REVISION">POLICY_REVISION</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Simulator Contingency Module Revision"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Capt. R. Sharma"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    placeholder="safety@operator.com"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed mitigation instructions and verification criteria..."
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-lg font-bold"
                >
                  {creating ? 'Saving...' : 'Create Action Plan'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="divide-y divide-slate-100 mt-4">
          {actions.map((action) => {
            const isClosed = action.status === 'VERIFIED_CLOSED';
            const isPeriod1 = action.control_periods_verified === 1;

            return (
              <div key={action.action_id} className="py-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {action.action_id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                        {action.action_type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isClosed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 mt-1">{action.title}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{action.description}</div>
                  </div>

                  {/* Owner & Due Date */}
                  <div className="text-right text-xs text-slate-500 flex-shrink-0">
                    <div className="font-semibold text-slate-700">{action.owner_name}</div>
                    <div className="text-[11px] font-mono mt-0.5">
                      Due: {new Date(action.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* 2-Period Verification Ladder (Section 9 in PDF) */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        action.control_periods_verified >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        1
                      </span>
                      <span className={action.control_periods_verified >= 1 ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                        Control Period 1 (30d)
                      </span>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        action.control_periods_verified >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        2
                      </span>
                      <span className={action.control_periods_verified >= 2 ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                        Control Period 2 (60d)
                      </span>
                    </div>
                  </div>

                  {!isClosed && (
                    <div>
                      {selectedActionId === action.action_id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter empirical proof / audit evidence..."
                            value={evidenceNotes}
                            onChange={(e) => setEvidenceNotes(e.target.value)}
                            className="text-xs p-1.5 rounded border border-slate-300 w-64 bg-white"
                          />
                          <button
                            onClick={() => handleVerify(action.action_id)}
                            disabled={verifying}
                            className="bg-emerald-600 text-white text-xs px-2.5 py-1.5 rounded font-bold hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {verifying ? 'Submitting...' : 'Confirm Proof'}
                          </button>
                          <button
                            onClick={() => setSelectedActionId(null)}
                            className="text-xs text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedActionId(action.action_id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                        >
                          Submit Period {action.control_periods_verified + 1} Proof &rarr;
                        </button>
                      )}
                    </div>
                  )}

                  {isClosed && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Closed with Evidence</span>
                    </div>
                  )}
                </div>

                {action.verification_evidence && (
                  <div className="text-[11px] text-slate-500 italic pl-1">
                    Verified Proof: "{action.verification_evidence}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
