var express = require('express');
var router = express.Router();
const {Staffs} = require('../models/staffs')
const jwt = require('jsonwebtoken')
const {loginValidator} = require('../validators/validators')
const createHttpError = require("http-errors");

/*  LOGIN */
router.post('/login',async function(req, res, next) {
  try {
    const { email,password } = req.body 
    const {error} =  loginValidator.validate({email,password})
    if (error) throw new createHttpError.BadRequest(error.details[0].message);
    // ============================================
    const user = await Staffs.findOne({email})
    if(!user || (user.password !== password)){
        res.status(401).send("Invalid Credentials")
    }else{
        const{_id, name,email,role,department,address,phone,password} = user
        jwt.sign({_id, name,email,role,department,address,phone,password}, process.env.JWT_SECRET, {
            expiresIn: '365d'
        }, function(err, token){
            if(err){
                res.sendStatus(403)
            }else{        
                res.json(token)
            } 
        })
    }

  } catch (error) {
    return res.status(401).send(error.message)
  }
});

module.exports = router;
