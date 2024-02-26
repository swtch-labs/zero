// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../access/RoleBasedAccessControl.sol";

/**
 * @title SimpleVestingCliff 
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Simple Cliff Vesting implementation, which facilitates a simple cliff vesting arrangement involving two parties: a depositor or owner and beneficiary.
 *         The depositor or owner funds the vesting smart contract, the beneficiary is the intended recipient of the funds, and the beneficiary has the ability to claim a vestment after vestment cliff ends. 
 */
contract SimpleVestingCliff is RoleBasedAccessControl {

    /**
     * @dev The address of the beneficiary who will receive the vested tokens.
     */
    address public beneficiary;

    /**
     * @dev The timestamp indicating the end of the cliff period. After this time, the beneficiary can claim the vested tokens.
     */
    uint256 public cliffEnd;

    /**
     * @dev The total amount of tokens to be vested.
     */
    uint256 public totalAmount;

    /**
     * @dev A boolean flag indicating whether the tokens have been vested.
     */
    bool public vested;
    
    /**
     * @dev Modifier to restrict functions to the beneficiary.
     */
    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, "Only beneficiary can perform this action");
        _;
    }

    /**
     * @dev Constructor 
     * @param _beneficiary The address of the beneficiary who will receive the vested tokens.
     * @param owner_ Address of the smart contract owner.
     * @param _cliffDuration Duration of the cliff in seconds.
     * @param _totalAmount Total amount of vestment.
     */
    constructor(address _beneficiary, address owner_, uint256 _cliffDuration, uint256 _totalAmount) 
        RoleBasedAccessControl(owner_) 
    {
        require(_cliffDuration > 0, "Cliff duration must be greater than zero");
        require(_totalAmount > 0, "Total amount must be greater than zero");

        beneficiary = _beneficiary;
        cliffEnd = block.timestamp + _cliffDuration;
        totalAmount = _totalAmount;
        vested = false;
    }

    /**
     * @dev Allows the owner to send Ether to the contract.
     */
    function deposit() external payable onlyOwner {
        // "Sender must be the owner in this case"
    }

    /**
     * @dev Allow beneficiary to claim allocated vestment.
     */
    function claimVestedAmount() external onlyBeneficiary {
        require(block.timestamp > cliffEnd, "Cliff duration not elapsed");
        require(!vested, "Tokens already vested");
        vested = true;
        payable(beneficiary).transfer(totalAmount);
    }
}
