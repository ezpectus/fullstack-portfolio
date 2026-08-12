import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { getCompany, updateCompany } from './company.controller';
import { updateCompanySchema } from './company.dto';

const router = Router();

router.use(authenticate);

router.get('/', getCompany);
router.patch('/', validateBody(updateCompanySchema), updateCompany);

export { router as companyRoutes };
