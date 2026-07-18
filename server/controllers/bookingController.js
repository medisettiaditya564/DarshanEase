const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// @desc  Create booking
// @route POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { templeId, slotId, tickets, visitors, paymentDetails, specialRequests } = req.body;

        const slot = await DarshanSlot.findById(slotId);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
        if (slot.availableSeats < tickets)
            return res.status(400).json({ success: false, message: `Only ${slot.availableSeats} seats available` });

        const totalAmount = slot.price * tickets;
        const booking = await Booking.create({
            user: req.user._id,
            temple: templeId,
            slot: slotId,
            tickets,
            visitors,
            paymentDetails,
            totalAmount,
            visitDate: slot.date,
            visitTime: slot.startTime,
            specialRequests,
            status: 'CONFIRMED' // We'll set it to confirmed since the frontend only calls this after payment step
        });

        // Update booked count
        slot.bookedCount += tickets;
        await slot.save();

        const populated = await Booking.findById(booking._id)
            .populate('temple', 'name location images')
            .populate('slot', 'date startTime endTime slotType');

        res.status(201).json({ success: true, booking: populated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get my bookings
// @route GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('temple', 'name location images')
            .populate('slot', 'date startTime endTime slotType price')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get single booking
// @route GET /api/bookings/:id
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('temple')
            .populate('slot')
            .populate('user', 'name email phone');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN')
            return res.status(403).json({ success: false, message: 'Not authorized' });
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Cancel booking
// @route PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // Authorization check: User who booked, ADMIN, or the ORGANIZER of the temple
        const isOwner = booking.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'ADMIN';
        let isOrganizer = false;

        if (req.user.role === 'ORGANIZER') {
            const temple = await Temple.findById(booking.temple);
            if (temple && temple.createdBy.toString() === req.user._id.toString()) {
                isOrganizer = true;
            }
        }

        if (!isOwner && !isAdmin && !isOrganizer) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'CANCELLED')
            return res.status(400).json({ success: false, message: 'Booking already cancelled' });

        booking.status = 'CANCELLED';
        booking.cancelledAt = Date.now();
        await booking.save();

        // Return seats to slot
        await DarshanSlot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -booking.tickets } });

        res.json({ success: true, message: 'Booking cancelled successfully', booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Confirm booking (ORGANIZER/ADMIN ONLY)
// @route PUT /api/bookings/:id/confirm
exports.confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // Authorization check
        const isAdmin = req.user.role === 'ADMIN';
        let isOrganizer = false;

        if (req.user.role === 'ORGANIZER') {
            const temple = await Temple.findById(booking.temple);
            if (temple && temple.createdBy.toString() === req.user._id.toString()) {
                isOrganizer = true;
            }
        }

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ success: false, message: 'Not authorized to confirm this booking' });
        }

        booking.status = 'CONFIRMED';
        await booking.save();

        res.json({ success: true, message: 'Booking confirmed successfully', booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get all bookings (ADMIN)
// @route GET /api/bookings/all
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('temple', 'name')
            .populate('slot', 'date startTime')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// @desc  Get organizer bookings (ORGANIZER)
// @route GET /api/bookings/organizer
exports.getOrganizerBookings = async (req, res) => {
    try {
        const ownedTemples = await Temple.find({ createdBy: req.user._id }).select('_id');
        const templeIds = ownedTemples.map(t => t._id);

        const bookings = await Booking.find({ temple: { $in: templeIds } })
            .populate('user', 'name email phone')
            .populate('temple', 'name location')
            .populate('slot', 'date startTime endTime slotType price')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
