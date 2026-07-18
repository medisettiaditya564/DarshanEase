const express = require('express');
const router = express.Router();
const {
    getStats, getUsers, updateUserRole, toggleUserStatus, createOrganizer, updateOrganizer, deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('ADMIN', 'ORGANIZER'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);

// Admin-only creation & management
router.post('/organizers', authorize('ADMIN'), createOrganizer);
router.put('/organizers/:id', authorize('ADMIN'), updateOrganizer);
router.put('/users/:id/role', authorize('ADMIN'), updateUserRole);
router.delete('/users/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
