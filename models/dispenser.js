const mongoose = require("./index");
const { Schema } = mongoose;
const uuid = require("uuid");

const dispenserSchema = new Schema(
	{
		id: {
			type: String,
			default: uuid.v4,
			unique: true,
			required: true,
		},
		flow_volume: {
			type: Number,
		},
		liter_value: {
			type: Number,
		},
		usages: {
			type: [
				{
					_id: false,
					opened_at: {
						type: Date,
						required: false,
					},
					closed_at: {
						type: Date,
						required: false,
					},
					total_spend: {
						type: Number,
					},
				},
			],
			default: [],
		},
		total_usage_spend: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Dispenser = mongoose.model("Dispenser", dispenserSchema);

module.exports = Dispenser;
