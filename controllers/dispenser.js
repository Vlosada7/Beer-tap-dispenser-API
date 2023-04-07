const Dispenser = require("../models/dispenser");

const createDispenser = async (req, res) => {
	//Creates a new dispenser with the properties passed by the body

	const { flow_volume, liter_value } = req.body;
	if (flow_volume && liter_value) {
		try {
			const dispenser = await Dispenser.create({ flow_volume, liter_value });
			return res.status(201).json({
				message: "Dispenser created correctly",
				id: dispenser.id,
				flow_volume,
				liter_value,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Unexpected API error" });
		}
	} else {
		res
			.status(400)
			.json({
				message:
					"Parameter missing to create a new dispenser, you have to pass the flow volume and the liter value.",
			});
	}
};

const openDispenser = async (req, res) => {
	const dispenserId = req.params.id;
	try {
		//Finds the dispenser with the id passed by the parameters
		const dispenser = await Dispenser.findOne({ id: dispenserId });
		const lastUsage = dispenser.usages[dispenser.usages.length - 1];

		// Check if the last usage is open
		if (lastUsage && !lastUsage.closed_at) {
			return res.status(409).send({ message: "Dispenser is already opened" });
		}

		// Create a new usage and save it in the database
		dispenser.usages.push({ opened_at: Date.now() });
		await dispenser.save();

		return res.status(202).send({
			message: "Status of the tap changed correctly",
			status: "open",
			updatedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Unexpected API error" });
	}
};

const closeDispenser = async (req, res) => {
	const dispenserId = req.params.id;
	try {
    //Finds the dispenser with the id passed by the parameters
		const dispenser = await Dispenser.findOne({ id: dispenserId });
		const lastUsage = dispenser.usages[dispenser.usages.length - 1];

		// Check if the last usage is closed
		if (!lastUsage || lastUsage.closed_at) {
			return res.status(409).send({ message: "Dispenser is already closed" });
		}

		// Close the last usage, calculate the total and save it in the database
		lastUsage.closed_at = Date.now();
		lastUsage.total_spend = (
			((lastUsage.closed_at - lastUsage.opened_at) / 1000) *
			dispenser.flow_volume *
			dispenser.liter_value
		).toFixed(2);
		dispenser.total_usage_spend = (
			dispenser.total_usage_spend + lastUsage.total_spend
		).toFixed(3);
		await dispenser.save();

		return res.status(202).send({
			message: "Status of the tap changed correctly",
			status: "close",
			updatedAt: lastUsage.closed_at,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Unexpected API error" });
	}
};

const getTotal = async (req, res) => {
	const dispenserId = req.params.id;
	try {
    //Finds the dispenser with the id passed by the parameters
		const dispenser = await Dispenser.findOne({ id: dispenserId });
		if (!dispenser) {
			res.status(404).send({ message: "Requested dispenser does not exist" });
		} else {
			res.status(200).send({
				amount: dispenser.total_usage_spend,
				usages: dispenser.usages,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Unexpected API error" });
	}
};

module.exports = { createDispenser, openDispenser, closeDispenser, getTotal };
