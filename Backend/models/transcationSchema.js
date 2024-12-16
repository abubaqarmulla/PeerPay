const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transaction_id: {
        type: String,
        required: true,
        unique: true,
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    sender_approved: {
        type: Boolean,
        default: false,
    },
    receiver_approved: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
    amount: {
        type: mongoose.Types.Decimal128,
        required: true,
    },
    interest_rate: {
        type: mongoose.Types.Decimal128,
        required: true, // Interest rate must always be specified
    },
    duration: {
        type: mongoose.Types.Decimal128, // Duration in days (can be a float)
        required: true,
    },
    due_date: {
        type: Date, // Due date will be calculated based on duration
        required: true,
    },
    transaction_state: {
        type: String,
        enum: [
            'PENDING',
            'APPROVED',
            'REJECTED_SENDER',
            'REJECTED_RECEIVER', // Fixed typo from 'RECIVIER'
            'COMPLETED',
            'DEFAULTED',
            'RETURNED',
        ],
        default: 'PENDING',
    },
    amount_returned: {
        type: Boolean,
        default: false,
    },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
