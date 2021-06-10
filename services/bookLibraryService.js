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

const rentBook = async (contract, name) => {
    try {
        const rentBookCall = await contract.borrowBook(name);
        const rentBookReceipt = await rentBookCall.wait();
        if (rentBookReceipt.status != 1) {
            console.log(`Renting ${name} wasn't successful`);
            return false;
        } else {
            console.log(`Rented ${name} successfully!`);
            return true;
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

module.exports = {
    checkBookAvailability,
    addBook,
    rentBook,
    returnBook,
    checkIsBookRented,
    fetchAvailableBooks,
}