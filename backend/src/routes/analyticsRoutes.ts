import { Router } from 'express';
import {
  getDashboard,
  getStatusDistribution,
  getSeverityDistribution,
  getReportsByCity,
  getMonthlyTrends,
  getDepartmentPerformance,
  getOfficerPerformance,
  getRecent,
} from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// Protect all endpoints with JWT check
router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/status-distribution', getStatusDistribution);
router.get('/severity-distribution', getSeverityDistribution);
router.get('/reports-by-city', requireRole('OFFICER', 'ADMIN'), getReportsByCity);
router.get('/monthly-trends', requireRole('OFFICER', 'ADMIN'), getMonthlyTrends);
router.get('/department-performance', requireRole('ADMIN'), getDepartmentPerformance);
router.get('/officer-performance', requireRole('OFFICER', 'ADMIN'), getOfficerPerformance);
router.get('/recent', requireRole('OFFICER', 'ADMIN'), getRecent);

export default router;
