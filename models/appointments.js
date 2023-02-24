const { Schema, default:mongoose} = require('mongoose')

const AppointmentSchema = new Schema({
    name: String,
    doctorid: String,
    patientid: String,
    date: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
    doctor: [{type: Schema.Types.ObjectId, ref: 'Staffs'}]
})

const Appointments = mongoose.model('Appointments', AppointmentSchema)
module.exports = Appointments