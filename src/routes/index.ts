import { Router } from 'express';
import UserRouter from './Users';
import HeatRouter from "./Heat";
import cors from 'cors';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/heat', HeatRouter);

// Export the base-router
export default router;
