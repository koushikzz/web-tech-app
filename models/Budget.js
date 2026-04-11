const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Utilities', 'Entertainment', 'Food', 'Other'],
        unique: true
    },
    limit: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
