 import express from 'express';
import { 
  register, 
  login, 
  adminLogin, 
  getUserSettings, 
  updateProfile, 
  updatePrivacy, 
  updateAddress, 
  updatePayment,
  updateNotifications, // Newly added import
  updatePassword       // Newly added import
} from '../controllers/authController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Settings Routes (Protected by verifyToken middleware)
router.get('/settings', verifyToken, getUserSettings);
router.put('/settings/profile', verifyToken, updateProfile);
router.put('/settings/privacy', verifyToken, updatePrivacy);
router.put('/settings/address', verifyToken, updateAddress);
router.put('/settings/payment', verifyToken, updatePayment);
router.put('/settings/notifications', verifyToken, updateNotifications); // New Route
router.put('/settings/password', verifyToken, updatePassword);           // New Route

export default router;