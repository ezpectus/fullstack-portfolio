import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { memberActivity, popularGenres, lostDamaged, exportCsv } from './reports.controller';

const router = Router();

router.get('/member-activity', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), memberActivity);
router.get('/popular-genres', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), popularGenres);
router.get('/lost-damaged', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), lostDamaged);
router.get('/export', authenticate, requireRole(ROLES.ADMIN, ROLES.LIBRARIAN), exportCsv);

export default router;
