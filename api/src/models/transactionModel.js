const mongoose = require('mongoose')


const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['SAR', 'USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'CHF', 'MXN', 'BRL'],
        default: "SAR",
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'organizers'
    },
    type: {
        type: Number,
        enum: [1, 2], // 1  credit , 2 debit  
        required: true
    },
    payment_id: {
        type: String,
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event_books'
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0, //  0 for pending , 1 success 2 for failed
    }
}, { timestamps: true });

const Wallet = mongoose.model("transaction", transactionSchema, 'transaction');

module.exports = Wallet;
