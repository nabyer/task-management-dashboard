const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    status: Joi.string().valid('pending', 'in progress', 'completed').required(),
});

module.exports = taskSchema;