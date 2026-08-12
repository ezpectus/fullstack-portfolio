import { Router } from 'express';
import { getOverview, getBookingsByDay, getTopServices, getTopProviders, getUpcomingBookings } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/overview', ...getOverview);
router.get('/bookings-by-day', ...getBookingsByDay);
router.get('/top-services', ...getTopServices);
router.get('/top-providers', ...getTopProviders);
router.get('/upcoming', ...getUpcomingBookings);

export default router;
