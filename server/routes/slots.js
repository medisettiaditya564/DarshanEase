const express = require('express');
const router = express.Router();
const { getSlots, getSlot, createSlot, updateSlot, deleteSlot } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSlots);
router.get('/:id', getSlot);
router.post('/', protect, authorize('ADMIN', 'ORGANIZER'), createSlot);
router.put('/:id', protect, authorize('ADMIN', 'ORGANIZER'), updateSlot);
router.delete('/:id', protect, authorize('ADMIN'), deleteSlot);

module.exports = router;
