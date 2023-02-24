const { Schema, default:mongoose} = require('mongoose')

const QueueSchema = new Schema({
    name: String,
})

const Queues = mongoose.model('Queues', QueueSchema)
module.exports = Queues