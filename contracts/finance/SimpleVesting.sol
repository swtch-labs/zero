// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../access/RoleBasedAccessControl.sol";

/**
 * @title SimpleVesting 
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Simple Vesting implementation, which facilitates a simple vesting arrangement involving two parties: a depositor and beneficiary.
 *         The depositor funds the vesting smart contract, the beneficiary is the intended recipient of the funds, and the beneficiary has the ability to claim a vestment on a monthly basis. 
 */
contract SimpleVesting is RoleBasedAccessControl {
    /**
     * @dev Address of the party that deposits funds into the escrow.
     */
    address public depositor;

    /**
     * @dev Address of the intended recipient of the funds.
     */
    address public beneficiary;

    /**
     * @dev Block timestamp indicating the beginning of the vesting period.
     */
    uint256 public startTimestamp;
    
    /**
     * @dev Months the beneficiary has claimed.
     */
    uint256 public claimedMonths = 0;

    /**
     * @dev Vesting duration, default is 1 year or 12 months.
     */
    uint8 public vestingDuration = 12;
    
    /**
     * @dev Amount calculated to be released per month.
     */
    uint256 public monthlyReleaseAmount = 0;

    /**
     * @dev Total vestment amount.
     */
    uint256 public totalVestment;

    /**
     * @dev Modifier to restrict functions to the beneficiary.
     */
    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, "Only beneficiary can perform this action");
        _;
    }

    /**
     * @dev Modifier to restrict functions to the depositor.
     */
    modifier onlyDepositor() {
        require(msg.sender == depositor, "Only depositor can perform this action");
        _;
    }

    /**
     * @dev Constructor
     * @param _beneficiary Address of the beneficiary.
     * @param owner_ Address of the smart contract owner.
     * @param _vestingDuration Duration of vestment in months.
     * @param _totalVestment Total amount of the vestment.
     */
    constructor(address _beneficiary, address owner_, uint8 _vestingDuration, uint256 _totalVestment) 
        RoleBasedAccessControl(owner_)
    {
        require(_vestingDuration > 0, "Vesting duration must be greater than zero");
        require(_totalVestment > 0, "Total vestment must be greater than zero");
        require(_totalVestment >= _vestingDuration, "Total vestment must be greater than or equal to vesting duration");
        // initialize core actors
        depositor = owner_;
        beneficiary = _beneficiary;
        // initialize time
        startTimestamp = block.timestamp;
        if(_vestingDuration > 0) {
            // override default duration
            vestingDuration = _vestingDuration;
        }
        // vestment
        totalVestment = _totalVestment;
        monthlyReleaseAmount = _totalVestment / _vestingDuration;
    }

    /**
     * @dev Allows the depositor to send Ether to the contract.
     */
    function deposit() external payable onlyDepositor {
        // "Sender must be the depositor"
    }

    /**
     * @dev Get the contract's Ether balance.
     */
    function getBalance() public view returns (uint) {
      return address(this).balance;
    }

    /**
     * @dev Allow beneficiary to claim allocated vestment.
     */
    function claimVestment() external onlyBeneficiary {

        uint256 monthsElapsed = (block.timestamp - startTimestamp) / (30 days);
        require(monthsElapsed >= 1, "At least one month should pass");

        uint256 monthsDue = monthsElapsed - claimedMonths;
        require(monthsDue > 0, "No ether due for claim");

        uint256 claimAmount = monthsDue * monthlyReleaseAmount;
        require(claimAmount <= totalVestment, "Claim exceeds total vestment");
        
        claimedMonths += monthsDue;
        payable(beneficiary).transfer(claimAmount);
    }

}