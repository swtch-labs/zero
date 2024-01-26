const MultiEscrow = artifacts.require("MultiEscrow");

contract("MultiEscrow", accounts => {
    const [deployer, beneficiary, arbiter, otherAccount] = accounts;
    let escrowInstance;

    beforeEach(async () => {
        escrowInstance = await MultiEscrow.new(deployer);
    });

    it("should allow creating a new escrow", async () => {
        const tx = await escrowInstance.createEscrow(beneficiary, arbiter, { from: deployer });
        assert.equal(tx.logs[0].args.escrowId.toNumber(), 0, "Escrow ID should be 0");
        assert.equal(tx.logs[0].args.depositor, deployer, "Depositor should match deployer");
    });

    it("should allow depositor to deposit funds", async () => {
        const escrowId = (await escrowInstance.createEscrow(beneficiary, arbiter, { from: deployer })).logs[0].args.escrowId;
        await escrowInstance.deposit(escrowId, { from: deployer, value: web3.utils.toWei("1", "ether") });
        const balance = await escrowInstance.getEscrowBalance(escrowId);
        const expectedBalance = web3.utils.toWei("1", "ether") * 0.98; // Adjust for 2% fee
        assert.equal(balance.toString(), expectedBalance.toString(), "Balance should be 98% of 1 ether");
    });

    it("should allow arbiter to release funds to beneficiary", async () => {
        const escrowId = (await escrowInstance.createEscrow(beneficiary, arbiter, { from: deployer })).logs[0].args.escrowId;
        await escrowInstance.deposit(escrowId, { from: deployer, value: web3.utils.toWei("1", "ether") });
        const initialBalance = await web3.eth.getBalance(beneficiary);
        await escrowInstance.releaseToBeneficiary(escrowId, { from: arbiter });
        const newBalance = await web3.eth.getBalance(beneficiary);
        assert.isTrue(new web3.utils.BN(newBalance).gt(new web3.utils.BN(initialBalance)), "Beneficiary should receive funds");
    });

    it("should allow arbiter to refund funds to depositor", async () => {
        const escrowId = (await escrowInstance.createEscrow(beneficiary, arbiter, { from: deployer })).logs[0].args.escrowId;
        await escrowInstance.deposit(escrowId, { from: deployer, value: web3.utils.toWei("1", "ether") });
        const initialBalance = await web3.eth.getBalance(deployer);
        await escrowInstance.refundToDepositor(escrowId, { from: arbiter });
        const newBalance = await web3.eth.getBalance(deployer);
        assert.isTrue(new web3.utils.BN(newBalance).gt(new web3.utils.BN(initialBalance)), "Depositor should receive funds");
    });

    it("should prevent non-depositors from depositing", async () => {
        const escrowId = (await escrowInstance.createEscrow(beneficiary, arbiter, { from: deployer })).logs[0].args.escrowId;
        try {
            await escrowInstance.deposit(escrowId, { from: otherAccount, value: web3.utils.toWei("1", "ether") });
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    });

    it("should allow deployer to withdraw fees", async () => {
        // Create an escrow and deposit funds (this will generate fees)
        const escrowId = (await escrowInstance.createEscrow(beneficiary, arbiter, { from: deployer })).logs[0].args.escrowId;
        const depositAmount = web3.utils.toWei("1", "ether");
        await escrowInstance.deposit(escrowId, { from: deployer, value: depositAmount });
    
        // Calculate expected fees
        const feePercentage = await escrowInstance.feePercentage();
        const expectedFees = web3.utils.toBN(depositAmount).mul(web3.utils.toBN(feePercentage)).div(web3.utils.toBN(100));
    
        // Get initial and final balances, and calculate the transaction cost
        const initialDeployerBalance = web3.utils.toBN(await web3.eth.getBalance(deployer));
        const tx = await escrowInstance.withdrawFees({ from: deployer });
        const gasUsed = web3.utils.toBN(tx.receipt.gasUsed);
        const txReceipt = await web3.eth.getTransaction(tx.tx);
        const gasPrice = web3.utils.toBN(txReceipt.gasPrice);
        const txCost = gasUsed.mul(gasPrice);
        const finalDeployerBalance = web3.utils.toBN(await web3.eth.getBalance(deployer));
    
        // Calculate the expected final balance
        const expectedFinalBalance = initialDeployerBalance.add(expectedFees).sub(txCost);
    
        assert(finalDeployerBalance.eq(expectedFinalBalance), "Deployer should withdraw the correct amount of fees");
    });
    
});