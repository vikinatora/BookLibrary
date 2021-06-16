const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');
const LibraryToken = require('../build/LibraryToken.json');
const LIBWrapper = require("../build/LIBWrapper.json");


const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const libWrapper = await deployer.deploy(LIBWrapper);
	const libTokenAddress = await libWrapper.LIBToken();
	await deployer.deploy(BookLibrary, false, libWrapper.contractAddress, libTokenAddress);
};

module.exports = {
	deploy
};