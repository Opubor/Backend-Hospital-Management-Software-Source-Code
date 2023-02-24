const { Schema, default:mongoose} = require('mongoose')

const BlooddonorSchema = new Schema({
    name: String,
    email: String,
    address: String,
    phone: String,
    gender: String,
    age: String,
    bloodgroup: String,
    bags: Number,
    lastdonationdate: String,
    staffname: String,
})

const Blooddonors = mongoose.model('Blooddonors', BlooddonorSchema)
module.exports = Blooddonors