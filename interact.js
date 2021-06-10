const { ethers, BigNumber } = require("ethers");
const libraryService = require("./services/bookLibraryService.js");
const connectionService = require("./services/connectionService.js");

const run = async (provider, wallet, bookLibraryContract) => {
    try {
        if (provider && wallet && bookLibraryContract) {
            const bookName = "Vik's Book 2";
    
            await libraryService.addBook(bookLibraryContract, bookName, 5);
            
            await libraryService.fetchAvailableBooks(bookLibraryContract);
    
            await libraryService.rentBook(bookLibraryContract, bookName);
    
            await libraryService.checkIsBookRented(bookLibraryContract, bookName);
    
            await libraryService.checkBookAvailability(bookLibraryContract, bookName);
    
            await libraryService.returnBook(bookLibraryContract, bookName);
    
            await libraryService.checkIsBookRented(bookLibraryContract, bookName);
    
            await libraryService.checkBookAvailability(bookLibraryContract, bookName);
        }
        
    } catch(err) {
        console.log(err.message);
    }
}

// const [provider, wallet, bookLibraryContract] = connectionService.connectToGanache(
//     "http://localhost:8545",
//     "0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8",
//     "0x19afdAA60e9349d09827a60141d82779A7b39326"
// );

const [provider, wallet, bookLibraryContract] = connectionService.connectToRopsten(
    "40c2813049e44ec79cb4d7e0d18de173",
    "695d7686360e0d8a26d7616b938accf78071d849ecb5301ab6b39323bb5f7d0b",
    "0x93e9edb5b467790eCCC830D7AB735d61c39f6C6D"
);


run(provider, wallet, bookLibraryContract);
