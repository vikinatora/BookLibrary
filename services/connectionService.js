const { ethers } = require("ethers");
const BookLibrary = require("../build/BookLibrary.json");

const connectToGanache = (url, walletAddress, contractAddress) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(url);
        const wallet = new ethers.Wallet(walletAddress, provider);
        const bookLibraryContract = new ethers.Contract(contractAddress,BookLibrary.abi, wallet);
        console.log("Successfully connected to Ganache");
        return [provider, wallet, bookLibraryContract];
    } catch(err) {
        console.log(err);
        console.log("Couldn't connect to Ropsten");
        return [];
    }
}

const connectToRopsten = (api, walletAddress, contractAddress) => {
    try {
        const provider = new ethers.providers.InfuraProvider("ropsten", api)    
        const wallet = new ethers.Wallet(walletAddress,provider);
        const bookLibraryContract = new ethers.Contract(contractAddress, BookLibrary.abi, wallet);

        console.log("Successfully connected to Ropsten");
        return [provider, wallet, bookLibraryContract];        
    } catch(err) {
        console.log(err);
        console.log("Couldn't connect to Ropsten");
        return [];
    }

}

module.exports = {
    connectToGanache,
    connectToRopsten
}
