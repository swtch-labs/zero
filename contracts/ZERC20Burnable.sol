// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ZERC20.sol";

contract ZERC20Burnable is ZERC20 {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ZERC20(name_, symbol_, initialSupply)
    {
        // Additional initialization, if needed
    }

    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "ZERC20Burnable: burn amount exceeds balance");

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
        require(account != address(0), "ZERC20Burnable: burn from the zero address");
        require(balanceOf[account] >= amount, "ZERC20Burnable: burn amount exceeds balance");

        balanceOf[account] -= amount;
        totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }
}
