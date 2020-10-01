const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const usercreatesSchema = new Schema({
    user: {
        type: String,
        require: true
    },
    studyrooms:
    [{   
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'StudyRoom', 
        require: true, 
        unique: true 
    }],
},{
    timestamps: true      
})

var Usercreates = mongoose.model('Usercreates', usercreatesSchema);

module.exports = Usercreates;