export type TenantId = 'yeti' | 'sita' | 'regulator' | 'caan' | 'default';

export interface FleetProfile {
  aircraft_type: string;
  manufacturer: string;
  count: number;
  registrations: string[];
}

export interface Tenant {
  tenant_id: TenantId;
  display_name: string;
  subdomain: string;
  domain: string;
  primary_color: string;
  secondary_color: string;
  logo_text: string;
  fleets: FleetProfile[];
  operating_bases: string[];
}

export type ReportType = 'VRS' | 'MOR';

export type FlightPhase = 
  | 'PARKED' 
  | 'TAXI' 
  | 'TAKEOFF' 
  | 'CLIMB' 
  | 'EN_ROUTE' 
  | 'DESCENT' 
  | 'APPROACH' 
  | 'LANDING' 
  | 'MAINTENANCE'
  | 'GROUND_HANDLING';

export type EventStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'QUALITY_CHECK' 
  | 'INVESTIGATING' 
  | 'ACTION_REQUIRED' 
  | 'CLOSED';

export interface SafetyEvent {
  event_id: string;
  tenant_id: string;
  report_type: ReportType;
  status: EventStatus;
  aircraft_type: string;
  registration: string;
  flight_number?: string;
  phase_of_flight: FlightPhase;
  system_affected: string;
  location: string;
  occurrence_date: string;
  created_at: string;
  reporter_role: string;
  narrative: string;
  confidential: boolean;
  tokenized_reporter_id?: string;
  adrep_category?: string;
  hfacs_tags: string[];
  meda_tags: string[];
  risk_score?: number;
  likelihood?: number;
  consequence?: number;
  trend_penalty_applied?: boolean;
  critical_alert_raised?: boolean;
}

export interface GSNNode {
  node_id: string;
  node_type: 'GOAL' | 'STRATEGY' | 'CLAIM' | 'EVIDENCE' | 'CONTEXT' | 'ASSUMPTION';
  title: string;
  description: string;
  parent_ids?: string[];
  child_ids?: string[];
  evidence_links?: string[];
  status: string;
}

export interface AssuranceCase {
  case_id: string;
  tenant_id: string;
  version: string;
  title: string;
  scope_context: string;
  aircraft_types: string[];
  root_goal_id: string;
  nodes: GSNNode[];
  model_hash: string;
  created_at: string;
  approved_by?: string | null;
  regulatory_mapping: string[];
}

export interface SafetyAction {
  action_id: string;
  tenant_id: string;
  event_id: string;
  title: string;
  action_type: string;
  status: string;
  owner_name: string;
  owner_email: string;
  due_date: string;
  created_at: string;
  description: string;
  control_periods_verified: number;
  verification_evidence?: string;
  closed_at?: string;
}
