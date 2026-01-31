const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    translations: [
        {
            locale: {
                type: String,
                enum: ['en', 'ar'],
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

// Index for faster queries
CountrySchema.index({ code: 1 });
CountrySchema.index({ 'translations.locale': 1 });

const Country = mongoose.model('country', CountrySchema);

module.exports = Country;

