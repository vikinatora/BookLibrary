const { ethers, BigNumber } = require("ethers");
const libraryService = require("./services/bookLibraryService.js");
const connectionService = require("./services/connectionService.js");
const LibraryToken = require("./build/LibraryToken.json");
const LibWrapper = require("./build/LIBWrapper.json");

const run = async (provider, wallet, bookLibraryContract) => {
    try {
      const libWrapperAddress = await bookLibraryContract.LIBTokenWrapper();
      const libWrapper = new ethers.Contract(libWrapperAddress, LibWrapper.abi, wallet);

      const libTokenAddress = await bookLibraryContract.LIBToken();
      const libToken = new ethers.Contract(libTokenAddress, LibraryToken.abi, wallet);

        if (provider && wallet && bookLibraryContract && libToken && libWrapper) {
            const bookName = "Vik's Book 2";
    
            // await libraryService.addBook(bookLibraryContract, bookName, 5);
            
            // const books = await libraryService.fetchAvailableBooks(bookLibraryContract);

            // await libraryService.convertEthToLib("0.05", libToken, libWrapper, wallet.address);

            // await libraryService.rentBook(books, bookLibraryContract, libToken, bookName);
    
            await libraryService.checkIsBookRented(bookLibraryContract, bookName);

            await libraryService.checkLibBalance(libToken, wallet.address);

            await libraryService.withdrawLIB("0.05", libToken, bookLibraryContract, libWrapper, wallet.address)

            // await libraryService.checkBookAvailability(bookLibraryContract, bookName);
    
            // await libraryService.returnBook(bookLibraryContract, bookName);
    
            // await libraryService.checkIsBookRented(bookLibraryContract, bookName);
    
            // await libraryService.checkBookAvailability(bookLibraryContract, bookName);


        }
        
    } catch(err) {
        console.log(err.message);
    }
}

const [provider, wallet, bookLibraryContract] = connectionService.connectToGanache(
    "http://localhost:8545",
    "0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8",
    "0x305b8DDA35b2e9b395E63Ad7B4e845859ab3aB4e"
);

// const [provider, wallet, bookLibraryContract] = connectionService.connectToRopsten(
//     "40c2813049e44ec79cb4d7e0d18de173",
//     "695d7686360e0d8a26d7616b938accf78071d849ecb5301ab6b39323bb5f7d0b",
//     "0x0116090EfeC8A6c176A094d3094c58811a7eA39c"
// );


run(provider, wallet, bookLibraryContract);
