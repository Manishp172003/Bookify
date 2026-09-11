 import express from 'express';
import { 
  register, 
  login, 
  adminLogin, 
  getUserSettings, 
  updateProfile, 
  updatePrivacy, 
  updateAddress, 
  updatePayment 
} from '../controllers/authController.js';
// Change this line:
// import verifyToken from '../middleware/authMiddleware.js';

// To this:
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Settings Routes (Protected by verifyToken middleware)
router.get('/settings', verifyToken, getUserSettings);
router.put('/settings/profile', verifyToken, updateProfile); // Route for basic info
router.put('/settings/privacy', verifyToken, updatePrivacy);
router.put('/settings/address', verifyToken, updateAddress);
router.put('/settings/payment', verifyToken, updatePayment);

export default router;