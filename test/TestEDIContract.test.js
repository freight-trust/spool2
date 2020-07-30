const TestEDIContract = artifacts.require("TestEDIContract");
const AppContract = artifacts.require("App");

contract("TestEDIContract", (accounts) => {
	var app, example;

	beforeEach(async () => {
		app = await AppContract.deployed();
		example = await TestEDIContract.deployed();
	});

	it("register operator", async () => {
		await app.upgradeTo(example.address);
		app = await TestEDIContract.at(app.address);
		const tx = await app.register("pool operator");
		assert.ok(tx);
	});
});
