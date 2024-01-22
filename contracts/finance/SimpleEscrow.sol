// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title SimpleEscrow
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Simple Escrow implementation, which facilitates a simple escrow arrangement involving three parties: a depositor, a beneficiary, and an arbiter. 
 *         The depositor funds the escrow, the beneficiary is the intended recipient of the funds, and the arbiter has the authority to decide the release of funds either back to the depositor or to the beneficiary. 
 *         Setup may be used in scenarios where trust needs to be established between two parties through a neutral third party (the arbiter). 
 */
contract SimpleEscrow {
    /**
     * @dev Address of the party that deposits funds into the escrow.
     */
    address public depositor;
    
    /**
     * @dev Address of the intended recipient of the funds.
     */
    address public beneficiary;
    
    /**
     * @dev Address of the arbiter who decides on the fund disbursement.
     */
    address public arbiter;

    /**
     * @dev Constructor
     * @param _beneficiary Address of the beneficiary.
     * @param _arbiter Address of the arbiter.
     */
    constructor(address _beneficiary, address _arbiter) {
      depositor = msg.sender;
      beneficiary = _beneficiary;
      arbiter = _arbiter;
    }
    
    /**
     * @dev Allows the depositor to send Ether to the contract.
     */
    function deposit() external payable {
      require(msg.sender == depositor, "Sender must be the depositor");
    }

    /**
     * @dev Allows the arbiter to send all the contract's Ether to the beneficiary.
     */
    function releaseToBeneficiary() external {
      require(msg.sender == arbiter, "Only arbiter can release funds");
      payable(beneficiary).transfer(address(this).balance);
    }

    /**
     * @dev Allows the arbiter to refund the Ether to the depositor.
     */
    function refundToDepositor() external {
      require(msg.sender == arbiter, "Only arbiter can refund funds");
      payable(depositor).transfer(address(this).balance);
    }

    /**
     * @dev Get the contract's Ether balance.
     */
    function getBalance() public view returns (uint) {
      return address(this).balance;
    }
}
