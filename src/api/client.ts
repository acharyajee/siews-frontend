import { auth } from '../firebase';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');

export async function apiFetch<T>(
  endpoint: string,
  idToken?: string | null,
  options: RequestInit = {}
): Promise<T> {
  let token = idToken;
  if (!token && auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.delete('X-Tenant-ID');

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    const detail = errData?.detail
      ? typeof errData.detail === 'string'
        ? errData.detail
        : JSON.stringify(errData.detail)
      : errData?.message || `HTTP Error ${response.status}`;
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchEvents<T = unknown>(
  idToken?: string | null,
  params?: Record<string, string>
): Promise<T> {
  const query = params && Object.keys(params).length > 0
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  return apiFetch<T>(`/events${query}`, idToken, { method: 'GET' });
}

export async function submitEvent<T = unknown>(
  payload: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/events', idToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchEventDetail<T = unknown>(
  eventId: string,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>(`/events/${encodeURIComponent(eventId)}`, idToken, {
    method: 'GET',
  });
}

export async function fetchActions<T = unknown>(
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/actions', idToken, { method: 'GET' });
}

export async function createAction<T = unknown>(
  payload: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/actions', idToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function advanceActionVerification<T = unknown>(
  actionId: string,
  evidenceNotes: string | { evidence_notes?: string } = '',
  idToken?: string | null
): Promise<T> {
  const notes = typeof evidenceNotes === 'string'
    ? evidenceNotes
    : (evidenceNotes?.evidence_notes || '');
  const query = `?evidence_notes=${encodeURIComponent(notes)}`;
  return apiFetch<T>(`/actions/${encodeURIComponent(actionId)}/verify-control-period${query}`, idToken, {
    method: 'POST',
  });
}

export async function fetchAssuranceCase<T = unknown>(
  idToken?: string | null,
  params?: Record<string, string>
): Promise<T> {
  const query = params && Object.keys(params).length > 0
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  return apiFetch<T>(`/assurance/generate${query}`, idToken, { method: 'GET' });
}

export async function analyzeNarrative<T = unknown>(
  payload: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/nlp/analyze', idToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchReviewQueue<T = unknown>(
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/nlp/review-queue', idToken, { method: 'GET' });
}

export async function adjudicateNlpEvent<T = unknown>(
  eventId: string,
  payload: { officer_name?: string; notes?: string } | string,
  idToken?: string | null
): Promise<T> {
  const officerName = typeof payload === 'string'
    ? payload
    : (payload?.officer_name || 'Safety Officer');
  const notes = typeof payload === 'object' && payload?.notes ? payload.notes : '';
  const query = `?officer_name=${encodeURIComponent(officerName)}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`;
  return apiFetch<T>(`/nlp/adjudicate/${encodeURIComponent(eventId)}${query}`, idToken, {
    method: 'POST',
  });
}

export async function fetchPatternAnalysis<T = unknown>(
  idToken?: string | null,
  params?: Record<string, string>
): Promise<T> {
  const query = params && Object.keys(params).length > 0
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  return apiFetch<T>(`/patterns/report${query}`, idToken, { method: 'GET' });
}

export async function runMonteCarloSimulation<T = unknown>(
  payload: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/simulation/monte-carlo', idToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function runMarkovSimulation<T = unknown>(
  payload?: { cycles?: number } | number,
  idToken?: string | null
): Promise<T> {
  const cycles = typeof payload === 'number'
    ? payload
    : (typeof payload === 'object' && payload?.cycles ? payload.cycles : 10000);
  return apiFetch<T>(`/simulation/markov-exposure?cycles=${cycles}`, idToken, {
    method: 'GET',
  });
}

export async function runRbdSimulation<T = unknown>(
  payload?: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/simulation/reliability-blocks', idToken, {
    method: 'GET',
  });
}

export async function generateRegulatorPack<T = unknown>(
  payload?: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/regulator-pack/generate', idToken, {
    method: 'GET',
  });
}


export async function fetchFatigueFleetOverview<T = unknown>(
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/fatigue/fleet-overview', idToken, { method: 'GET' });
}

export async function assessCrewFatigue<T = unknown>(
  payload: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/fatigue/assess', idToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchPredictiveForecast<T = unknown>(
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/predictive/forecast', idToken, { method: 'GET' });
}

export async function ingestFdmTelemetry<T = unknown>(
  payload: unknown,
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/predictive/fdm-ingest', idToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function syncToStateRegulator<T = unknown>(
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/predictive/regulator-sync', idToken, {
    method: 'POST',
  });
}

export async function fetchRegulatorSyncHistory<T = unknown>(
  idToken?: string | null
): Promise<T> {
  return apiFetch<T>('/predictive/regulator-sync/history', idToken, { method: 'GET' });
}
