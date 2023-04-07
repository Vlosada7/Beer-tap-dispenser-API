const {
	descibre,
	expect,
	beforeAll,
	afterAll,
	describe,
} = require("@jest/globals");
const request = require("supertest");
const Dispenser = require("../models/dispenser");
const { default: mongoose } = require("mongoose");

const URL = "http://localhost:3000";

const testDispenser = {
	flow_volume: 0.07,
	liter_value: 17.0,
};

describe("Dispenser tests: ", () => {
	beforeAll(async () => {
		await mongoose.connect("mongodb://127.0.0.1:27017/beer");
	});

	afterAll(async () => {
		await Dispenser.findOneAndDelete({
			liter_value: testDispenser.liter_value,
		});
		await mongoose.disconnect();
	});

	describe("POST /create", () => {
		it("Should respond with a status code of 400 if has no all infos:", async () => {
			const res = await request(URL).post("/create").send({
				flow_volume: 0.05,
			});
			expect(res.status).toBe(400);
		});
		it("Should respond with a status code of 400 if has no all infos:", async () => {
			const res = await request(URL).post("/create").send({
				liter_value: 15.0,
			});
			expect(res.status).toBe(400);
		});
		it("Should respond with a status code of 201 if has all infos:", async () => {
			const res = await request(URL).post("/create").send(testDispenser);
			expect(res.status).toBe(201);
		});
		it("Should post the dispenser on the Database:", async () => {
			const res = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			expect(res).toMatchObject(testDispenser);
		});
	});

	describe("PUT /open", () => {
		it("Should open the dispenser: ", async () => {
			const dispenser = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			const dispenserId = dispenser.id;
			const res = await request(URL).put(`/${dispenserId}/open`);
			expect(res.status).toBe(202);
			expect(res.body.message).toEqual("Status of the tap changed correctly");
			expect(res.body.status).toEqual("open");
		});
		it("Should respond with 409 if the dispenser is already open: ", async () => {
			const dispenser = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			const dispenserId = dispenser.id;
			const res = await request(URL).put(`/${dispenserId}/open`);
			expect(res.status).toBe(409);
			expect(res.body.message).toEqual("Dispenser is already opened");
		});
	});

	describe("PUT /close", () => {
		it("Should close the dispenser:", async () => {
			const dispenser = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			const dispenserId = dispenser.id;
			const res = await request(URL).put(`/${dispenserId}/close`);
			expect(res.status).toBe(202);
			expect(res.body.message).toEqual("Status of the tap changed correctly");
			expect(res.body.status).toEqual("close");
		});
		it("Should respond with 409 if the dispenser is already close:", async () => {
			const dispenser = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			const dispenserId = dispenser.id;
			const res = await request(URL).put(`/${dispenserId}/close`);
			expect(res.status).toBe(409);
			expect(res.body.message).toEqual("Dispenser is already closed");
		});
		it("Should calculate the total used per usage and uptade the total spend of the dispenser: ", async () => {
			const dispenser = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			const lastUsage = dispenser.usages[dispenser.usages.length - 1];
			expect(lastUsage.total_spend).toEqual(
				parseFloat(
					(
						((lastUsage.closed_at - lastUsage.opened_at) / 1000) *
						dispenser.flow_volume *
						dispenser.liter_value
					).toFixed(2)
				)
			);
			expect(dispenser.total_usage_spend).toEqual(
				parseFloat(lastUsage.total_spend)
			);
		});
	});

	describe("GET /total", () => {
		it("Should return the amount and all the usages from the dispenser", async () => {
			const dispenser = await Dispenser.findOne({
				liter_value: testDispenser.liter_value,
			});
			const dispenserId = dispenser.id;
			const res = await request(URL).get(`/${dispenserId}/total`);
			expect(res.status).toBe(200);
			expect(res.body.amount).toEqual(parseFloat(dispenser.total_usage_spend));
			expect(res.body.usages.opened_at).toEqual(dispenser.usages.opened_at);
			expect(res.body.usages.closed_at).toEqual(dispenser.usages.closed_at);
			expect(res.body.usages.total_spend).toEqual(dispenser.usages.total_spend);
		});
	});
});
