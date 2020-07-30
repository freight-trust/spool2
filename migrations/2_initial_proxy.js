const UserStorage = artifacts.require("UserStorage");
const App = artifacts.require("App");

module.exports = async function (deployer) {
  deployer.deploy(UserStorage).then(function () {
    return deployer.deploy(App, UserStorage.address);
  });
};
