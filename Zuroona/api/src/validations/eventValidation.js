const Joi = require("joi");
const _mongoose = require("mongoose");

const groupCategoryValidation = Joi.object({
	name: Joi.string().required(),
	selected_image: Joi.string().optional(),
	unselected_image: Joi.string().optional(),
});

const eventValidation = Joi.object({
	event_date: Joi.date().required(),

	event_start_time: Joi.string().required(),
	event_end_time: Joi.string().required(),
	event_name: Joi.string().required(),

	event_images: Joi.array()
		.items(Joi.string())
		.min(1)
		.max(5)
		.required()
		.messages({
			"array.min": "At least one image is required",
			"array.max": "Maximum 5 images are allowed",
		}),

	event_description: Joi.string().optional(),

	event_address: Joi.string().required(),

	latitude: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
	longitude: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),

	no_of_attendees: Joi.number().min(1).default(1),

	event_price: Joi.number()
		.min(1)
		.required()
		.messages({
			"number.min": "Event price must be at least 1 SAR",
			"any.required": "Event price is required",
		}),

	dos_instruction: Joi.string().optional(),

	do_not_instruction: Joi.string().optional(),

	event_type: Joi.number().valid(1, 2).required(),

	event_category: Joi.any().custom((value, helpers) => {
		// Accept string or array of strings
		if (typeof value === 'string') {
			if (!value || value.trim() === '') {
				return helpers.error('any.required');
			}
			return value;
		}
		if (Array.isArray(value)) {
			if (value.length === 0) {
				return helpers.error('array.min');
			}
			// Validate all items are strings
			for (const item of value) {
				if (typeof item !== 'string' || !item || item.trim() === '') {
					return helpers.error('any.invalid');
				}
			}
			return value;
		}
		return helpers.error('any.invalid');
	}).required().messages({
		"any.required": "Event category is required",
		"array.min": "At least one category is required",
		"any.invalid": "Event category must be a string or an array of strings",
	}),

	event_for: Joi.number().valid(1, 2, 3).required(),

	// Event types (optional - for frontend filtering/display)
	event_types: Joi.array()
		.items(Joi.string())
		.optional()
		.allow(null),
});

module.exports = { groupCategoryValidation, eventValidation };
