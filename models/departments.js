const { Schema, default:mongoose, model} = require('mongoose')

const DepartmentSchema = new Schema({
    name: {
        required : true,
        type : String
    },
    description: {
        required : true,
        type : String
    }
})

const Departments = mongoose.model('Departments', DepartmentSchema)
module.exports = Departments