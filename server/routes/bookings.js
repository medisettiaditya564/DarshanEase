const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBooking, cancelBooking, confirmBooking, getAllBookings, getOrganizerBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, authorize('ADMIN'), getAllBookings);
router.get('/organizer', protect, authorize('ORGANIZER'), getOrganizerBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking); // Logic in controller handles role
router.put('/:id/confirm', protect, authorize('ADMIN', 'ORGANIZER'), confirmBooking);

module.exports = router;
