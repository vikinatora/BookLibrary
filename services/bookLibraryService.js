const { ethers, BigNumber } = require("ethers");

const checkBookAvailability = async (contract, name) => {
    try {
        const book = await contract.getBook(name);
        if (book.copies) {
            console.log(`There are ${book.copies} copies of ${name} left`);
            return true;
        } else {
            console.log(`There aren't any copies of ${name} left`);
            return false;
    
        }
    } catch(err) {
        console.log(err);
        return false;
    }
}
const addBook = async (contract, name, count) => {
    try {
        const addBookCall = await contract.addBook(name, count);
        const addBookReceipt = await addBookCall.wait();
        if (addBookReceipt.status != 1) {
            console.log(`Adding "${name}" to library wasn't successful`);
            return false;
        } else {
            console.log(`Added ${count} copies of "${name}" to library successfully!`);
            return true;
        }        
    } catch(err) {
        console.log(err);
        return false;
    }
}

const rentBook = async (books, contract, libToken, name) => {
    try {
      if (books.filter(b => b.name === name).length) {
        const result = await libToken.approve(contract.address, BigNumber.from("10000000000000000"))
        console.log(result);
        if (result) {
          const rentBookCall = await contract.borrowBook(name);
          const rentBookReceipt = await rentBookCall.wait();
          if (rentBookReceipt.status != 1) {
              console.log(`Renting ${name} wasn't successful`);
              return false;
          } else {
              console.log(`Rented ${name} successfully!`);
              return true;
          }        
        }
      } else {
        console.log("Book doesn't exist");
      }
    } catch(err) {
        console.log(err);
        return false;
    }
}

const returnBook = async (contract, name) => {
    try {
        const returnBookCall = await contract.returnBook(name);
        const returnBookReceipt = await returnBookCall.wait();
    
        if (returnBookReceipt.status != 1) {
            console.log(`Returning ${name} wasn't successfull`);
            return false;
        } else {
            console.log(`Returned ${name} successful`)
        }        
    } catch(err) {
        console.log(err);
        return false;
    }
}


async function checkIsBookRented(contract, name) {
    try {
        const isBorrowed = await contract.isBookBorrowedByCurrentUser(name);
        if (isBorrowed) {
            console.log(`You are currently renting ${name}`);
            return true;
        } else {
            console.log(`You aren't currently renting ${name}`);
            return false;
        }        
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function fetchAvailableBooks(contract) {
  try {
      const booksCount = (await contract.getBooksCount()).toNumber();
      const booksArray = [];
      for (let i = 0; i < booksCount; i++) {
          try {
              const bookName = await contract.booksIds(i);
              const book = await contract.books(bookName);
              if (book.copies) {
                  booksArray.push(book);
              }
          } catch (err) {
              console.log(err);
          }
      }    
      console.log(booksArray);
      return booksArray;    
  } catch(err) {
      console.log(err);
      return [];
  }
}


const convertEthToLib = async (amount, libToken, libWrapperContract, walletAddress) => {
  try {
    const wrapValue = ethers.utils.parseEther(amount)
    const wrapTx = await libWrapperContract.wrap({value: wrapValue});
    const receipt = await wrapTx.wait();
    if (receipt.status !== 1) {
      alert("Transaction failed");
    }
    console.log("Successfully converted ETH to LIB!");
  
    checkLibBalance(libToken, walletAddress)
  } catch(err) {
    console.log(err);
  }
}

const checkLibBalance = async (libToken, walletAddress) => {
  try {
    const balance = await libToken.balanceOf(walletAddress);
    const decimals = await libToken.decimals();
    const formatedBalance = formatToken(balance, decimals);
  
    console.log(`User balance: ${formatedBalance} LIB`);
  } catch(err) {
    console.log(err);
  }
}

const withdrawLIB = async (amount, libToken, libraryContract, libWrapper, walletAddress) => {
  const unwrapValue = ethers.utils.parseEther(amount);
  console.log(unwrapValue.toString());
  const result = await libToken.approve(libWrapper.address, unwrapValue)
  console.log(result);
  if (result) {
    const unwrapTx = await libWrapper.unwrap(unwrapValue);
    const receipt = await unwrapTx.wait();
    if(receipt.status !== 1) {
      alert("Transaction failed");
    }

    const balance = await libToken.balanceOf(walletAddress);
    const decimals = await libToken.decimals();
    const formatedBalance = formatToken(balance, decimals);

    console.log("Successfully unwrapped LIB to ETH!");
    console.log("Wallet balance:" + formatedBalance);
  } else {
    alert("Increase allowance failed")
  }

}


const formatToken = (wei, decimals = 18) => {
  return ethers.utils.formatUnits(wei, decimals);
}


module.exports = {
    checkBookAvailability,
    addBook,
    rentBook,
    returnBook,
    checkIsBookRented,
    fetchAvailableBooks,
    convertEthToLib, 
    checkLibBalance,
    withdrawLIB
}