// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../access/RoleBasedAccessControl.sol";

/**
 * @title MultiEscrow
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Multi-Escrow implementation.
 */
contract MultiEscrow is RoleBasedAccessControl {
    
    /**
     * @dev Escrow state structure.
     */
    struct Escrow {
        address depositor;
        address beneficiary;
        address arbiter;
        uint256 amount;
        bool isFunded;
    }

    /**
     * @dev Mapping a unique nonce for each escrow to an Escrow.
     */
    mapping(uint256 => Escrow) public escrows;
    
    /**
     * @dev Escrow nonce.
     */
    uint256 public nextEscrowId;

    /**
     * @dev Fee percentage.
     */
    uint256 constant public feePercentage = 2;

    /**
     * @dev Balance accrued from fees.
     */
    uint256 public deployerBalance;

    // Event emitted when an escrow is created
    event EscrowCreated(uint256 indexed escrowId, address indexed depositor, address indexed beneficiary, address arbiter);
    
    // Event emitted when a deposit has been made
    event Deposited(uint256 indexed escrowId, uint256 amount);

    // Event emitted when funds are released to a beneficiary
    event ReleasedToBeneficiary(uint256 indexed escrowId);

    // Event emitted when refund is made to the depositor
    event RefundedToDepositor(uint256 indexed escrowId);

    /**
     * @dev Constructor
     * @param owner_ Address of the smart contract owner.
     */
    constructor(address owner_)
        RoleBasedAccessControl(owner_)
    {
      // Additional initialization
    }

    /**
     * @dev Create a new escrow agreement.
     * @param _beneficiary Party receiving the funds.
     * @param _arbiter Party responsible for arbitration of escrow.
     */
    function createEscrow(address _beneficiary, address _arbiter) external returns (uint256) {
        uint256 escrowId = nextEscrowId++;
        escrows[escrowId] = Escrow({
            depositor: msg.sender,
            beneficiary: _beneficiary,
            arbiter: _arbiter,
            amount: 0,
            isFunded: false
        });

        emit EscrowCreated(escrowId, msg.sender, _beneficiary, _arbiter);
        return escrowId;
    }

    /**
     * @dev Deposit Ether into the specified escrow.
     * @param _escrowId Unique escrow nonce.
     */
    function deposit(uint256 _escrowId) external payable {
        require(msg.sender == escrows[_escrowId].depositor, "Sender must be the depositor");
        require(!escrows[_escrowId].isFunded, "Escrow already funded");

        uint256 fee = msg.value * feePercentage / 100;
        escrows[_escrowId].amount = msg.value - fee;
        deployerBalance += fee;
        escrows[_escrowId].isFunded = true;
        
        emit Deposited(_escrowId, escrows[_escrowId].amount);
    }

    /**
     * @dev Release funds to the beneficiary.
     * @param _escrowId Unique escrow nonce.
     */
    function releaseToBeneficiary(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.arbiter, "Only arbiter can release funds");
        require(escrow.isFunded, "Escrow not funded");

        payable(escrow.beneficiary).transfer(escrow.amount);
        emit ReleasedToBeneficiary(_escrowId);
    }

    /**
     * @dev Refund funds to the escrow depositor.
     * @param _escrowId Unique escrow nonce.
     */
    function refundToDepositor(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.arbiter, "Only arbiter can refund funds");
        require(escrow.isFunded, "Escrow not funded");

        payable(escrow.depositor).transfer(escrow.amount);
        emit RefundedToDepositor(_escrowId);
    }

    /**
     * @dev Get balance for an escrow.
     * @param _escrowId Unique escrow nonce.
     */
    function getEscrowBalance(uint256 _escrowId) public view returns (uint256) {
        Escrow storage escrow = escrows[_escrowId];
        return escrow.amount;
    }

    /**
     * @dev Allows the smart contract owner to withdraw the accumulated fees.
     */
    function withdrawFees() external {
        require(msg.sender == owner, "Only deployer can withdraw fees");
        require(deployerBalance > 0, "No fees to withdraw");

        uint256 amount = deployerBalance;
        deployerBalance = 0;
        payable(msg.sender).transfer(amount);
    }
}
