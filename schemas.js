//error handling 
const Joi = require('joi');


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
        //images: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});
