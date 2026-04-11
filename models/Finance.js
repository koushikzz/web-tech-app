const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Expense', 'Subscription']
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    billingDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return !isNaN(v.getTime());
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['Utilities', 'Entertainment', 'Food', 'Other']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Finance', financeSchema);
