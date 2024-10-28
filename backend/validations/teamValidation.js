const Joi = require('joi');

const teamSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    members: Joi.array().items(Joi.number().integer().min(1)).required(),
});

const partialTeamSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    members: Joi.array().items(Joi.number().integer().min(1)),
});

module.exports = { teamSchema, partialTeamSchema };