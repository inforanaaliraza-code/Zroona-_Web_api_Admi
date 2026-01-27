const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
	{
		organizer_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		event_date: {
			type: Date,
			required: true,
		},
		event_start_time: {
			type: String,
			required: true,
		},
		event_end_time: {
			type: String,
			required: true,
		},
		event_name: {
			type: String,
			required: true,
		},
		event_images: {
			type: [String],
			validate: {
				validator: function (v) {
					return v.length <= 5;
				},
				message: "Event cannot have more than 5 images",
			},
			required: true,
		},
		event_image: {
			type: String,
			required: true,
		},
		event_description: {
			type: String,
		},
		event_address: {
			type: String,
			required: true,
		},
		location: {
			type: {
				type: String,
				enum: ["Point"],
				default: "Point",
			},
			coordinates: {
				type: [Number],
				default: [0, 0],
			},
		},
		no_of_attendees: {
			type: Number,
			default: 1,
		},
		event_price: {
			type: Number,
			required: true,
		},
		dos_instruction: {
			type: String,
		},
		do_not_instruction: {
			type: String,
		},
		is_delete: {
			type: Number,
			enum: [0, 1],
			default: 0,
		},
		is_approved: {
			type: Number,
			enum: [
				0, 1, 2,
			] /* Allowed values are : 0 - pending, 1 - approved, 2 - rejected */,
			default: 0,
		},
		event_type: {
			type: Number,
			enum: [1, 2],
			default: 1,
		},
		event_category: {
			type: String,
			required: true,
		},
		// Support for multiple categories (array)
		event_categories: {
			type: [String],
			default: [],
		},
		// Support for multiple event types (array of strings: conference, workshop, etc.)
		event_types: {
			type: [String],
			default: [],
		},
		event_for: {
			type: Number,
			enum: [1, 2, 3],
			required: true,
		},
		isActive: {
			type: Number,
			enum: [1, 2],
			default: 1,
		},
		area_name: {
			type: String,
		},
		neighborhood: {
			type: String,
		},
	},
	{ timestamps: true }
);

// Pre-save middleware to set the first image as the main event_image
eventSchema.pre("save", function (next) {
	if (this.event_images && this.event_images.length > 0) {
		this.event_image = this.event_images[0];
	}
	next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
