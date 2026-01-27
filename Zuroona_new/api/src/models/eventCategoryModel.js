const mongoose = require('mongoose');

const event_categories_schema = new mongoose.Schema({
    name: {
        ar: {
            type: String
        },
        en: {
            type: String
        }
    },
    selected_image:{
        type:String,
    },
    unselected_image:{
        type:String,
    },
    is_delete:{
        type: Number,
        enum: [0,1],
        default: 0
    },
},{timestamps:true})

const EventCategories = mongoose.model('event_categories',event_categories_schema,'event_categories');

module.exports = EventCategories;