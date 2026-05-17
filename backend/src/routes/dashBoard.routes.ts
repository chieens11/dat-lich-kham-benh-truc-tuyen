import { Router } from 'express';
import { dashBoardController } from '../controllers/dashBoard.controller';

const router = Router();

router.get('/', dashBoardController.getDashboard);

export default router;