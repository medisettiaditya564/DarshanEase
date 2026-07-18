const Donation = require('../models/Donation');

// @desc  Create donation
// @route POST /api/donations
exports.createDonation = async (req, res) => {
    try {
        const { templeId, amount, message, donationType } = req.body;
        if (!templeId || !amount)
            return res.status(400).json({ success: false, message: 'Temple and amount required' });

        const donation = await Donation.create({
            user: req.user._id,
            temple: templeId,
            amount,
            message,
            donationType,
            transactionId: 'TXN' + Date.now(),
        });

        const populated = await Donation.findById(donation._id).populate('temple', 'name location images');
        res.status(201).json({ success: true, donation: populated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get my donations
// @route GET /api/donations/my
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ user: req.user._id })
            .populate('temple', 'name location images')
            .sort({ createdAt: -1 });
        res.json({ success: true, donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get all donations (ADMIN)
// @route GET /api/donations
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate('user', 'name email')
            .populate('temple', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get organizer donations
// @route GET /api/donations/organizer
exports.getOrganizerDonations = async (req, res) => {
    try {
        const Temple = require('../models/Temple');
        const managedTemples = await Temple.find({ organizer: req.user._id }).select('_id');
        const templeIds = managedTemples.map(t => t._id);

        const donations = await Donation.find({ temple: { $in: templeIds } })
            .populate('user', 'name email phone')
            .populate('temple', 'name location')
            .sort({ createdAt: -1 });

        res.json({ success: true, donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
