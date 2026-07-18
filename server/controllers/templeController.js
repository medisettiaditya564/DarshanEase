const Temple = require('../models/Temple');

// @desc  Get all temples (with filters)
// @route GET /api/temples
exports.getTemples = async (req, res) => {
    try {
        const { category, city, search, page = 1, limit = 12, all = false } = req.query;
        let query = { isActive: true };

        if (all === 'true' && req.user) {
            if (req.user.role === 'ADMIN') {
                query = {}; // Admin sees all
            } else if (req.user.role === 'ORGANIZER') {
                query = { createdBy: req.user._id }; // Organizer sees own
            }
        }

        if (category) query.category = category;
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (search) query.name = new RegExp(search, 'i');

        const total = await Temple.countDocuments(query);
        const temples = await Temple.find(query)
            .populate('createdBy', 'name email')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({ success: true, total, temples });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get single temple
// @route GET /api/temples/:id
exports.getTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
        res.json({ success: true, temple });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Create temple (ADMIN)
// @route POST /api/temples
exports.createTemple = async (req, res) => {
    try {
        const temple = await Temple.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, temple });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Update temple (ADMIN)
// @route PUT /api/temples/:id
exports.updateTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        // Ownership check for organizers
        if (req.user.role === 'ORGANIZER' && temple.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this sanctuary' });
        }

        Object.assign(temple, req.body);
        await temple.save();
        res.json({ success: true, temple });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Delete temple (ADMIN)
// @route DELETE /api/temples/:id
exports.deleteTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        // Ownership check for organizers
        if (req.user.role === 'ORGANIZER' && temple.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this sanctuary' });
        }

        temple.isActive = false;
        await temple.save();
        res.json({ success: true, message: 'Temple deactivated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
