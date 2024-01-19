// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleEscrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;

    constructor(address _beneficiary, address _arbiter) {
      depositor = msg.sender;
      beneficiary = _beneficiary;
      arbiter = _arbiter;
    }
    
    // deposit allows the depositor to send Ether to the contract.
    function deposit() external payable {
      require(msg.sender == depositor, "Sender must be the depositor");
    }

    // releaseToBeneficiary allows the arbiter to send all the contract's Ether to the beneficiary.
    function releaseToBeneficiary() external {
      require(msg.sender == arbiter, "Only arbiter can release funds");
      payable(beneficiary).transfer(address(this).balance);
    }

    // refundToDepositor allows the arbiter to refund the Ether to the depositor.
    function refundToDepositor() external {
      require(msg.sender == arbiter, "Only arbiter can refund funds");
      payable(depositor).transfer(address(this).balance);
    }

    // getBalance returns the contract's Ether balance.
    function getBalance() public view returns (uint) {
      return address(this).balance;
    }
}
