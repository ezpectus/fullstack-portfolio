export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES_REP: 'sales_rep',
} as const;

export const CUSTOMER_STATUSES = {
  LEAD: 'lead',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const DEAL_STAGES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  WON: 'won',
  LOST: 'lost',
} as const;

export const DEAL_STAGE_ORDER = [
  DEAL_STAGES.NEW,
  DEAL_STAGES.CONTACTED,
  DEAL_STAGES.QUALIFIED,
  DEAL_STAGES.PROPOSAL,
  DEAL_STAGES.WON,
  DEAL_STAGES.LOST,
] as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
