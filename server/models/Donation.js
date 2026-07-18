const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
        amount: { type: Number, required: true, min: 1 },
        message: { type: String, default: '' },
        donationType: {
            type: String,
            enum: ['General', 'Annadanam', 'Renovation', 'Festival', 'Education'],
            default: 'General',
        },
        paymentStatus: {
            type: String,
            enum: ['SUCCESS', 'PENDING', 'FAILED'],
            default: 'SUCCESS',
        },
        transactionId: { type: String, default: '' },
        donationRef: { type: String, unique: true },
    },
    { timestamps: true }
);

donationSchema.pre('save', function (next) {
    if (!this.donationRef) {
        this.donationRef = 'DON' + Date.now().toString(36).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Donation', donationSchema);
