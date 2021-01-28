import { Router } from 'express';
import HealthRouter from './Health';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/health', HealthRouter);

// Export the base-router
export default router;
