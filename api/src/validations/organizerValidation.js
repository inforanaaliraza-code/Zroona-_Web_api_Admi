const Joi = require('joi');

const organizerRegistrationValidation = Joi.object({
    first_name: Joi.string(),
    // .pattern(/^[a-zA-Z\s]+$/).min(3).max(30).required().messages({
    //     'string.pattern.base': 'first_name must only contain alphabetic characters and spaces'
    // }),
    last_name: Joi.string(),
    // .pattern(/^[a-zA-Z\s]+$/).min(3).max(30).required().messages({
    //     'string.pattern.base': 'last_name must only contain alphabetic characters and spaces'
    // }),
    address: Joi.string().optional(),
    country_code: Joi.string().optional(),
    phone_number: Joi.number().integer().required().min(1000000000).max(9999999999).label('phone_number').messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be at least 10 digits',
        'number.max': '{{#label}} must be at most 10 digits',
    }),
    gender: Joi.number().valid(1, 2).optional(),
    email: Joi.string().email().optional(),
    date_of_birth: Joi.date().optional(),
    bio: Joi.string().optional(),
    govt_id: Joi.string().optional(),
    group_location: Joi.string().optional(),
    group_category: Joi.array().items(Joi.string().hex().length(24)).optional(),
    group_name: Joi.string().optional(),
    profile_image: Joi.string().uri().optional().allow(''),
    role: Joi.string().valid('2').default('2'),
    otp: Joi.number().integer().default(123456),
    registrationStep: Joi.number().valid(1, 2, 3, 4).default(1),
});

// const payment



const paymentSchema = Joi.object({
    book_id: Joi.string().required(),

    payment_id: Joi.string().required(),

    payment_status: Joi.number()
        .valid(0, 1, 2)
        .required()
        .messages({
            'number.base': 'payment_status must be a number.',
            'number.integer': 'payment_status must be an integer.',
            'any.only': 'payment_status must be one of the following values: 0 (pending), 1 (success), or 2 (failure).'
        })
});


module.exports = { organizerRegistrationValidation, paymentSchema };