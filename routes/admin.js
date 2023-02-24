var express = require('express');
var router = express.Router();
const {Staffs, getStaff} = require('../models/staffs')
const Departments = require('../models/departments')
const CrudService = require('../services/CrudService')
const auth = require('../middlewares/auth')
const {departmentValidator,staffValidator,profileValidator,UpdatePasswordValidator} = require('../validators/validators')

const departmentController = new CrudService(Departments, departmentValidator)
const staffController = new CrudService(Staffs,staffValidator)
const profileController = new CrudService(Staffs,profileValidator)

// USER-DETAILS : USER-DETAILS : USER-DETAILS : USER-DETAILS
router.get('/me',auth, async function(req,res,next){
    try {
        const currentUser = await getStaff(req.staff.id)
        console.log(currentUser)
        res.json(currentUser)
    } catch (error) {
        return res.status(401).send(error.message)
    }
})

// DEPARTMENT : DEPARTMENT : DEPARTMENT : DEPARTMENT : DEPARTMENT
// CREATE_DEPARTMENT
router.post('/department', async function(req, res, next) {
    try {
        const{ name,description } = req.body
        await departmentController.create({name,description})
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_DEPARTMENT
router.get('/department', async function(req, res, next) {
    try {
        const {edit,q} = req.query
        const departments = await departmentController.read(edit,q)
        res.json(departments)
    } catch (error) {
         res.status(401)
    }
});
// UPDATE_DEPARTMENT
router.put('/department/:id', async function(req, res, next) {
    try {
        const{ name,description } = req.body
        const id = req.params.id
        await departmentController.update(id,{name,description})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_DEPARTMENT
router.delete('/department/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await departmentController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// STAFF : STAFF : STAFF : STAFF : STAFF
// CREATE_STAFF
router.post('/staff', async function(req, res, next) {
    try {
        const{ name,email,role,department,address,phone,password } = req.body
        let usedEmail = await Staffs.findOne({email : email})
        if(usedEmail){
            return res.status(404).send('Email already exists')
        }else{
            await staffController.create({name,email,role,department,address,phone,password})
            return res.status(200).send('Added Successfully')
        }
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_STAFF
router.get('/staff', async function(req, res, next) {
    try {
        const {edit,q,role} = req.query
        const staffs = await staffController.staffRead(edit,q,role)
        res.json(staffs)
    } catch (error) {
         res.status(401)
    }
});
// UPDATE_STAFF
router.put('/staff/:id', async function(req, res, next) {
    try {
        const{ name,email,role,department,address,phone,password } = req.body
        const id = req.params.id
        await staffController.update(id,{name,email,role,department,address,phone,password})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_STAFF
router.delete('/staff/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await staffController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// UPDATE_PROFILE
router.put('/profile/:id', async function(req, res, next) {
    try {
        const{ name,email,address,phone } = req.body
        const id = req.params.id
        profileValidator.validate({name,email,address,phone})
        await profileController.update(id,{name,email,address,phone})
        return res.status(200).send('Profile updated successfully')
    } catch (error) {
        return res.send(error)
    }
});
// UPDATE_PROFILE#PASSWORD
router.put('/updatepassword/:id', async function(req, res, next) {
    try {
        const{ oldpassword, newpassword, confirmpassword  } = req.body
        const id = req.params.id
        UpdatePasswordValidator.validate({oldpassword, newpassword, confirmpassword})
        const currentStaff = await Staffs.findOne({_id : id})
        if(oldpassword === currentStaff.password){
            if(newpassword === confirmpassword){
                await Staffs.findByIdAndUpdate(id,{password: newpassword})
            }else{
                return res.status(401).send('passwords do not match')
            }
        }else{
            return res.status(401).send('Incorrect Password')
        }
        return res.status(200).send('Password Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});

module.exports = router;
