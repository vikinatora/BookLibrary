const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');
const LibraryToken = require('../build/LibraryToken.json');
const LIBWrapper = require("../build/LIBWrapper.json");


const deploy = async (network, secret, etherscanApiKey) => {

  const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, "40c2813049e44ec79cb4d7e0d18de173");
	// const result1 = await deployer.deploy(LibraryToken);
	// const result2 = await deployer.deploy(LIBWrapper, null, result1.contractAddress);
	const result = await deployer.deploy(BookLibrary);
};

module.exports = {
	deploy
};