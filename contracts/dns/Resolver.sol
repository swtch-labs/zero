// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../access/RoleBasedAccessControl.sol";

/**
 * @title Resolver
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Resolver implementation for domain name systems.
 */
contract Resolver is RoleBasedAccessControl {

    /**
     * @dev Mapping domain name hash to an address.
     */
    mapping (bytes32 => address) private addresses;

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
     * Set the address for the domain name.
     * @param domain Domain name to reserve. 
     * @param addr Address to associate with the domain.
     */
    function setAddress(string memory domain, address addr) public onlyOwner {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        addresses[domainHash] = addr;
    }

    /**
     * @dev Get the address for a domain name.
     * @param domain Domain name to retrieve the associated address.
     */
    function getAddress(string memory domain) public view returns(address) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        return addresses[domainHash];
    }
}