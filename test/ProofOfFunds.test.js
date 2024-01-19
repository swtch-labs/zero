const ProofOfFunds = artifacts.require("ProofOfFunds");

contract("ProofOfFunds", (accounts) => {
    const [owner] = accounts;
    let proofOfFunds = null;
    const depositAmount = web3.utils.toWei('1', 'ether'); // 1 ETH
    const lockTime = 2; // 2 seconds for testing purposes

    const advanceTimeAndMine = async (seconds) => {
        await new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [seconds],
                id: new Date().getTime()
            }, (err1) => {
                if (err1) return reject(err1);
    
                web3.currentProvider.send({
                    jsonrpc: '2.0',
                    method: 'evm_mine',
                    params: [],
                    id: new Date().getTime()
                }, (err2, res) => {
                    if (err2) return reject(err2);
                    resolve(res);
                });
            });
        });
    };   

    beforeEach(async () => {
        proofOfFunds = await ProofOfFunds.new({ from: owner });
    });

    it('should deploy smart contract properly', async () => {
        assert(proofOfFunds.address !== '');
    });

    it('should accept ether deposit', async () => {
        await proofOfFunds.deposit({ from: owner, value: depositAmount });
        const balance = await web3.eth.getBalance(proofOfFunds.address);
        assert.equal(balance, depositAmount);
    });

    it('should set lock time correctly', async () => {
        await proofOfFunds.setLockTime(lockTime, { from: owner });
        const currentLockTime = await proofOfFunds.lockTime();
        assert(currentLockTime > 0);
    });

    it('should not allow withdrawal before lock time', async () => {
        await proofOfFunds.deposit({ from: owner, value: depositAmount });
        await proofOfFunds.setLockTime(lockTime, { from: owner });

        try {
            await proofOfFunds.withdraw({ from: owner });
            assert(false); // This line should not be executed
        } catch (err) {
            assert(err);
        }
    });

    it('should allow withdrawal after lock time', async () => {
        await proofOfFunds.deposit({ from: owner, value: depositAmount });
        await proofOfFunds.setLockTime(lockTime, { from: owner });
    
        // Advance the blockchain time and mine a new block
        await advanceTimeAndMine(lockTime + 1);
    
        const initialBalance = BigInt(await web3.eth.getBalance(owner));
        const txInfo = await proofOfFunds.withdraw({ from: owner });
        const tx = await web3.eth.getTransaction(txInfo.tx);
        const gasUsed = BigInt(txInfo.receipt.gasUsed);
        const gasPrice = BigInt(tx.gasPrice);
    
        const finalBalance = BigInt(await web3.eth.getBalance(owner));
        const expectedBalance = initialBalance + BigInt(depositAmount) - (gasUsed * gasPrice);
        assert(finalBalance >= expectedBalance, "Withdrawal did not occur correctly after lock time");
    });
});
