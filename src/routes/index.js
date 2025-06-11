import { Router } from 'express';
const router = Router();

import authenticationRoute from './authentication.route.js';

router.use('/authentication', authenticationRoute);

export default router;
