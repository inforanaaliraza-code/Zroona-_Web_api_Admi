const mongoose = require('mongoose')


const walletSchema = new mongoose.Schema({
    total_amount: {
        type: Number,
        default: 0,
        description: "Total balance (available + on_hold + pending)"
    },
    available_amount: {
        type: Number,
        default: 0,
        description: "Amount available for withdrawal"
    },
    on_hold_amount: {
        type: Number,
        default: 0,
        description: "Amount from pending withdrawal requests"
    },
    pending_amount: {
        type: Number,
        default: 0,
        description: "Earnings from events not yet released"
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'organizers'
    },
    minimum_withdrawal: {
        type: Number,
        default: 100,
        min: 0,
        description: "Minimum amount that can be withdrawn in SAR"
    },
    maximum_withdrawal: {
        type: Number,
        default: 50000,
        min: 100,
        description: "Maximum amount that can be withdrawn in SAR"
    },
}, { timestamps: true });

const Wallet = mongoose.model("wallet", walletSchema, 'wallet');

module.exports = Wallet;