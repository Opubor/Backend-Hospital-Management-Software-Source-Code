var express = require('express');
var router = express.Router();
const {Patients} = require('../models/Patients')
const Payments = require('../models/payments');
const CrudService = require('../services/CrudService')
const { PaymentsValidator } = require('../validators/validators')

const paymentsController = new CrudService(Payments, PaymentsValidator)

// PAYMENTS : PAYMENTS : PAYMENTS : PAYMENTS : PAYMENTS
// CREATE_PAYMENTS
router.post('/payments',async function(req, res, next) {
    try {
        const {date, amount, patientid, modeofpayment, purpose} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }   
        let payment =  await paymentsController.create({name, date, amount, patientid, modeofpayment, purpose})
        // =======================================================================================
        payment.patients = patient
        payment.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_PAYMENTS
router.get('/payments',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        let populate = 'patients'
        const payments = await paymentsController.read(edit,q,populate)
        res.json(payments)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_PAYMENTS
router.put('/payments/:id', async function(req, res, next) {
    try {
        const{ date, amount, patientid, modeofpayment, purpose } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        // ===================
        let payment = await paymentsController.update(id,{name,date, amount, patientid, modeofpayment, purpose})
        // ===================
        payment.patients = patient
        payment.save()
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_PAYMENTS
router.delete('/payments/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await paymentsController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});


module.exports = router;
