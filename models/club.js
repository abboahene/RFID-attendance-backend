const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name: { type: String, unique: true},
    
},
{ 
    timestamps:{ currentTime: ()=> Date.now() },
});

module.exports = mongoose.model('Club', clubSchema)