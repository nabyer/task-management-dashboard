const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    status: Joi.string().valid('pending', 'in progress', 'completed').required(),
});

const partialTaskSchema = Joi.object({
    title: Joi.string().min(3).max(30),
    status: Joi.string().valid('pending', 'in progress', 'completed'),
});

module.exports = { taskSchema, partialTaskSchema };