# Finance 

## Smart Contracts
- MultiEscrow
- PaymentChannel
- ProofOfFunds
- SimpleEscrow
- SimpleVesting

## Non-Smart Contract Proof Of Funds
To demonstrate proof of funds using Ethereum, you can follow the process of signing a message with your private key
and then verifying the signed message.

This process can confirm that a particular Ethereum address holds a certain amount of funds,
without actually moving the funds and incurring any transaction fees.

### Step 1 : Create a Message
Create a simple message you will sign with your private key. For example :
```sh
Verifying that I control address [your Ethereum address] on [current date].
```

### Step 2: Sign the Message
To sign the message in this example we will use Metamask.
1. Open MetaMask and ensure you are logged in.
2. Select the account from which you want to sign the message.
3. Click on the account name at the top to open the account details.
4. Look for an option to sign a message. This may be found under "Account Options" or a similar menu.
5. Paste your message into the input field provided and sign it. MetaMask will generate a signature without making a transaction.

### Step 3: Distribute the Signed Message
After signing the message, you will receive as output a string of characters, these characters represent the signature. 
Share this signed message and your Ethereum address with the party requesting proof of funds.

### Step 4: Verify the Signature
The party wanting to verify your proof of funds can then take the signature and the message to confirm that it was signed by the private key associated with your public Ethereum address. 
This process can be done using various tools or programmatically using Web3.js.

```js
const Web3 = require('web3');

// Initialize web3 instance
const web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

// The original message that was signed
const originalMessage = "Verifying that I control address [your Ethereum address] on [current date].";
const signature = "0x..."; // The signature you received
const address = "[the sender's Ethereum address]";

// Recover the address from the signature
const signingAddress = web3.eth.accounts.recover(originalMessage, signature);

// Check if the recovered address matches the expected address
if (signingAddress.toLowerCase() === address.toLowerCase()) {
  console.log("The signature is valid and matches the address:", address);
} else {
  console.log("The signature does not match the address provided.");
}
```

The process of using Metamask to sign and Web3 to verify provides a non-transactional approach to demonstrate control over an Ethereum address, and control over the funds.
