import { Router } from 'express';
const router = Router();

import validationHandler from '../middleware/validation.middleware.js';
import { fullname, email, password, refreshToken } from '../validations/authentication.validation.js';

import { onSignIn, onRegister, onRefreshToken } from '../controllers/authentication.controller.js';

router.post('/v1/api_signin', [email, password, validationHandler], onSignIn);

router.post('/v1/api_register', [fullname, email, password, validationHandler], onRegister);

router.post('/v1/api_refreshtoken', [refreshToken, validationHandler], onRefreshToken);

export default router;
