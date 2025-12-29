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
});

const Wallet = mongoose.model("wallet", walletSchema, 'wallet');

module.exports = Wallet;