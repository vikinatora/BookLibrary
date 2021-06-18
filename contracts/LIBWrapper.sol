// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./LibraryToken.sol";

contract LIBWrapper {  
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

	LibraryToken public LIBToken;
	address public LIBTokenAddress;

	event LogLIBWrapped(address sender, uint256 amount);
	event LogLIBUnwrapped(address sender, uint256 amount);

  // constructor(address _libTokenAddress) public {
  //   LIBToken = LibraryToken(_libTokenAddress);s
  // }

  constructor() public {
    LIBToken = new LibraryToken();
  }

	receive() external payable {
		wrap();
	} 

	function wrap() public payable {
		require(msg.value > 0, "We need to wrap at least 1 wei");
		LIBToken.mint(msg.sender, msg.value);
		emit LogLIBWrapped(msg.sender, msg.value);
	}

  function wrapWithSignature(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s, address receiver) public payable {
    require(msg.value > 0, "We need to wrap at least 1 wei");
    require(recoverSigner(hashedMessage, v, r, s) == receiver, "Reciver hasn't signed the message");
    LIBToken.mint(receiver, msg.value);
    emit LogLIBWrapped(receiver, msg.value);
  }

  function recoverSigner(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s) internal returns(address) {
    bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMessage));
    return ecrecover(messageDigest, v, r, s);
  }

  function unwrap(uint value) public {
		require(value > 0, "We need to unwrap at least 1 wei");
		LIBToken.transferFrom(msg.sender, address(this), value);
		LIBToken.burn(value);
		msg.sender.transfer(value);
		emit LogLIBUnwrapped(msg.sender, value);
	}
  
}