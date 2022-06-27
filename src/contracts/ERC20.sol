// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SampleERC20
 * @dev Create a sample ERC20 standard token
 */
contract FAerc20 is ERC20 {
    constructor(string memory tokenName, string memory tokenSymbol)
        ERC20(tokenName, tokenSymbol)
    {}

    function mint(uint256 _totalSupply, address _address) public {
        _mint(_address, _totalSupply);
    }

    function burn(uint256 _total, address _address) public {
        _burn(_address, _total);
    }
}
