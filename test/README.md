# ERC-20 Tests

ERC20 Smart Contract unit tests.

## Initialization
Before each test, a new instance of the token is deployed with a fixed initial supply.

## Test Token Allocation
The first test checks if all tokens are allocated to the initial holder's account.

## Test Transfer Functionality
The second test checks the functionality of the transfer function.

## Test Transfer Limits
The third test ensures that a transfer of more tokens than available in the sender's account fails.

## Approval and TransferFrom Tests
- Test that a user can approve another account to spend tokens on their behalf.
- Test that the transferFrom function works correctly after approval.
- Test that an account cannot spend more than what has been approved.
- Test changing the approved amount.

## Testing Events

Ensure that Transfer and Approval events are emitted correctly with the right values in all scenarios where they should be.

## Testing for Edge Cases

Transferring or approving 0 tokens.
Transferring or approving tokens to the zero address (0x0).
Transfers and approvals from and to the same account.

## Testing Failures

Transfers and approvals that exceed the balance.
Transfers from an unapproved account or exceeding the approved amount.
Repeated transfers that deplete the balance or approved amount.

## Testing Decimal Handling

Since ERC20 tokens can have decimals, it's important to test scenarios where tokens are divided into smaller units.
Testing Ownership and Admin Functions (if applicable):

If your token has ownership or admin functions (like minting or burning), you should test these thoroughly.

## Gas Usage Analysis:

Although not a traditional test, it's good practice to analyze the gas usage of your functions to understand and optimize the cost of contract interactions.