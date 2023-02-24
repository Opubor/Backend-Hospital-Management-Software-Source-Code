const { Schema, default:mongoose} = require('mongoose')

const PaymentsSchema = new Schema({
    name: String,
    date: String,
    amount: String,
    patientid: String,
    modeofpayment: String,
    purpose: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
})

const Payments = mongoose.model('Payments', PaymentsSchema)
module.exports = Payments