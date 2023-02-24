const { Schema, default:mongoose} = require('mongoose')

const BedallotmentSchema = new Schema({
    name: String,
    patientid: String,
    patientstatus: String,
    bedtype: String,
    bednumber: String,
    allotmentdate: String,
    dischargedate: String,
    staffname: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
})

const Bedallotments = mongoose.model('Bedallotments', BedallotmentSchema)
module.exports = Bedallotments