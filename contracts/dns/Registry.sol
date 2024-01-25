// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Registrar.sol";
import "./Resolver.sol";

/**
 * @title Registry
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Registry implementation for domain name systems.
 */
contract Registry {
    
    /**
     * @dev Domain details.
     */
    struct DomainDetails {
        address owner;
        address resolver;
    }

    Registrar public registrar;

    // Mapping from domain names (hashed) to their details
    mapping(bytes32 => DomainDetails) public domains;

    // Event emitted when a domain's owner is changed
    event OwnerChanged(string domain, address newOwner);

    // Event emitted when a domain's resolver is changed
    event ResolverChanged(string domain, address newResolver);

    /**
     * @dev Constructor
     * @param _registrarAddress Address of the registrar.
     */
    constructor(address _registrarAddress) {
        registrar = Registrar(_registrarAddress);
    }

    /**
     * @dev Modifier to ensure that certain actions (like setting an owner or resolver) can only be done on registered domains.
     * @param domain Domain name to validate.
     */
    modifier onlyRegisteredDomain(string memory domain) {
        require(registrar.isDomainRegistered(domain), "Domain is not registered");
        _;
    }

    /**
     * @dev Set the owner of a domain name.
     * @param domain Domain name to associate with the new owner.
     * @param newOwner Address of the new owner to associate with the domain name.
     */
    function setOwner(string memory domain, address newOwner) public onlyRegisteredDomain(domain) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        domains[domainHash].owner = newOwner;
        emit OwnerChanged(domain, newOwner);
    }

    /**
     * @dev Get the owner of a domain name.
     * @param domain Domain to retrieve the associated address.
     */
    function getOwner(string memory domain) public view returns (address) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        return domains[domainHash].owner;
    }

    /**
     * @dev Set the resolver for a domain
     * @param domain Domain name to register.
     * @param newResolver Address to associate with the domain name.
     */
    function setResolver(string memory domain, address newResolver) public onlyRegisteredDomain(domain) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        domains[domainHash].resolver = newResolver;
        emit ResolverChanged(domain, newResolver);
    }
    
    /**
     * @dev Get the resolver address for a domain name. 
     * @param domain Domain name to retrieve the associated resolver.
     */
    function getResolverAddress(string memory domain) public view returns (address) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        return domains[domainHash].resolver;
    }

    /**
     * @dev Resolve a domain using its resolver.
     * @param domain Domain name to retrieve the associated address.
     */
    function resolveDomain(string memory domain) public view returns (address) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        address resolverAddress = domains[domainHash].resolver;

        // Ensure the resolver is set
        require(resolverAddress != address(0), "Resolver not set for domain");

        Resolver resolver = Resolver(resolverAddress);
        return resolver.getAddress(domain);
    }
}
