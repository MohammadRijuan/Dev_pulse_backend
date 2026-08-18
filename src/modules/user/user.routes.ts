import { Router } from 'express';
import * as ctrl from './user.controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole(['maintainer']), ctrl.getAllUser);
router.get('/:id', authenticate, ctrl.getSingleUser);
router.patch('/:id', authenticate, ctrl.updateSingleUser);
router.delete('/:id', authenticate, requireRole(['maintainer']), ctrl.deleteSingleUser);

export default router;
