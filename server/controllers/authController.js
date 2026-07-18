const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// @desc  Register user
// @route POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ success: false, message: 'Email already registered' });

        const user = await User.create({ name, email, password, phone });
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Please provide email and password' });

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        if (!user.isActive)
            return res.status(403).json({ success: false, message: 'Account deactivated' });

        res.json({
            success: true,
            token: generateToken(user._id),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

// @desc  Update profile
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address, avatar },
            { new: true }
        ).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Change password
// @route PUT /api/auth/password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!(await user.matchPassword(currentPassword)))
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
