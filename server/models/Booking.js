const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
        slot: { type: mongoose.Schema.Types.ObjectId, ref: 'DarshanSlot', required: true },
        tickets: { type: Number, required: true, min: 1, max: 10 },
        totalAmount: { type: Number, required: true },
        visitors: [
            {
                name: { type: String, required: true },
                age: { type: Number, required: true },
                gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
                aadhaar: { type: String, required: true },
            }
        ],
        paymentDetails: {
            upiId: { type: String },
            utrId: { type: String },
            status: {
                type: String,
                enum: ['PENDING', 'VERIFIED', 'FAILED'],
                default: 'PENDING'
            }
        },
        status: {
            type: String,
            enum: ['CONFIRMED', 'CANCELLED', 'PENDING', 'PENDING_PAYMENT'],
            default: 'PENDING',
        },
        bookingRef: { type: String, unique: true },
        visitDate: { type: Date },
        visitTime: { type: String },
        specialRequests: { type: String, default: '' },
        cancelledAt: { type: Date },
    },
    { timestamps: true }
);

// Generate booking reference before save
bookingSchema.pre('save', function (next) {
    if (!this.bookingRef) {
        this.bookingRef = 'DE' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
