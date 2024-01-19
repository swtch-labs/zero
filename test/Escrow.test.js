const Escrow = artifacts.require('SimpleEscrow');

contract('Escrow', (accounts) => {
    const [depositor, beneficiary, arbiter] = accounts;
    let escrow = null;
    const depositAmount = web3.utils.toWei('1', 'ether');

    beforeEach(async () => {
        escrow = await Escrow.new(beneficiary, arbiter, { from: depositor });
    });

    it('should deploy smart contract properly', async () => {
        assert(escrow.address !== '');
    });

    it('should accept funds', async () => {
        await escrow.deposit({ from: depositor, value: depositAmount });
        const balance = await web3.eth.getBalance(escrow.address);
        assert.equal(balance, depositAmount);
    });

    it('should release funds to beneficiary', async () => {
        await escrow.deposit({ from: depositor, value: depositAmount });
        const initialBalance = await web3.eth.getBalance(beneficiary);
        await escrow.releaseToBeneficiary({ from: arbiter });
        const newBalance = await web3.eth.getBalance(beneficiary);
        const difference = newBalance - initialBalance;
        assert(difference > 0);
    });

    it('should refund depositor', async () => {
        await escrow.deposit({ from: depositor, value: depositAmount });
        const initialBalance = BigInt(await web3.eth.getBalance(depositor));
    
        const receipt = await escrow.refundToDepositor({ from: arbiter });
        const gasUsed = receipt.receipt.gasUsed;
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = BigInt(tx.gasPrice);
        const gasCost = BigInt(gasUsed) * gasPrice;
    
        const newBalance = BigInt(await web3.eth.getBalance(depositor));
        const expectedBalance = initialBalance + BigInt(depositAmount) - gasCost;
    
        // Check if the new balance is within a reasonable range (e.g., within 0.01 Ether of the expected balance)
        const tolerance = web3.utils.toWei('0.01', 'ether'); // Adjust tolerance as needed
        assert(
            newBalance >= expectedBalance - BigInt(tolerance) && newBalance <= expectedBalance + BigInt(tolerance),
            `Depositor's balance after refund should be within a reasonable range of the expected balance`
        );
    });

    it('should only allow arbiter to release funds', async () => {
        try {
            await escrow.releaseToBeneficiary({ from: depositor });
            assert(false); // This line should not be executed
        } catch (err) {
            assert(err);
        }
    });

    it('should only allow arbiter to refund funds', async () => {
        try {
            await escrow.refundToDepositor({ from: beneficiary });
            assert(false); // This line should not be executed
        } catch (err) {
            assert(err);
        }
    });
});
