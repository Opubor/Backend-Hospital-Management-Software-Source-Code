const { Schema, default:mongoose} = require('mongoose')

const BedSchema = new Schema({
    type: String,
})

const Beds = mongoose.model('Beds', BedSchema)
module.exports = Beds