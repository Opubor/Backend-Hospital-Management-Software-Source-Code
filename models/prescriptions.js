const { Schema, default:mongoose} = require('mongoose')
const {PatientSchema} = require('./Patients')

const PrescriptionSchema = new Schema({
    name: String,
    doctorid: String,
    patientid: String,
    casehistory: String,
    description: String,
    medication: String,
    date: String,
    drugamount: String,
    paymentstatus: String,
    modeofpayment: String,
    paymentdate: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
    doctor: [{type: Schema.Types.ObjectId, ref: 'Staffs'}]
})

const Prescriptions = mongoose.model('Prescriptions', PrescriptionSchema)
module.exports = Prescriptions