const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const studentSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    picture: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})
const resourceSchema = new Schema({
    resource: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    authorImage: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
},{
    timestamps: true
})
const studyroomSchema = new Schema({
    courseId: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    url: {
        type: String,
        require: true
    },
    duration: {
        type: Number,
        min: 30,
        max: 300,
        required: true
    },
    ownerName: {
        type: String,
        require: true
    },
    ownerEmail: {
        type: String,
        require: true
    },
    calendarEventId: {
        type: String,
        require: true
    },
    students: [studentSchema],
    resources: [ resourceSchema ]
},{
    timestamps: true
})

var StudyRooms = mongoose.model('StudyRoom', studyroomSchema);

module.exports = StudyRooms;

