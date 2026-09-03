export type RequestContext = {
  requestId: string;
  tenantId?: string;
  actorId?: string;
};

export type HealthStatus = {
  status: 'ok';
  service: string;
  timestamp: string;
};

export type DecisionEnvelope = {
  decisionId: string;
  confidenceScore: number;
  explanation: string;
  evidence: readonly string[];
  auditRecordId: string;
};
