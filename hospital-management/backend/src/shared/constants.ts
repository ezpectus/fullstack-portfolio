export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const APPOINTMENT_STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;

export const ROLES = ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT'] as const;

export const REDIS_APPOINTMENT_LOCK_PREFIX = 'appointment:lock:';
export const APPOINTMENT_LOCK_TTL = 10;
