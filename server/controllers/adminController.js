const User = require('../models/User');
const Temple = require('../models/Temple');
const Booking = require('../models/Booking');
const Donation = require('../models/Donation');
const DarshanSlot = require('../models/DarshanSlot');

// @desc  Get admin dashboard stats
// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const isOrganizer = req.user.role === 'ORGANIZER';

        // Scope queries for organizers
        const templeQuery = isOrganizer ? { createdBy: req.user._id, isActive: true } : { isActive: true };

        let targetTempleIds = [];
        if (isOrganizer) {
            const ownedTemples = await Temple.find({ createdBy: req.user._id }).select('_id');
            targetTempleIds = ownedTemples.map(t => t._id);
        }

        const bookingQuery = isOrganizer ? { temple: { $in: targetTempleIds } } : {};
        const donationQuery = isOrganizer ? { temple: { $in: targetTempleIds }, paymentStatus: 'SUCCESS' } : { paymentStatus: 'SUCCESS' };

        // Calculate Monthly Trends (Last 30 Days)
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            last30Days.push({
                date,
                nextDate,
                label: i % 5 === 0 ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : ''
            });
        }

        const statsPromises = [
            isOrganizer ? Promise.resolve(0) : User.countDocuments(),
            Temple.countDocuments(templeQuery),
            Booking.countDocuments(bookingQuery),
            Donation.find(donationQuery),
            Booking.find(bookingQuery).sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('temple', 'name'),
            Donation.find(donationQuery).sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('temple', 'name'),
            // Trends
            ...last30Days.map(d => Booking.countDocuments({ ...bookingQuery, createdAt: { $gte: d.date, $lt: d.nextDate } }))
        ];

        const results = await Promise.all(statsPromises);

        const [usersCount, templesCount, totalBookings, donations, recentBookings, recentDonations] = results.slice(0, 6);
        const trends = last30Days.map((d, i) => ({
            label: d.label,
            value: results[6 + i]
        }));

        const totalRevenue = donations.reduce((sum, d) => sum + d.amount, 0);
        const confirmedBookings = await Booking.countDocuments({ ...bookingQuery, status: 'CONFIRMED' });

        // Category breakdown for donations
        const donationMetrics = {
            General: donations.filter(d => d.donationType === 'General').length,
            Annadanam: donations.filter(d => d.donationType === 'Annadanam').length,
            Special: donations.filter(d => !['General', 'Annadanam'].includes(d.donationType)).length
        };

        res.json({
            success: true,
            stats: {
                users: usersCount,
                temples: templesCount,
                bookings: totalBookings,
                confirmedBookings,
                totalDonations: donations.length,
                totalRevenue,
                recentBookings,
                recentDonations,
                trends,
                donationMetrics
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get all users (ADMIN)
// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Update user role (ADMIN)
// @route PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        ).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Toggle user active status
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.isActive = !user.isActive;
        await user.save();
        res.json({ success: true, user: { _id: user._id, isActive: user.isActive } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Create a new Organizer (ADMIN ONLY)
// @route POST /api/admin/organizers
exports.createOrganizer = async (req, res) => {
    try {
        const { name, email, password, phone, templeId } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'ORGANIZER'
        });

        // If templeId is provided, assign authority
        if (templeId) {
            // Ensure this user isn't assigned to other temples (optional, but requested for clarity)
            await Temple.updateMany({ createdBy: user._id }, { $unset: { createdBy: 1 } });
            await Temple.findByIdAndUpdate(templeId, { createdBy: user._id });
        }

        res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Update Organizer (ADMIN ONLY)
// @route PUT /api/admin/organizers/:id
exports.updateOrganizer = async (req, res) => {
    try {
        const { name, email, phone, templeId } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Organizer not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();

        // Handle temple reassignment
        if (templeId) {
            // Remove user from any previously owned temples
            await Temple.updateMany({ createdBy: user._id }, { $unset: { createdBy: 1 } });
            // Assign to new temple
            await Temple.findByIdAndUpdate(templeId, { createdBy: user._id });
        } else if (templeId === "") {
            // Explicitly clearing assignment if empty string provided
            await Temple.updateMany({ createdBy: user._id }, { $unset: { createdBy: 1 } });
        }

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Delete User (ADMIN ONLY)
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Optional: Reassign temples to admin if the deleted user was an organizer
        if (user.role === 'ORGANIZER') {
            const admin = await User.findOne({ role: 'ADMIN' });
            if (admin) {
                await Temple.updateMany({ createdBy: user._id }, { createdBy: admin._id });
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User removed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
