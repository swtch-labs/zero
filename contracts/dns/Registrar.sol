// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title Registrar
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Registrar implementation for domain name systems.
 */
contract Registrar {

    /**
     * @dev Domain details.
     */
    struct Domain {
        address owner;
        uint256 expiresOn;
    }

    /**
     * @dev Default registration period.
     */
    uint256 constant public REGISTRATION_PERIOD = 365 days;

    /**
     * @dev Mapping of a domain name hash to the domain details.
     */
    mapping(bytes32 => Domain) public domains;

    /**
     * @dev Event emitted when a domain name is registered.
     * @param domain Domain name registered.
     * @param owner Owner of the domain name.
     * @param expiresOn Unix timestamp of expiration.
     */
    event DomainRegistered(string domain, address owner, uint256 expiresOn);

    /**
     * @dev Event emitted when a domain name is transferred.
     * @param domain Domain name transferred.
     * @param newOwner New owner of the domain name.
     */
    event DomainTransferred(string domain, address newOwner);

    /**
     * @dev Register a domain.
     * @param domain Domain name to register.
     * @param domainOwner Address to associate with the domain name.
     */
    function registerDomain(string memory domain, address domainOwner) public {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        require(domains[domainHash].expiresOn < block.timestamp, "Domain is already registered");

        domains[domainHash] = Domain({
            owner: domainOwner,
            expiresOn: block.timestamp + REGISTRATION_PERIOD
        });

        emit DomainRegistered(domain, domainOwner, domains[domainHash].expiresOn);
    }

    /**
     * @dev Transfer a domain.
     * @param domain Domain name to transfer.
     * @param newOwner Address of the new owner to associate with the domain name.
     */
    function transferDomain(string memory domain, address newOwner) public {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        require(msg.sender == domains[domainHash].owner, "Only the domain owner can transfer the domain");
        domains[domainHash].owner = newOwner;

        emit DomainTransferred(domain, newOwner);
    }

    /**
     * @dev Check if a domain is registered.
     * @param domain Domain name to verify ownership.
     */
    function isDomainRegistered(string memory domain) public view returns (bool) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        return domains[domainHash].owner != address(0);
    }

}