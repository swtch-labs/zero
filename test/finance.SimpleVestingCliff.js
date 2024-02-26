const CliffVesting = artifacts.require("SimpleVestingCliff");
const helper = require('./utils.js');

contract("SimpleVestingCliff", accounts => {
    let cliffVestingInstance;
    const beneficiary = accounts[1];
    const owner = accounts[0];
    const totalValue = web3.utils.toWei("10");

    // Deploy the contract
    beforeEach(async () => {
        cliffVestingInstance = await CliffVesting.new(beneficiary, owner, 3600, totalValue); // 1 hour cliff, 10 wei
        // Deposit happens at contract creation before these tests
        await cliffVestingInstance.deposit({ from: owner, value: totalValue, gas: 500000, gasPrice: web3.utils.toWei("10", "gwei") });        
    });

    it("should deploy the contract with correct parameters", async () => {
        const beneficiaryAddress = await cliffVestingInstance.beneficiary();
        const cliffEnd = await cliffVestingInstance.cliffEnd();
        const totalAmount = await cliffVestingInstance.totalAmount();
        const vested = await cliffVestingInstance.vested();

        assert.equal(beneficiaryAddress, beneficiary, "Beneficiary address is incorrect");
        assert.equal(cliffEnd > 0, true, "Cliff end time not set");
        assert.equal(totalAmount.toString(), totalValue, "Total amount is incorrect");
        assert.equal(vested, false, "Vested flag should be false initially");
    });

    it("should not allow non-beneficiary to claim vested amount", async () => {
        await expectRevert(
            cliffVestingInstance.claimVestedAmount({ from: owner }),
            "Only beneficiary can perform this action"
        );
    });

    it("should not allow claiming vested amount before cliff end", async () => {
        await expectRevert(
            cliffVestingInstance.claimVestedAmount({ from: beneficiary }),
            "Cliff duration not elapsed"
        );
    });

    it("should allow beneficiary to claim vested amount after cliff end", async () => {
        
        // Advance time to simulate cliff end
        await helper.advanceTimeAndBlock(3601);

        const initialBalance = await web3.eth.getBalance(beneficiary);
        
        await cliffVestingInstance.claimVestedAmount({ from: beneficiary });
        
        const finalBalance = await web3.eth.getBalance(beneficiary);

        assert(finalBalance > initialBalance, "Balance not increased after claiming vested amount");
    });
});


// Helper function to catch revert errors
const expectRevert = async (promise, errorMessage) => {
    try {
        await promise;
    } catch (error) {
        assert(error.message.includes(errorMessage), `Expected "${errorMessage}" but got "${error.message}" instead`);
        return;
    }
    assert.fail("Expected revert not received");
};
