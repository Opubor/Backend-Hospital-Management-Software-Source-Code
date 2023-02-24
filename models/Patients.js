const { Schema, default:mongoose} = require('mongoose')

const PatientSchema = new Schema({
    name: String,
    email: String,
    address: String,
    phone: String,
    sex: String,
    dob: String,
    age: String,
    bloodgroup: String,
    tor: String,
    registrationId: String,
    prescriptions: [{type: Schema.Types.ObjectId, ref: 'Prescriptions'}]
})

const Patients = mongoose.model('Patients', PatientSchema)
module.exports = {Patients, PatientSchema}