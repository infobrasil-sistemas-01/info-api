export interface WebhookSubscriptionResponse {
  id: string;
  userId: string;
  targetUrl: string;
  secretKey: string;
  isActive: boolean;
  events: string[];
  consecutiveFailures: number;
  isPaused: boolean;
  pausedAt?: Date | null;
  pauseReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDeliveryResponse {
  id: string;
  subscriptionId: string;
  event: string;
  payload: any;
  status: string;
  responseStatus?: number | null;
  responseBody?: string | null;
  durationMs?: number | null;
  attempts: number;
  nextRetryAt?: Date | null;
  lastError?: string | null;
  createdAt: Date;
}
