// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SampleERC20
 * @dev Create a sample ERC20 standard token
 */
contract FAerc20 is ERC20 {
    uint256 timeInterval = 1;
    uint256 expiryTime;

    mapping(address => bool) isAdmin;

    modifier checkAdmin(address _address) {
        require(isAdmin[_address], "Only admin can access");
        _;
    }

    modifier checkExpiryTime() {
        require(expiryTime < block.timestamp, "Cannot mint right now");
        _;
    }

    constructor(string memory tokenName, string memory tokenSymbol)
        ERC20(tokenName, tokenSymbol)
    {
        isAdmin[msg.sender] = true;
        expiryTime = block.timestamp;
    }

    function mint(uint256 _totalSupply, address _address)
        public
        checkExpiryTime
        checkAdmin(msg.sender)
    {
        expiryTime = _calculateTimeStamp();
        _mint(_address, _totalSupply);
    }

    function burn(uint256 _total, address _address) public {
        _burn(_address, _total);
    }

    function _calculateTimeStamp() internal view returns (uint256) {
        return (block.timestamp + timeInterval * 1 days);
    }
}
