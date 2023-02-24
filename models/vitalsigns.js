const { Schema, default:mongoose} = require('mongoose')

const VitalSignsSchema = new Schema({
    name: String,
    patientid: String,
    bloodpressure: String,
    temperature: String,
    pulse: String,
    spo: String,
    weight: String,
    Respirationrate: String,
    height: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
})

const VitalSigns = mongoose.model('VitalSigns', VitalSignsSchema)
module.exports = VitalSigns