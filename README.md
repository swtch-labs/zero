# Zero Smart Contracts

Set of useful smart contract utilities.

Smart contracts have not undergone any audits to date.

## ERC-20

We dont use SafeMath, since as of Solidity 0.8.x and above arithmetic operations are safely handled. 

Core functionalities:

- totalSupply(): Provides information about the total token supply.
- balanceOf(address): Provides the number of tokens held by a given address.
- transfer(address, uint256): Transfers a number of tokens directly from the message sender to another address.
- approve(address, uint256): Allows a spender to withdraw a specific number of tokens from the message sender's account.
- allowance(address, address): Returns the number of tokens allowed by an owner to a spender.
- transferFrom(address, address, uint256): Transfers a number of tokens from one address to another using the allowance mechanism.
- Emitting Transfer and Approval events.
