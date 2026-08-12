import { Router } from 'express';
import { getOverview, getBookingsByDay, getTopServices, getTopProviders, getUpcomingBookings } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '../../shared/constants';

const router = Router();

router.use(authenticate);

router.get('/overview', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...getOverview);
router.get('/bookings-by-day', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...getBookingsByDay);
router.get('/top-services', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...getTopServices);
router.get('/top-providers', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...getTopProviders);
router.get('/upcoming', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...getUpcomingBookings);

export default router;
