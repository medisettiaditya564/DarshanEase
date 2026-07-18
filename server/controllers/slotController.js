const DarshanSlot = require('../models/DarshanSlot');

// @desc  Get slots (filter by temple + date)
// @route GET /api/slots
exports.getSlots = async (req, res) => {
    try {
        const { templeId, date } = req.query;
        const query = { isActive: true };
        if (templeId) query.temple = templeId;
        if (date) {
            const d = new Date(date);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            query.date = { $gte: d, $lt: next };
        }
        const slots = await DarshanSlot.find(query).populate('temple', 'name location').sort({ startTime: 1 });
        res.json({ success: true, slots });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get single slot
// @route GET /api/slots/:id
exports.getSlot = async (req, res) => {
    try {
        const slot = await DarshanSlot.findById(req.params.id).populate('temple');
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
        res.json({ success: true, slot });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Create slot (ADMIN/ORGANIZER)
// @route POST /api/slots
exports.createSlot = async (req, res) => {
    try {
        const { temple: templeId } = req.body;

        // Ownership check for organizers
        if (req.user.role === 'ORGANIZER') {
            const Temple = require('../models/Temple');
            const temple = await Temple.findById(templeId);
            if (!temple || temple.organizer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Unauthorized to create slots for this sanctuary' });
            }
        }

        const slot = await DarshanSlot.create(req.body);
        res.status(201).json({ success: true, slot });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Update slot
// @route PUT /api/slots/:id
exports.updateSlot = async (req, res) => {
    try {
        let slot = await DarshanSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

        // Ownership check for organizers
        if (req.user.role === 'ORGANIZER') {
            const Temple = require('../models/Temple');
            const temple = await Temple.findById(slot.temple);
            if (!temple || temple.organizer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Unauthorized to modify this slot' });
            }
        }

        slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, slot });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Delete slot
// @route DELETE /api/slots/:id
exports.deleteSlot = async (req, res) => {
    try {
        const slot = await DarshanSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

        // Ownership check for organizers
        if (req.user.role === 'ORGANIZER') {
            const Temple = require('../models/Temple');
            const temple = await Temple.findById(slot.temple);
            if (!temple || temple.organizer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Unauthorized to delete this slot' });
            }
        }

        await DarshanSlot.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Slot deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
