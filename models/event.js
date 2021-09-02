const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: { type: String },
    club_name: { type: String },
    room: { type: String },
    is_ended: { type: Boolean, default: false }
}, 
{ 
    timestamps:{ currentTime: ()=> Date.now() },
});

module.exports = mongoose.model('Event',eventSchema)    