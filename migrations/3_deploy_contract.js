const ExampleContract = artifacts.require("ExampleContract");

module.exports = async function (deployer) {
  deployer.deploy(ExampleContract);
};
