// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title RoleBasedAccessControl 
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Role Based Access Control implementation of ownership.
 */
contract RoleBasedAccessControl {

    /**
     * @dev Owner of the smart contract.
     */
    address public owner;
    
    /**
     * @dev Roles data structure, true equates the address has the role, false otherwise.
     */
    mapping(bytes32 => mapping(address => bool)) private roles;

    /**
     * @dev Role granted event.
     * @param role Role to grant.
     * @param account Account receiving role grant.
     */
    event RoleGranted(bytes32 indexed role, address indexed account);

    /**
     * @dev Role revocation event.
     * @param role Role to revoke.
     * @param account Associated account undergoing revocation of role grant.
     */
    event RoleRevoked(bytes32 indexed role, address indexed account);

    /**
     * @dev Modifier to restrict functions to users with a specific role.
     * @param role Role to validate.
     */
    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "Not authorized");
        _;
    }

    /**
     * @dev Modifier to restrict functions to the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    /**
     * @dev Constructor
     * @param owner_ Address of the smart contract owner.
     */
    constructor(address owner_) {
        owner = owner_;
    }

    /**
     * @dev Grant a role to an address.
     * @param role Role to assign.
     * @param account Account receiving the role.
     */
    function grantRole(bytes32 role, address account) public onlyOwner {
        // Add role-granting logic here (possibly restricted to admins)
        roles[role][account] = true;
        emit RoleGranted(role, account);
    }

    /**
     * @dev Revoke a role from an address.
     * @param role Role to revoke.
     * @param account Account we are revoking the role from.
     */
    function revokeRole(bytes32 role, address account) public onlyOwner {
        // Add role-revoking logic here (possibly restricted to admins)
        roles[role][account] = false;
        emit RoleRevoked(role, account);
    }

    /**
     * @dev Validate if an address has a certain role.
     * @param role Role to validate.
     * @param account Acccount to validate.
     */
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return roles[role][account];
    }
}
