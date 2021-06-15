// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract LibraryToken is ERC20PresetMinterPauser {
  constructor() ERC20PresetMinterPauser("LibraryToken", "LIB") {

  }
}