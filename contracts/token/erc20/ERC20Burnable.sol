// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";

contract ERC20Burnable is ERC20 {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ERC20(name_, symbol_, initialSupply)
    {
        // Additional initialization
    }

    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "ERC-20 Burnable: burn amount exceeds balance");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function burnFrom(address account, uint256 amount) public {
        uint256 decreasedAllowance = allowance[account][msg.sender] - amount;
        _approve(account, msg.sender, decreasedAllowance);
        _burn(account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC-20 Burnable: burn from the zero address");
        require(balanceOf[account] >= amount, "ERC-20 Burnable: burn amount exceeds balance");

        balanceOf[account] -= amount;
        totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }
}
