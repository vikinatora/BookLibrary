// SPDX-License-Identifier: UNLICENSED

pragma solidity >0.7.0 <=0.7.5;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BookLibrary is Ownable {
    Book[] private books;
    
    mapping(bytes32 => bool) userBooks;
    
    struct Book {
        string name;
        uint8 copies;
        address[] borrowers;
    }
    
    
    function addBook (string memory _name, uint8 _copies) external onlyOwner {
        address[] memory borrowers;
        
        books.push(Book(_name, _copies, borrowers));
    }
    
    function addCopies(uint _bookId, uint8 _copies) external onlyOwner {
        books[_bookId].copies += _copies;
    }
    
    function borrowBook(uint _bookId) external {
        //Books must exists
        require(_bookId < books.length, "Book doesn't exist");
        
        Book storage book = books[_bookId]; 

        // User can't borrow books with no copies left;
        require(book.copies > 0, "No more copies left");
    
        // User shouldn't borrow the same book more than once;
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, _bookId));
        require(userBooks[hash] == false, "You've already borrowed the book");
        
        userBooks[hash] = true;
        book.copies--;
        
        bool hasBorrowedBefore = false;
        for (uint i = 0; i < book.borrowers.length; i++) {
            if (book.borrowers[i] == msg.sender) {
                hasBorrowedBefore = true;
                break;
            }
        }
        
        if (!hasBorrowedBefore) {
            book.borrowers.push(msg.sender);
        }
    
    }
    
    function returnBook(uint _bookId) external {
        //Check if user has borrowed this book;
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, _bookId));
        require(userBooks[hash] == true, "You can't return a book that you haven't borrowed");
        
        Book storage book = books[_bookId];
        book.copies++;
        userBooks[hash] = false;
    }
    
    function viewBooks() external view returns (Book[] memory) {
        return books;
    }
    
    function viewBorrowers(uint _bookId) external view returns (address[] memory) {
        return books[_bookId].borrowers;
    }
    
}