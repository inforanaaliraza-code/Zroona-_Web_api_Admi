const Joi = require('joi');

const userRegistrationValidation = Joi.object({
    profile_image: Joi.string().optional().allow(""),
    // first_name: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(3).max(30).required().messages({
    //     'string.pattern.base': 'first_name must only contain alphabetic characters and spaces'
    // }),
    // last_name: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(3).max(30).required().messages({
    //     'string.pattern.base': 'last_name must only contain alphabetic characters and spaces'
    // }),
    first_name: Joi.string(),
    last_name: Joi.string(),
    address: Joi.string().optional(),
    country_code: Joi.string().optional(),
    phone_number: Joi.number().integer().required().min(1000000000).max(9999999999).label('phone_number').messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be at least 10 digits',
        'number.max': '{{#label}} must be at most 10 digits',
    }),
    email: Joi.string().email().required(),
    gender: Joi.number().integer().valid(1, 2),
    date_of_birth: Joi.date().iso(),
    description: Joi.string().allow('').optional(),
    registration_step: Joi.number().integer().valid(1, 2).default(1),
    role: Joi.string().valid(1, 2),
    otp: Joi.string().default('123456')
});


const loginValidation = Joi.object({
    country_code: Joi.string().required(),
    phone_number: Joi.number().integer().required().min(1000000000).max(9999999999).label('phone_number').messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be at least 10 digits',
        'number.max': '{{#label}} must be at most 10 digits',
    })
})

const otpValidation = Joi.object({
    otp: Joi.number().required(),
})

const validateSendOtp = Joi.object({
    phone_number: Joi.number().integer().required().min(1000000000).max(9999999999).messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be at least 10 digits',
        'number.max': '{{#label}} must be at most 10 digits',
    }),
    country_code: Joi.string().required().messages({
        'string.base': '{{#label}} must be a string',
        'any.required': '{{#label}} is required when Phone Number is provided',
    }),
})


module.exports = { userRegistrationValidation, loginValidation, otpValidation, validateSendOtp }