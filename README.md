# Zero Smart Contracts

A set of useful smart contract utilities.

We dont use SafeMath, since as of Solidity 0.8.x and above arithmetic operations are safely handled. 

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

## Smart Contracts

- access  : Smart contracts related to role based access.
- finance : Smart contracts related to financial instrumentation.
- token   : Smart contracts related to ERC token specifications, such as ERC20 and ERC721.

## Access
Smart Contracts
- ZRoleBasedAccessControl
  
## Finance
Smart Contracts
- PaymentChannel : Unidirectional payment channel.
- ProofOfFunds : Proof of funds.
- SimpleEscrow : Escrow which provides a one-time use escrow.
  
## Token
Smart Contracts
- ZERC20 : ERC 20 implementation.
- ZERC20Burnable : ERC 20 with burn capabilities.
- ZERC20Extended : ERC 20 with allowance capabilities.
- ZERC20Mintable : ERC 20 with mintable capabilities.
- ZERC20Pausable : ERC 20 with pausable capabilities.
- ZERC721 : ERC 721 implementation.
- ZERC721Burnable : ERC 721 with burn capabilities.
- ZERC721Enumerable : ERC 721 with enumeration capabilities.
- ZERC721Metadata : ERC 721 with metadata token uri capabilities.
- ZERC721Receiver : ERC 721 with receiver capabilities.

## In Progress 
Smart Contracts we are building next.
- ERC20Escrow : ERC20 token simple one-time use escrow.
- ERC20ProofOfFunds : ERC20 token proof of funds.
- MultiEscrow : Smart contract which can support many Escrow items for Eth.
- ERC721Burnable : Finish the smart contract which can support burning ERC 721 tokens.
