const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');


const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(BookLibrary);

};

module.exports = {
	deploy
};