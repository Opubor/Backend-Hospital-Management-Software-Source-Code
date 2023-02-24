const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const createHttpError = require("http-errors");

class CrudService{
    constructor(model, validator){
        this.model = model
        this.validator = validator
    }

    async create(data){
        const {error} =  this.validator.validate(data)
        if (error) throw new createHttpError.BadRequest(error.details[0].message);
        return await this.model.create(data)
    }

    async read(edit,q,populate){
        if(edit){
            return await this.model.findById(edit).populate(populate)
        }
        if(q){
            var regex = new RegExp(q, "i")
            return await this.model.find({name:regex}).sort({_id : 'descending'}).populate(populate)
        }else{
            return await this.model.find().sort({_id : 'descending'}).populate(populate)
        }
    }

    // To read only staffs
    async staffRead(edit,q,role){
        if(edit){
            return await this.model.findById(edit)
        }
        if(q){
            var regex = new RegExp(q, "i")
            return await this.model.find({role:role,name:regex}).sort({_id : 'descending'})
        }else{
            return await this.model.find({role:role}).sort({_id : 'descending'})
        }
    }

    // To read only reports(Birth, Death, Operation)
    async reportRead(edit,q,type,populate){
        if(edit){
            return await this.model.findById(edit).populate(populate)
        }
        if(q){
            var regex = new RegExp(q, "i")
            return await this.model.find({type:type,name:regex}).sort({_id : 'descending'}).populate(populate)
        }else{
            return await this.model.find({type:type}).sort({_id : 'descending'}).populate(populate)
        }
    }

    async update(id, data){
        const {error} =  this.validator.validate(data)
        if (error) throw new createHttpError.BadRequest(error.details[0].message);
        return await this.model.findByIdAndUpdate(id,data)
    }

    async delete(id){
        return await this.model.findByIdAndRemove(id)
    }

}

module.exports = CrudService