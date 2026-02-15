const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country',
        required: true
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
CitySchema.index({ country_id: 1 });
CitySchema.index({ 'translations.locale': 1 });

const City = mongoose.model('city', CitySchema);

module.exports = City;

