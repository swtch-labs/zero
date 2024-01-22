// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title ProofOfFunds
 * @author astordigital@gmail.com
 * @notice Zero Smart Contract Proof of Funds implementation. Smart contract proves the existence of funds and their availability after a specific period. 
 */
contract ProofOfFunds {
    /**
     * @dev Address of the contract owner.
     */
    address public owner;

    /**
     * @dev Timestamp indicating when the funds may be withdrawn.
     */
    uint public lockTime;

    /**
     * @dev Time conversion constants.
     */
    uint public constant second = 1 seconds;
    uint public constant minute = 1 minutes;

    /**
     * @dev Constructor
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Allows the owner to deposit Ether into the contract. The require statement ensures a positive amount is deposited.
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
    }

    /**
     * @dev The owner can call this function to set the duration (in seconds) for which the funds should be locked.
     * @param _timeInSeconds  Duration in seconds for which the funds should be locked.
     */
    function setLockTime(uint _timeInSeconds) external {
        require(msg.sender == owner, "Only owner can set the lock time");
        lockTime = block.timestamp + _timeInSeconds;
    }

    /**
     * @dev Allows the owner to withdraw the funds, but only if the current timestamp is greater than or equal to the lockTime.
     */
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw funds");
        require(block.timestamp >= lockTime, "Funds are locked");
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Get the contract's Ether balance.
     */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}