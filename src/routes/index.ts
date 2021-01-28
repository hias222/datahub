import { Router } from 'express';
import AddRouter from './Add';
import HeatRouter from './Heat';

// Init router and path
const router = Router();

// Add sub-routes
// router.use('/users', UserRouter);
router.use('/heat', HeatRouter);
router.use('/internal', AddRouter);

// Export the base-router
export default router;
