// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LibraryToken.sol";
import "./LibWrapper.sol";

contract BookLibrary is Ownable {
  LibraryToken public LIBToken;
  LIBWrapper public LIBTokenWrapper;

  address payable public libTokenWrapperAddress;

  uint public rentFee = 10000000000000000;

  bytes32[] public booksIds;
  
  mapping(bytes32 => Book) public books;
  mapping(bytes32 => bool) private userBorrowedBooks;
  mapping(bytes32 => mapping (address => bool)) private hasUserBorrowedBefore;

  event LogBookAdded(string bookName, uint8 copies);
  event LogBookBorrowed(string bookName, address borrower);
  event LogBookReturned(string bookName, address returner);

  struct Book {
    string name;
    uint8 copies;
    address[] borrowers;
    bool exists;
  }

  constructor(address payable _wrapperAddress, address _tokenAddress) {
    LIBToken = LibraryToken(_tokenAddress);
    LIBTokenWrapper = LIBWrapper(_wrapperAddress);
    libTokenWrapperAddress = _wrapperAddress;
  }
  
  modifier bookShouldExist(string memory _name, bool shouldExist) {
    bytes32 encodedName = keccak256(abi.encodePacked(_name));
    if (shouldExist) {
      require(books[encodedName].exists == true, "Book doesn't exist!");
    } else {
      require(books[encodedName].exists == false, "Book already exists!");
    }
    _;
  }

  function addBook (string memory _name, uint8 _copies) external onlyOwner bookShouldExist(_name, false) {
    bytes32 encodedName = keccak256(abi.encodePacked(_name));

    address[] memory borrowers;
    Book memory newBook = Book(_name, _copies, borrowers, true);
    booksIds.push(encodedName);
    books[encodedName] = newBook;

    emit LogBookAdded(_name, _copies);
  }
  
  function addCopies(string memory _bookName, uint8 _copies) external onlyOwner bookShouldExist(_bookName, true) {
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    books[encodedName].copies += _copies;
  }
    
  function borrowBook(string memory _bookName) external bookShouldExist(_bookName, true){    
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    Book storage book = books[encodedName]; 

    // User can't borrow booksArray with no copies left;
    require(book.copies > 0, "No more copies left");

    // User shouldn't borrow the same book more than once;
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, _bookName));
    require(userBorrowedBooks[hash] == false, "You've already borrowed the book");

    LibraryToken libToken = LIBTokenWrapper.LIBToken();
    // Transfer rent fee
    libToken.transferFrom(msg.sender, address(this), rentFee);

    userBorrowedBooks[hash] = true;
    book.copies--;
    if (hasUserBorrowedBefore[encodedName][msg.sender] == false) {
      book.borrowers.push(msg.sender);
      hasUserBorrowedBefore[encodedName][msg.sender] = true;
    }

    emit LogBookBorrowed(_bookName, msg.sender);
  }

  function borrowBookWithPermit(string memory _bookName, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external bookShouldExist(_bookName, true){    
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    Book storage book = books[encodedName]; 

    // User can't borrow booksArray with no copies left;
    require(book.copies > 0, "No more copies left");

    // User shouldn't borrow the same book more than once;
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, _bookName));
    require(userBorrowedBooks[hash] == false, "You've already borrowed the book");

    LibraryToken libToken = LIBTokenWrapper.LIBToken();

    libToken.permit(msg.sender, address(this), value, deadline, v,r,s);
    // Transfer rent fee
    libToken.transferFrom(msg.sender, address(this), rentFee);

    userBorrowedBooks[hash] = true;
    book.copies--;
    if (hasUserBorrowedBefore[encodedName][msg.sender] == false) {
      book.borrowers.push(msg.sender);
      hasUserBorrowedBefore[encodedName][msg.sender] = true;
    }
    emit LogBookBorrowed(_bookName, msg.sender);
  }

  function borrowBookWithSignature (string memory _bookName, bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s, address receiver) external bookShouldExist(_bookName, true) {
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    Book storage book = books[encodedName]; 

    // User can't borrow booksArray with no copies left;
    require(book.copies > 0, "No more copies left");
    require(recoverSigner(hashedMessage, v, r, s) == receiver, "Reciver hasn't signed the message");
    // User shouldn't borrow the same book more than once;
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, _bookName));
    require(userBorrowedBooks[hash] == false, "You've already borrowed the book");

    LibraryToken libToken = LIBTokenWrapper.LIBToken();
    // Transfer rent fee
    libToken.transferFrom(msg.sender, address(this), rentFee);

    userBorrowedBooks[hash] = true;
    book.copies--;
    if (hasUserBorrowedBefore[encodedName][msg.sender] == false) {
      book.borrowers.push(msg.sender);
      hasUserBorrowedBefore[encodedName][msg.sender] = true;
    }

    emit LogBookBorrowed(_bookName, msg.sender);
  }

  function recoverSigner(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s) internal returns(address) {
    bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMessage));
    return ecrecover(messageDigest, v, r, s);
  }


  function borrowOnBehalfOf(string memory _bookName, bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s, address receiver) external bookShouldExist(_bookName, true) {
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    Book storage book = books[encodedName]; 

    // User can't borrow booksArray with no copies left;
    require(book.copies > 0, "No more copies left");

    // User mush have signed the message;
    require(recoverSigner(hashedMessage, v, r, s) == receiver, "Reciver hasn't signed the message");

    // User shouldn't borrow the same book more than once;
    bytes32 hash = keccak256(abi.encodePacked(receiver, _bookName));
    require(userBorrowedBooks[hash] == false, "You've already borrowed the book");

    LibraryToken libToken = LIBTokenWrapper.LIBToken();

    libToken.transferFrom(receiver, address(this), rentFee);

    userBorrowedBooks[hash] = true;
    book.copies--;
    if (hasUserBorrowedBefore[encodedName][receiver] == false) {
      book.borrowers.push(receiver);
      hasUserBorrowedBefore[encodedName][receiver] = true;
    }

    emit LogBookBorrowed(_bookName, receiver);

  }
  
  
  function returnBook(string memory _bookName) external bookShouldExist(_bookName, true) {
    //Check if user has borrowed this book;
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, _bookName));
    require(userBorrowedBooks[hash] == true, "You can't return a book that you haven't borrowed");
    
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    Book storage book = books[encodedName];
    book.copies++;
    userBorrowedBooks[hash] = false;

    emit LogBookReturned(_bookName, msg.sender);
  }
  

  function getBorrowers(string memory _bookName) external view bookShouldExist(_bookName, true) returns (address[] memory) {
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    return books[encodedName].borrowers;
  }

  function getBook (string memory _bookName) external view bookShouldExist(_bookName, true) returns (Book memory) {
    bytes32 encodedName = keccak256(abi.encodePacked(_bookName));
    return books[encodedName];
  }

  function isBookBorrowedByCurrentUser(string memory _bookName) external view bookShouldExist(_bookName, true) returns(bool) {
    bytes32 key = keccak256(abi.encodePacked(msg.sender, _bookName));
    return userBorrowedBooks[key];
  }

  function getBooksCount() external view returns(uint) {
    return booksIds.length;
  }  
} 