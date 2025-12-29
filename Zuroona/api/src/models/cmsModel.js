const mongoose = require('mongoose');

const CmsSchema = new mongoose.Schema({
    type:{
        type: String,
        enum:['1','2','3'],
    },
    description:{
        type:String
    },
    description_ar:{
        type:String
    }

},{timestamps:true})

const Cms = mongoose.model('cms',CmsSchema,'cms');


module.exports = Cms;