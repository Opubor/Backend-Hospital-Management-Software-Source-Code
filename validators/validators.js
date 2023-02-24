const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


const loginValidator = Joi.object({
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Please provide an Email'}),
    password: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Password'})
});

const departmentValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Department Name is required'}),
    description: Joi.string().max(200).required().messages({'string.empty': 'Description is required'})
});

const staffValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Email is required'}),
    role: Joi.string().max(200).required(),
    department: Joi.string().min(0).max(200),
    address: Joi.string().max(200).required().messages({'string.empty': 'Address is required'}),
    phone: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
    password: Joi.string().min(5).max(30).required().messages({'string.empty': 'Password is required'})
});
const profileValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Email is required'}),
    address: Joi.string().max(200).required().messages({'string.empty': 'Address is required'}),
    phone: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
});
const patientValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    email: Joi.string().email().min(0).max(200).messages({'string.empty': 'Email is required'}),
    address: Joi.string().max(200).required().messages({'string.empty': 'Address is required'}),
    phone: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
    sex: Joi.string().max(200).required().messages({'string.empty': 'Gender is required'}),
    dob: Joi.string().max(200).required().messages({'string.empty': 'Date of birth is required'}),
    age: Joi.string().max(200).required().messages({'string.empty': 'Age is required'}),
    bloodgroup: Joi.string().min(0).max(200),
    tor: Joi.string().max(200).required().messages({'string.empty': 'Time of registration is required'}),
    registrationId: Joi.string().max(200).required().messages({'string.empty': 'Registration Id is required'}),
});
const PrescriptionValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    doctorid: Joi.string().max(200).required().messages({'string.empty': 'Doctor name is required'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'patient name is required'}),
    casehistory: Joi.string().min(0).max(1000).required().messages({'string.empty': 'Case History is required'}),
    description: Joi.string().max(1000).required().messages({'string.empty': 'Ailment/Description is required'}),
    medication: Joi.string().max(1000).required().messages({'string.empty': 'Medication is required'}),
    date: Joi.string().max(200).required().messages({'string.empty': 'Date is required'}),
    drugamount: Joi.string().max(200).min(0),
    paymentstatus: Joi.string().max(200).min(0),
    modeofpayment: Joi.string().max(200).min(0),
    paymentdate: Joi.string().max(200).min(0),
});
const AppointmentValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    doctorid: Joi.string().max(200).required().messages({'string.empty': 'Doctor name is required'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Patient name is required'}),
    date: Joi.string().max(200).required().messages({'string.empty': 'Date is required'}),
});
const BedallotmentValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Patient name is required'}),
    patientstatus: Joi.string().max(200).required().messages({'string.empty': 'Patient status is required'}),
    bedtype: Joi.string().max(200).required().messages({'string.empty': 'Bed type is required'}),
    bednumber: Joi.string().max(200).required().messages({'string.empty': 'Bed number is required'}),
    allotmentdate: Joi.string().max(200).required().messages({'string.empty': 'Allotment date is required'}),
    dischargedate: Joi.string().max(200).min(0),
    staffname: Joi.string().max(200).required().messages({'string.empty': 'Staff name is required'}),
});
const BlooddonorValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Email is required'}),
    address: Joi.string().max(200).required().messages({'string.empty': 'Address is required'}),
    phone: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
    gender: Joi.string().max(200).required().messages({'string.empty': 'Gender is required'}),
    age: Joi.string().max(200).required().messages({'string.empty': 'Age is required'}),
    bloodgroup: Joi.string().max(200).required().messages({'string.empty': 'Blood group is required'}),
    bags: Joi.number().max(200).required().messages({'string.empty': 'Number of bags is required'}),
    lastdonationdate: Joi.string().max(200).required().messages({'string.empty': 'Last donation date is required'}),
    staffname: Joi.string().max(200).required().messages({'string.empty': 'Staff name is required'}),
});
const DischargebloodValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Patient name is required'}),
    bloodgroup: Joi.string().max(200).required().messages({'string.empty': 'Blood group is required'}),
    bags: Joi.number().max(200).required().messages({'string.empty': 'Number of bags is required'}),
    charges: Joi.string().max(200).required().messages({'string.empty': 'Charges is required'}),
    date: Joi.string().max(200).required().messages({'string.empty': 'Date is required'}),
    staffname: Joi.string().max(200).required().messages({'string.empty': 'Staff name is required'}),
});
const ReportValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    type: Joi.string().max(200).required().messages({'string.empty': 'Report type is required'}),
    staffname: Joi.string().max(200).required().messages({'string.empty': 'Staff name is required'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Patient name is required'}),
    description: Joi.string().max(200).required().messages({'string.empty': 'Description is required'}),
    date: Joi.string().max(200).required().messages({'string.empty': 'Date is required'}),
    outcomestatus: Joi.string().min(0).max(200).optional(),
});
const BedValidator = Joi.object({
    type: Joi.string().max(200).required().messages({'string.empty': 'Bed type is required'}),
});
const VitalSignsValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Patient name is required'}),
    bloodpressure: Joi.string().min(0).max(200),
    temperature: Joi.string().min(0).max(200),
    pulse: Joi.string().min(0).max(200),
    spo: Joi.string().min(0).max(200),
    weight: Joi.string().min(0).max(200),
    Respirationrate: Joi.string().min(0).max(200),
    height: Joi.string().min(0).max(200),
});
const DrugAmountValidator = Joi.object({
    drugamount: Joi.string().max(200).min(0),
});
const PaymentStatusValidator = Joi.object({
    paymentstatus: Joi.string().max(200).min(0),
});
const UpdatePasswordValidator = Joi.object({
    oldpassword: Joi.string().max(200).required().messages({'string.empty': 'Old password is required'}),
    newpassword: Joi.string().max(200).required().messages({'string.empty': 'New password is required'}),
    confirmpassword: Joi.string().max(200).required().messages({'string.empty': 'Password re-enter your new password'}),
});
const PaymentsValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    date: Joi.string().max(200).required().messages({'string.empty': 'Date is required'}),
    amount: Joi.string().max(200).required().messages({'string.empty': 'Amount is required'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Patient name is required'}),
    modeofpayment: Joi.string().max(200).required().messages({'string.empty': 'Mode of payment is required'}),
    purpose: Joi.string().max(200).required().messages({'string.empty': 'Purpose of payment is required'}),
});
const QueueValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
});

module.exports={departmentValidator, staffValidator, profileValidator, patientValidator, PrescriptionValidator, AppointmentValidator, BedallotmentValidator,BlooddonorValidator, DischargebloodValidator, ReportValidator, BedValidator, VitalSignsValidator, DrugAmountValidator,PaymentStatusValidator, UpdatePasswordValidator, PaymentsValidator, QueueValidator, loginValidator}