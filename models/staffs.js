const { Schema, default:mongoose} = require('mongoose')

const StaffSchema = new Schema({
    name: String,
    email: String,
    role: String,
    department: String,
    address: String,
    phone: String,
    password: String
})

async function getStaff(id){
    return await Staffs.findOne({_id:id})
}

const Staffs = mongoose.model('Staffs', StaffSchema)
module.exports = {Staffs, getStaff}