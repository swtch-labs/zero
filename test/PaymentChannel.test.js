const PaymentChannel = artifacts.require("PaymentChannel");

contract("PaymentChannel", (accounts) => {
    let paymentChannel;
    const duration = 60 * 60 * 24; // 1 day in seconds
    let sender = accounts[0]; // Use a predefined account for the sender
    let receiverAccount, receiver;

    before(async () => {
        // Create sender and receiver accounts
        receiverAccount = web3.eth.accounts.create();
        receiver = receiverAccount.address;

        // Fund the newly created accounts using one of the default accounts
        const fundAmount = web3.utils.toWei('2', 'ether');
        await web3.eth.sendTransaction({ from: accounts[0], to: sender, value: fundAmount });
        await web3.eth.sendTransaction({ from: accounts[0], to: receiver, value: fundAmount });
    });

    beforeEach(async () => {
        const depositAmount = web3.utils.toWei('1', 'ether');
        paymentChannel = await PaymentChannel.new(receiver, duration, { from: sender, value: depositAmount });
    });

    it('should deploy the PaymentChannel contract properly', async () => {
        assert(paymentChannel.address !== '');
        const channelBalance = await web3.eth.getBalance(paymentChannel.address);
        assert.equal(channelBalance, web3.utils.toWei('1', 'ether'));
    });

    // Additional helper function to sign payments
    async function signPayment(amount, account) {
        const message = web3.utils.soliditySha3(
            { t: 'address', v: paymentChannel.address },
            { t: 'uint256', v: amount }
        ).toString('hex');
        
        const sig = await web3.eth.accounts.sign(message, account).signature;
        return sig;
    }

    // TODO Broken test 
    // it('should allow closing channel with valid signature', async () => {
    //     const amount = web3.utils.toWei('0.5', 'ether');
    //     const signature = await signPayment(amount, sender);
    //     await paymentChannel.methods.close(amount, signature).send({ from: receiver, gas: 5000000 });
    //     // Additional assertions to check the final state...
    // });
});
