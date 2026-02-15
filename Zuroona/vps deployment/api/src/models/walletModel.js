const mongoose = require('mongoose')


const walletSchema = new mongoose.Schema({
    total_amount: {
        type: Number,
        default:0
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