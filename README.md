# Zero Smart Contracts

A set of useful smart contract utilities.

We do not utilize SafeMath. 
As of Solidity 0.8.x and above arithmetic operations are safely handled. 

Note: Smart contracts have not undergone any audits to date. Use at your own risk until we have completed the audits.

## Setup
We use Truffle to manage compilation and testing.

```sh
npm install -g truffle
```

Compile smart contracts
```sh
truffle compile
```

Test smart contracts
```sh
truffle test
```

## Smart Contract Contexts

- access  : Smart contracts related to role based access.
- dns     : Smart contracts related to domain name systems.
- finance : Smart contracts related to financial instrumentation.
- token   : Smart contracts related to ERC token specifications, such as ERC20 and ERC721.

## Access
Smart Contracts
- RoleBasedAccessControl : Ownership implementation.

## DNS
Smart Contracts
- Registry : Central smart contract that manages all domain names and their owners. It maps human-readable names to machine-readable identifiers.
- Resolver : Translates names into addresses or other relevant information. It's where the actual resolution of names happens.
- Registrar : Smart contract manages the allocation of subdomains under a top-level domain. For instance, 'alice.mydomain.eth' would be handled here.
  
## Finance
Smart Contracts
- PaymentChannel : Unidirectional payment channel.
- ProofOfFunds : Proof of funds.
- SimpleEscrow : Escrow smart contract which provides a one-time use escrow.
- MultiEscrow : Escrow smart contract which provides support many Escrow items and fee structure.
  
## ERC-20 Token
Smart Contracts
- ERC20 : ERC 20 implementation.
- ERC20Burnable : ERC 20 with burn capabilities. (Incomplete)
- ERC20Extended : ERC 20 with allowance capabilities.
- ERC20Mintable : ERC 20 with mintable capabilities.
- ERC20Pausable : ERC 20 with pausable capabilities.

## ERC-721 Token
Smart Contracts
- ERC721 : ERC 721 implementation.
- ERC721Burnable : ERC 721 with burn capabilities.
- ERC721Enumerable : ERC 721 with enumeration capabilities.
- ERC721Metadata : ERC 721 with metadata token uri capabilities.
- ERC721Receiver : ERC 721 with receiver capabilities.

## In Progress 
Smart Contracts we are building next.

- ERC20Escrow : ERC20 token simple one-time use escrow.
- ERC20ProofOfFunds : ERC20 token proof of funds.
- ERC721Burnable : Finish the smart contract which can support burning ERC 721 tokens.
- ERC-1155 : ERC1155 multi-token implementation.
