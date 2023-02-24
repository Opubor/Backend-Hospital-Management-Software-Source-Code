var express = require('express');
const { randomBytes } = require('crypto')
var router = express.Router();
const { Staffs } = require('../models/staffs');
const {Patients} = require('../models/Patients')
const Prescriptions = require('../models/prescriptions');
const Appointments = require('../models/appointments');
const Bedallotments = require('../models/bedallotment');
const Blooddonor = require('../models/blooddonor');
const Dischargeblood = require('../models/dischargeblood');
const Reports = require('../models/report');
const Beds = require('../models/bed');
const Payments = require('../models/payments');
const CrudService = require('../services/CrudService')
const {patientValidator,PrescriptionValidator, AppointmentValidator, BedallotmentValidator, BlooddonorValidator, DischargebloodValidator, ReportValidator, BedValidator, DrugAmountValidator, PaymentStatusValidator, PaymentsValidator} = require('../validators/validators')

const PatientController = new CrudService(Patients, patientValidator)
const PrescriptionController = new CrudService(Prescriptions, PrescriptionValidator)
const AppointmentController = new CrudService(Appointments, AppointmentValidator)
const BedallotmentController = new CrudService(Bedallotments, BedallotmentValidator)
const BlooddonorController = new CrudService(Blooddonor, BlooddonorValidator)
const DischargebloodController = new CrudService(Dischargeblood, DischargebloodValidator)
const ReportController = new CrudService(Reports, ReportValidator)
const BedController = new CrudService(Beds, BedValidator)
const paymentsController = new CrudService(Payments, PaymentsValidator)

