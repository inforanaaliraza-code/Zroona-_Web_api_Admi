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
        enum: [1, 2, 3], // 1 credit (earning), 2 debit (withdrawal), 3 refund
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
        default: 0, //  0 for pending , 1 success 2 for failed/rejected
    },
    // Invoice information (for admin/accounting only, not exposed to guests)
    invoice_id: {
        type: String,
        default: null,
    },
    invoice_url: {
        type: String,
        default: null,
    },
    // Withdrawal-specific fields
    withdrawal_method: {
        type: String,
        enum: ['bank_transfer', 'wallet', 'other'],
        default: 'bank_transfer'
    },
    bank_details: {
        bank_name: String,
        account_holder_name: String,
        account_number: String,
        iban: String,
        swift_code: String,
        branch_name: String
    },
    admin_notes: {
        type: String,
        default: null
    },
    rejection_reason: {
        type: String,
        default: null
    },
    processed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins'
    },
    processed_at: {
        type: Date,
        default: null
    },
    transaction_reference: {
        type: String,
        default: null
    },
    requested_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Wallet = mongoose.model("transaction", transactionSchema, 'transaction');

module.exports = Wallet;
