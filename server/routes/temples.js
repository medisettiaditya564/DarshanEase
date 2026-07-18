const express = require('express');
const router = express.Router();
const { getTemples, getTemple, createTemple, updateTemple, deleteTemple } = require('../controllers/templeController');
const { protect, authorize, optionalProtect } = require('../middleware/auth');

router.get('/', optionalProtect, getTemples);
router.get('/:id', getTemple);
router.post('/', protect, authorize('ADMIN', 'ORGANIZER'), createTemple);
router.put('/:id', protect, authorize('ADMIN', 'ORGANIZER'), updateTemple);
router.delete('/:id', protect, authorize('ADMIN'), deleteTemple);

module.exports = router;
