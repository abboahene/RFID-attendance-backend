const mongoose = require('mongoose')

const attenderSchema = new mongoose.Schema({
    member_name: { type: String },
    member_club: { type: String },
    member_rfid:{ type: String },
    member_indexNo:{ type: String },
    club_name: {type: String},
    event_name: {type: String},
},
{ 
    timestamps:{ currentTime: () => Date.now() },
});

module.exports = mongoose.model('Attender',attenderSchema)