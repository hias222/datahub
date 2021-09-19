import { Router } from 'express';
import HeatRouter from './Heat';

// Init router and path
const router = Router();

// Add sub-routes
// router.use('/users', UserRouter);
router.use('/datahub/heat', HeatRouter);

// Export the base-router
export default router;
