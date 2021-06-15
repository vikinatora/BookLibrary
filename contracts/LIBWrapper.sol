// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./LibraryToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LIBWrapper is Ownable {  

	LibraryToken public LIBToken;

	event LogLIBWrapped(address sender, uint256 amount);
	event LogLIBUnwrapped(address sender, uint256 amount);

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

  function unwrap(uint value) external onlyOwner {
		require(value > 0, "We need to unwrap at least 1 wei");
		LIBToken.transferFrom(msg.sender, address(this), value);
		LIBToken.burn(value);
		msg.sender.transfer(value);
		emit LogLIBUnwrapped(msg.sender, value);
	}
  
}