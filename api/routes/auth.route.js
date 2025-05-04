import express from 'express';
import { signup , signin, google, signOut, securityAlerts, getAlerts } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get('/signout', signOut);
router.post('/securityAlerts', securityAlerts);
router.get('/alerts', getAlerts);

export default router;