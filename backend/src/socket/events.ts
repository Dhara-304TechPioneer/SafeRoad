export const SOCKET_EVENTS = {
  CONNECTED: 'connected',
  JOIN: 'join',
  JOINED: 'joined',
  REPORT_CREATED: 'report-created',
  REPORT_UPDATED: 'report-updated',
  REPORT_ASSIGNED: 'report-assigned',
  REPORT_STATUS_CHANGED: 'report-status-changed',
  NOTIFICATION: 'notification',
  ERROR: 'error',
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
