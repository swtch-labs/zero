// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ZERC20.sol";

contract ZERC20Mintable is ZERC20 {
    // Optional: Add a role-based access control for minting (like onlyOwner or onlyMinter)

    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ZERC20(name_, symbol_, initialSupply) 
    {
        // Additional constructor logic if needed
    }

    function mint(address to, uint256 amount) public {
        // Optional: Add access control checks here (e.g., require(msg.sender == minter))
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ZERC20Mintable: mint to the zero address");

        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}
