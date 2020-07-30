require("dotenv").config({
	path: require("path").join(__dirname, ".env.truffle.local"),
});

var HDWalletProvider = require("truffle-hdwallet-provider");

function getProvider(networkUrl) {
	return new HDWalletProvider(process.env.NMEMONIC, networkUrl);
}

module.exports = {
	solc: {
		optimizer: {
			enabled: true,
			runs: 2000,
		},
	},
	mocha: {
		useColors: true,
		enableTimeouts: false,
	},
	networks: {
		development: {
			host: "localhost",
			port: 8545,
			network_id: "*",
			from: "0xd77c534aed04d7ce34cd425073a033db4fbe6a9d",
		},
		production: {
			provider: () => getProvider(process.env.MAINNET_URL),
			network_id: "1",
			from: process.env.ADDRESS_DEPLOY,
		},
		ropsten: {
			provider: () => getProvider(process.env.ROPSTEN_URL),
			network_id: "3",
			from: process.env.ADDRESS_DEPLOY,
		},
		rinkeby: {
			provider: () => getProvider(process.env.RINKEBY_URL),
			network_id: "4",
			from: process.env.ADDRESS_DEPLOY,
		},
		kovan: {
			provider: () => getProvider(process.env.KOVAN_URL),
			network_id: "42",
			from: process.env.ADDRESS_DEPLOY,
		},
	},
};
