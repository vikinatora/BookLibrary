const { ethers } = require("ethers");
const BookLibrary = require("./build/BookLibrary.json");

const run = async function() {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const latestBlock = await provider.getBlock("latest");
	console.log(latestBlock.hash);

    const wallet = new ethers.Wallet("0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8",provider);
    const balance = await wallet.getBalance();
    console.log(ethers.utils.formatEther(balance, 18));

    const bookLibraryContract = new ethers.Contract("0xe2bbD0eFa5E46b95B424b2DB67A1970fcdb717EC", BookLibrary.abi, wallet);
    console.log(bookLibraryContract);
}

run()