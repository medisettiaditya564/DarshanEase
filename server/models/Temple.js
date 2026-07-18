const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        location: {
            city: { type: String, required: true },
            state: { type: String, required: true },
            address: { type: String, required: true },
            coordinates: { lat: Number, lng: Number },
        },
        images: [{ type: String }],
        category: {
            type: String,
            enum: ['Hindu', 'Jain', 'Buddhist', 'Sikh', 'Other'],
            default: 'Hindu',
        },
        deity: { type: String, required: true },
        openTime: { type: String, default: '06:00' },
        closeTime: { type: String, default: '20:00' },
        entryFee: { type: Number, default: 0 },
        specialDarshanFee: { type: Number, default: 100 },
        rating: { type: Number, default: 4.5, min: 1, max: 5 },
        reviewCount: { type: Number, default: 0 },
        facilities: [{ type: String }],
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Temple', templeSchema);
