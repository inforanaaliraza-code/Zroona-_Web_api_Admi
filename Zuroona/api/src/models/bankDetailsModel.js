const mongoose = require("mongoose");

const BankDetailSchema = new mongoose.Schema({
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    account_holder_name: {
        type: String,
    },
    bank_name: {
        type: String,
    },
    account_number: {
        type: String,
    },
    ifsc_code: {
        type: String,
    },
    iban:{
        type:String
    }
}, { timestamps: true });

const BankDetail = mongoose.model('organizer_bank_detail', BankDetailSchema);

module.exports = BankDetail;
