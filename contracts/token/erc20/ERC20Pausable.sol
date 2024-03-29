// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";
import "./Pausable.sol";

contract ERC20Pausable is ERC20, Pausable {

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol, _initialSupply) 
        Pausable()
    {
        // Additional initialization
    }
    
    // Override functions to include the whenNotPaused modifier

    function transfer(address _to, uint256 _value) public whenNotPaused override returns (bool success) {
        return super.transfer(_to, _value);
    }

    function approve(address _spender, uint256 _value) public whenNotPaused override returns (bool success) {
        return super.approve(_spender, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused override returns (bool success) {
        return super.transferFrom(_from, _to, _value);
    }

    // override other functions as necessary
}
