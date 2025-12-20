const mongoose = require('mongoose');

const group_categories_schema = new mongoose.Schema({
    name: {
        ar: {
            type: String
        },
        en: {
            type: String
        }
    },
    selected_image: {
        type: String,
    },
    unselected_image: {
        type: String,
    }
}, { timestamps: true })

const GroupCategories = mongoose.model('group_categories', group_categories_schema, 'group_categories');

module.exports = GroupCategories;