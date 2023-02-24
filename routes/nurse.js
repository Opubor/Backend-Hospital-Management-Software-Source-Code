var express = require('express');
var router = express.Router();
const {Patients} = require('../models/Patients')
const VitalSigns = require('../models/vitalsigns');
const CrudService = require('../services/CrudService')
const { VitalSignsValidator } = require('../validators/validators')

const vitalSignsController = new CrudService(VitalSigns, VitalSignsValidator)

// VITAL-SIGNS : VITAL-SIGNS : VITAL-SIGNS : VITAL-SIGNS : VITAL-SIGNS
// CREATE_VITAL-SIGNS
router.post('/vital_signs',async function(req, res, next) {
    try {
        const {patientid, bloodpressure, temperature, pulse, spo, weight, Respirationrate, height} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }   
        VitalSignsValidator.validate({name,patientid, bloodpressure, temperature, pulse, spo, weight, Respirationrate, height})
        let vitalSigns =  await vitalSignsController.create({name,patientid, bloodpressure, temperature, pulse, spo, weight, Respirationrate, height})
        // =======================================================================================
        vitalSigns.patients = patient
        vitalSigns.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_VITAL-SIGNS
router.get('/vital_signs',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        let populate = 'patients'
        const vitalSigns = await vitalSignsController.read(edit,q,populate)
        res.json(vitalSigns)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_VITAL-SIGNS
router.put('/vital_signs/:id', async function(req, res, next) {
    try {
        const{ patientid, bloodpressure, temperature, pulse, spo, weight, Respirationrate, height } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        VitalSignsValidator.validate({name,patientid, bloodpressure, temperature, pulse, spo, weight, Respirationrate, height})
        let vitalSigns = await vitalSignsController.update(id,{name,patientid, bloodpressure, temperature, pulse, spo, weight, Respirationrate, height})
        vitalSigns.patients = patient
        vitalSigns.save()
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_VITAL-SIGNS
router.delete('/vital_signs/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await vitalSignsController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

module.exports = router;