// PATIENT : PATIENT : PATIENT : PATIENT : PATIENT
// CREATE_PATIENTS
router.post('/patient',async function(req, res, next) {
    try {
        const {name, email, address, phone, sex, dob, age, bloodgroup, tor} = req.body
        const date = new Date();
        const registrationId = date.getFullYear() + "-" + randomBytes(2).toString("hex")
        await PatientController.create({name, email, address, phone, sex, dob, age, bloodgroup, tor, registrationId})
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_PATIENT
router.get('/patient', async function(req, res, next) {
    try {
        const {edit,q} = req.query
        const patients = await PatientController.read(edit,q)
        res.json(patients)
    } catch (error) {
         res.status(401)
    }
});
// UPDATE_PATIENT
router.put('/patient/:id', async function(req, res, next) {
    try {
        const{ name, email, address, phone, sex, dob, age, bloodgroup, tor, registrationId } = req.body
        const id = req.params.id
        await PatientController.update(id,{name, email, address, phone, sex, dob, age, bloodgroup, tor, registrationId })
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_PATIENT
router.delete('/patient/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await PatientController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// PRESCRIPTION : PRESCRIPTION : PRESCRIPTION : PRESCRIPTION : PRESCRIPTION
// CREATE_PRESCRIPTION
router.post('/prescription',async function(req, res, next) {
    try {
        const { doctorid, patientid,casehistory, description, medication, date, drugamount} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }   
        let prescription =  await PrescriptionController.create({name, doctorid, patientid, casehistory, description, medication, date, drugamount})
        // =======================================================================================
        let doctor = await Staffs.findOne({_id : doctorid})
            if(patient){
                patient.prescriptions.push(prescription)
                patient.save()
            }else{
                res.send('error')
            }            
        prescription.patients = patient
        prescription.doctor = doctor
        prescription.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_PRESCRIPTION
router.get('/prescription', async function(req, res, next) {
    try {
        const {edit,q} = req.query
        let populate = 'patients doctor'
        const prescriptions = await PrescriptionController.read(edit,q,populate)
        res.json(prescriptions)
    } catch (error) {
         res.status(401)
    }
});
// UPDATE_PRESCRIPTION
router.put('/prescription/:id', async function(req, res, next) {
    try {
        const{ doctorid, patientid, casehistory, description, medication, date, drugamount } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        let prescription = await PrescriptionController.update(id,{name,doctorid, patientid, casehistory, description, medication, date, drugamount})
        let doctor = await Staffs.findOne({_id : doctorid})
            if(patient){
                patient.prescriptions.push(prescription)
                patient.save()
            }else{
                res.send('error')
            }            
        prescription.patients = patient
        prescription.doctor = doctor
        prescription.save()
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_PRESCRIPTION
router.delete('/prescription/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await PrescriptionController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// UPDATE_PRESCRIPTION-#-DRUGAMOUNT
router.put('/pharmacist_amount/:id', async function(req, res, next) {
  try {
      const{  drugamount } = req.body
      const id = req.params.id
      DrugAmountValidator.validate({ drugamount})
      await Prescriptions.findByIdAndUpdate(id,{ drugamount})
      return res.status(200).send('Updated Successfully')
  } catch (error) {
      return res.send(error)
  }
});
// UPDATE_PRESCRIPTION-#-PAYMENTSTATUS
router.put('/accountant_payment/:id', async function(req, res, next) {
  try {
      const{  paymentstatus, modeofpayment, paymentdate } = req.body
      const id = req.params.id
      PaymentStatusValidator.validate({ paymentstatus, modeofpayment, paymentdate})
      let paymentUpdate = await Prescriptions.findByIdAndUpdate(id,{ paymentstatus, modeofpayment, paymentdate})
      let currentPayment = await Prescriptions.findOne({_id : id})

      if(currentPayment.paymentstatus === "Paid"){
        let payment = await paymentsController.create({name: currentPayment.name, date: currentPayment.paymentdate, amount: currentPayment.drugamount, patientid: currentPayment.patientid, modeofpayment: currentPayment.modeofpayment, purpose: "Medication/drugs"})
        payment.patients = currentPayment.patientid
        payment.save()
      }
      return res.status(200).send('Updated Successfully')
  } catch (error) {
      return res.send(error)
  }
});
// VIEWPAYMENTS
router.get('/viewpayments', async function(req, res, next) {
  try {
     const verifiedPayments = await Prescriptions.find({paymentstatus: "Paid"}).sort({_id : 'descending'}).populate('patients')
     res.json(verifiedPayments)
  } catch (error) {
      return res.send(error)
  }
});

// APPOINTMENTS : APPOINTMENTS : APPOINTMENTS : APPOINTMENTS : APPOINTMENTS
// CREATE_APPOINTMENTS
router.post('/appointment',async function(req, res, next) {
    try {
        const {doctorid,patientid,date} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }   
        let appointment =  await AppointmentController.create({name,doctorid,patientid,date})
        // =======================================================================================
        let doctor = await Staffs.findOne({_id : doctorid})           
        appointment.patients = patient
        appointment.doctor = doctor
        appointment.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_APPOINTMENTS
router.get('/appointment',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        let populate = 'patients doctor'
        const appointments = await AppointmentController.read(edit,q,populate)
        res.json(appointments)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_APPOINTMENT
router.put('/appointment/:id', async function(req, res, next) {
    try {
        const{ doctorid,patientid,date } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        // ========================
        let appointment = await AppointmentController.update(id,{name,doctorid,patientid,date})
        // ========================
        let doctor = await Staffs.findOne({_id : doctorid})          
        appointment.patients = patient
        appointment.doctor = doctor
        appointment.save()
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_APPOINTMENT
router.delete('/appointment/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await AppointmentController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// BEDALLOTMENT : BEDALLOTMENT : BEDALLOTMENT : BEDALLOTMENT : BEDALLOTMENT
// CREATE_BEDALLOTMENT
router.post('/bedallotment',async function(req, res, next) {
    try {
        const {patientid,patientstatus,bedtype,bednumber,allotmentdate,dischargedate,staffname} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }       
        let bedallotment =  await BedallotmentController.create({name,patientid,patientstatus,bedtype,bednumber,allotmentdate,dischargedate,staffname})
        // =======================================================================================
        bedallotment.patients = patient
        bedallotment.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_BEDALLOTMENT
router.get('/bedallotment',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        let populate = 'patients'
        const bedallotments = await BedallotmentController.read(edit,q,populate)
        res.json(bedallotments)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_BEDALLOTMENT
router.put('/bedallotment/:id', async function(req, res, next) {
    try {
        const{ patientid,patientstatus,bedtype,bednumber,allotmentdate,dischargedate,staffname } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        let bedallotment = await BedallotmentController.update(id,{name,patientid,patientstatus,bedtype,bednumber,allotmentdate,dischargedate,staffname})
        // ========================================================
        bedallotment.patients = patient
        bedallotment.save()
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_BEDALLOTMENT
router.delete('/bedallotment/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await BedallotmentController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// BLOODDONOR : BLOODDONOR : BLOODDONOR : BLOODDONOR : BLOODDONOR
// CREATE_BLOODDONOR
router.post('/blooddonor',async function(req, res, next) {
    try {
        const {name,email,address,phone,gender,age,bloodgroup,bags,lastdonationdate,staffname} = req.body
        await BlooddonorController.create({name,email,address,phone,gender,age,bloodgroup,bags,lastdonationdate,staffname})
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_BLOODDONOR
router.get('/blooddonor',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        const blooddonors = await BlooddonorController.read(edit,q)
        res.json(blooddonors)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_BLOODDONOR
router.put('/blooddonor/:id', async function(req, res, next) {
    try {
        const{ name,email,address,phone,gender,age,bloodgroup,bags,lastdonationdate,staffname } = req.body
        const id = req.params.id
        await BlooddonorController.update(id,{name,email,address,phone,gender,age,bloodgroup,bags,lastdonationdate,staffname})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_BLOODDONOR
router.delete('/blooddonor/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await BlooddonorController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// DISCHARGEBLOOD : DISCHARGEBLOOD : DISCHARGEBLOOD : DISCHARGEBLOOD : DISCHARGEBLOOD
// CREATE_DISCHARGEBLOOD
router.post('/dischargeblood',async function(req, res, next) {
    try {
        const {patientid,bloodgroup,bags,charges,date,staffname} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }   
        let dischargeblood =  await DischargebloodController.create({name,patientid,bloodgroup,bags,charges,date,staffname})
        // =======================================================================================
        dischargeblood.patients = patient
        dischargeblood.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_DISCHARGEBLOOD
router.get('/dischargeblood',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        let populate = 'patients'
        const dischargeblood = await DischargebloodController.read(edit,q,populate)
        res.json(dischargeblood)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_DISCHARGEBLOOD
router.put('/dischargeblood/:id', async function(req, res, next) {
    try {
        const{ patientid,bloodgroup,bags,charges,date,staffname } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        let dischargeblood = await DischargebloodController.update(id,{name,patientid,bloodgroup,bags,charges,date,staffname})
        // ========================================================
        dischargeblood.patients = patient
        dischargeblood.save()
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_DISCHARGEBLOOD
router.delete('/dischargeblood/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await DischargebloodController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// REPORT : REPORT : REPORT : REPORT : REPORT
// CREATE_REPORT
router.post('/report',async function(req, res, next) {
    try {
        const {type,staffname,patientid,description,date} = req.body
        let name = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          name = patient.name
        }   
        let report =  await ReportController.create({name,type,staffname,patientid,description,date})
        // =======================================================================================
        report.patients = patient
        report.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_REPORT
router.get('/report',async function(req, res, next) {
    try {
        const {edit,q,type} = req.query
        let populate = 'patients'
        const reports = await ReportController.reportRead(edit,q,type,populate)
        res.json(reports)
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_REPORT
router.put('/report/:id', async function(req, res, next) {
    try {
        const{ type,staffname,patientid,description,date,outcomestatus } = req.body
        const id = req.params.id
        let patient = await Patients.findOne({_id : patientid})
        let name = patient.name
        let report = await ReportController.update(id,{name,type,staffname,patientid,description,date,outcomestatus})
        // ===================================
        report.patients = patient
        report.save()
        // ===================================
        console.log(report)
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_REPORT
router.delete('/report/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await ReportController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// BLOOD_BANK : BLOOD_BANK : BLOOD_BANK : BLOOD_BANK
router.get('/a_positive',async function(req, res, next) {
    // =======================================================================================
    // A POSITIVE : A POSITIVE: A POSITIVE : A POSITIVE s
      let aPositive = 'A+'
    // Get total amount of donated blood
      const aPositivedonor = await Blooddonor.find({bloodgroup:aPositive}, {bags:1,_id:0})
      let aPositivedonorsum = 0
      aPositivedonor.forEach(element => {
        aPositivedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const aPositivedispatch = await Dischargeblood.find({bloodgroup:aPositive}, {bags:1,_id:0})
      let aPositivedispatchsum = 0
      aPositivedispatch.forEach(element => {
        aPositivedispatchsum += element.bags
      });
    // Summing it all
      let aPositiveTotal = aPositivedonorsum-aPositivedispatchsum
      res.json(aPositiveTotal)   
});
router.get('/a_negative',async function(req, res, next) {
    // =======================================================================================
    // A NEGATIVE : A NEGATIVE : A NEGATIVE : A NEGATIVE
      let aNegative = 'A-'
    // Get total amount of donated blood
      const aNegativedonor = await Blooddonor.find({bloodgroup:aNegative}, {bags:1,_id:0})
      let aNegativedonorsum = 0
      aNegativedonor.forEach(element => {
        aNegativedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const aNegativedispatch = await Dischargeblood.find({bloodgroup:aNegative}, {bags:1,_id:0})
      let aNegativedispatchsum = 0
      aNegativedispatch.forEach(element => {
        aNegativedispatchsum += element.bags
      });
    // Summing it all
      let aNegativeTotal = aNegativedonorsum-aNegativedispatchsum
      res.json(aNegativeTotal)   
});
router.get('/b_positive',async function(req, res, next) {
    // =======================================================================================
    // B POSITIVE : B POSITIVE : B POSITIVE : B POSITIVE
      let bPositive = 'B+'
    // Get total amount of donated blood
      const bPositivedonor = await Blooddonor.find({bloodgroup:bPositive}, {bags:1,_id:0})
      let bPositivedonorsum = 0
      bPositivedonor.forEach(element => {
        bPositivedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const bPositivedispatch = await Dischargeblood.find({bloodgroup:bPositive}, {bags:1,_id:0})
      let bPositivedispatchsum = 0
      bPositivedispatch.forEach(element => {
        bPositivedispatchsum += element.bags
      });
    // Summing it all
      let bPositiveTotal = bPositivedonorsum-bPositivedispatchsum
      res.json(bPositiveTotal)   
});
router.get('/b_negative',async function(req, res, next) {
    // =======================================================================================
    // B NEGATIVE : B NEGATIVE : B NEGATIVE : B NEGATIVE
      let bNegative = 'B-'
    // Get total amount of donated blood
      const bNegativedonor = await Blooddonor.find({bloodgroup:bNegative}, {bags:1,_id:0})
      let bNegativedonorsum = 0
      bNegativedonor.forEach(element => {
        bNegativedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const bNegativedispatch = await Dischargeblood.find({bloodgroup:bNegative}, {bags:1,_id:0})
      let bNegativedispatchsum = 0
      bNegativedispatch.forEach(element => {
        bNegativedispatchsum += element.bags
      });
    // Summing it all
      let bNegativeTotal = bNegativedonorsum-bNegativedispatchsum
      res.json(bNegativeTotal)   
});
router.get('/o_positive',async function(req, res, next) {
    // =======================================================================================
    // O POSITIVE : O POSITIVE: O POSITIVE : O POSITIVE 
      let oPositive = 'O+'
    // Get total amount of donated blood
      const oPositivedonor = await Blooddonor.find({bloodgroup:oPositive}, {bags:1,_id:0})
      let oPositivedonorsum = 0
      oPositivedonor.forEach(element => {
        oPositivedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const oPositivedispatch = await Dischargeblood.find({bloodgroup:oPositive}, {bags:1,_id:0})
      let oPositivedispatchsum = 0
      oPositivedispatch.forEach(element => {
        oPositivedispatchsum += element.bags
      });
    // Summing it all
      let oPositiveTotal = oPositivedonorsum-oPositivedispatchsum
      res.json(oPositiveTotal)   
});
router.get('/o_negative',async function(req, res, next) {
    // =======================================================================================
    // O NEGATIVE : O NEGATIVE : O NEGATIVE : O NEGATIVE
      let oNegative = 'O-'
    // Get total amount of donated blood
      const oNegativedonor = await Blooddonor.find({bloodgroup:oNegative}, {bags:1,_id:0})
      let oNegativedonorsum = 0
      oNegativedonor.forEach(element => {
        oNegativedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const oNegativedispatch = await Dischargeblood.find({bloodgroup:oNegative}, {bags:1,_id:0})
      let oNegativedispatchsum = 0
      oNegativedispatch.forEach(element => {
        oNegativedispatchsum += element.bags
      });
    // Summing it all
      let oNegativeTotal = oNegativedonorsum-oNegativedispatchsum
      res.json(oNegativeTotal)   
});
router.get('/ab_positive',async function(req, res, next) {
    // =======================================================================================
    // AB POSITIVE : AB POSITIVE: AB POSITIVE : AB POSITIVE 
      let abPositive = 'AB+'
    // Get total amount of donated blood
      const abPositivedonor = await Blooddonor.find({bloodgroup:abPositive}, {bags:1,_id:0})
      let abPositivedonorsum = 0
      abPositivedonor.forEach(element => {
        abPositivedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const abPositivedispatch = await Dischargeblood.find({bloodgroup:abPositive}, {bags:1,_id:0})
      let abPositivedispatchsum = 0
      abPositivedispatch.forEach(element => {
        abPositivedispatchsum += element.bags
      });
    // Summing it all
      let abPositiveTotal = abPositivedonorsum-abPositivedispatchsum
      res.json(abPositiveTotal)   
});
router.get('/ab_negative',async function(req, res, next) {
    // =======================================================================================
    // AB NEGATIVE : AB NEGATIVE : AB NEGATIVE : AB NEGATIVE
      let abNegative = 'AB-'
    // Get total amount of donated blood
      const abNegativedonor = await Blooddonor.find({bloodgroup:abNegative}, {bags:1,_id:0})
      let abNegativedonorsum = 0
      abNegativedonor.forEach(element => {
        abNegativedonorsum += element.bags
      });
    // Get total amount of dispatch blood
      const abNegativedispatch = await Dischargeblood.find({bloodgroup:abNegative}, {bags:1,_id:0})
      let abNegativedispatchsum = 0
      abNegativedispatch.forEach(element => {
        abNegativedispatchsum += element.bags
      });
    // Summing it all
      let abNegativeTotal = abNegativedonorsum-abNegativedispatchsum
      res.json(abNegativeTotal)   
});

// BEDS : BEDS : BEDS : BEDS : BEDS
// CREATE_BEDS
router.post('/bed',async function(req, res, next) {
  try {
      const {type} = req.body
      await BedController.create({type})
      return res.status(200).send('Added Successfully')
  } catch (error) {
      return res.status(401).send(error.message)
  }
});
// READ_BEDS
router.get('/bed',async function(req, res, next) {
  try {
      const {edit,q} = req.query
      const beds = await BedController.read(edit,q)
      res.json(beds)
  } catch (error) {
       res.status(401)
  }
})
// UPDATE_BED
router.put('/bed/:id', async function(req, res, next) {
  try {
      const{ type } = req.body
      const id = req.params.id
      await BedController.update(id,{type})
      return res.status(200).send('Updated Successfully')
  } catch (error) {
      return res.send(error)
  }
});
// DELETE_BED
router.delete('/bed/:id', async function(req, res, next) {
  try {
      const id = req.params.id
      await BedController.delete(id)
      return res.status(200).send('Deleted Successfully')
  } catch (error) {
      return res.send(error)
  }
});

module.exports = router;
