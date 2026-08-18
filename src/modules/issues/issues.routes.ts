import { Router } from 'express';
import * as ctrl from './issues.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

export default router;
