// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ZRoleBasedAccessControl {
    address public owner;
    
    // Roles data structure where true means the address has the role
    mapping(bytes32 => mapping(address => bool)) private roles;

    // Events for adding and removing roles
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    // Modifier to restrict functions to users with a specific role
    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "Not authorized: lacks role");
        _;
    }
    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(address owner_) {
        owner = owner_;
    }

    // Function to grant a role to an address
    function grantRole(bytes32 role, address account) public onlyOwner {
        // Add role-granting logic here (possibly restricted to admins)
        roles[role][account] = true;
        emit RoleGranted(role, account);
    }

    // Function to revoke a role from an address
    function revokeRole(bytes32 role, address account) public onlyOwner {
        // Add role-revoking logic here (possibly restricted to admins)
        roles[role][account] = false;
        emit RoleRevoked(role, account);
    }

    // Function to check if an address has a certain role
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return roles[role][account];
    }
}
