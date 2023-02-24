const { Schema, default:mongoose} = require('mongoose')

const DischargebloodSchema = new Schema({
    name: String,
    patientid: String,
    bloodgroup: String,
    bags: Number,
    charges: String,
    date: String,
    staffname: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
})

const Dischargeblood = mongoose.model('Dischargeblood', DischargebloodSchema)
module.exports = Dischargeblood