var express = require('express');
var router = express.Router();
const {Patients} = require('../models/Patients')
const Queue = require('../models/queue');
const CrudService = require('../services/CrudService')
const { QueueValidator } = require('../validators/validators')

const queueController = new CrudService(Queue, QueueValidator)

// QUEUE : QUEUE : QUEUE : QUEUE : QUEUE
// CREATE_QUEUE
router.post('/queue',async function(req, res, next) {
    try {
        const {name} = req.body
        QueueValidator.validate({name})
        queueController.create({name})  
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_QUEUE
router.get('/queue',async function(req, res, next) {
    try {
        const {edit,q} = req.query
        if(edit){
            let queue =  await Queue.findById(edit)
            res.json(queue)
        }
        if(q){
            var regex = new RegExp(q, "i")
            let queue =  await Queue.find({name:regex})
            res.json(queue)
        }else{
            let queue =  await Queue.find()
            res.json(queue)
        }
    } catch (error) {
         res.status(401)
    }
})
// UPDATE_QUEUE
router.put('/queue/:id', async function(req, res, next) {
    try {
        const{ name } = req.body
        const id = req.params.id
        QueueValidator.validate({name})
        await queueController.update(id,{name})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_QUEUE
router.delete('/queue/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await queueController.delete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

module.exports = router;
