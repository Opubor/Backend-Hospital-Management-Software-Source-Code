const { Schema, default:mongoose} = require('mongoose')

const ReportSchema = new Schema({
    name: String,
    type: String,
    staffname: String,
    patientid: String,
    description: String,
    date: String,
    outcomestatus: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
})

const Reports = mongoose.model('Reports', ReportSchema)
module.exports = Reports