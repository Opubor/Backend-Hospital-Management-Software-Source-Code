var express = require('express');
var router = express.Router();
const mongoose = require ('mongoose')
const {Staffs, getStaff} = require('./models/staffs')
var connectDB = require('./config/db')

connectDB()

module.exports = async function createAdmin(name,email,role,department,address,phone,password){
    try {
        await Staffs.create({name,email,role,department,address,phone,password})
        return console.log("Admin Created")
    } catch (error) {
        console.log(error)
    }
}




