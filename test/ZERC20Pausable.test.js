const ZERC20Pausable = artifacts.require("ZERC20Pausable");

contract("ZERC20Pausable", accounts => {
    const [owner, recipient, anotherAccount] = accounts;
    let tokenInstance;

    beforeEach(async () => {
        tokenInstance = await ZERC20Pausable.new("ZeroToken", "ZTK", '1000');
    });

    it("should assign the initial total supply to the owner", async () => {
        const mintAmount = web3.utils.toWei('1000', 'ether');
        const balance = await tokenInstance.balanceOf(owner);
        assert.equal(balance.toString(), mintAmount.toString(), "Initial supply was not assigned to the owner");
    });

    it("should transfer token correctly", async () => {
        // Transfer 10 tokens from owner to recipient
        await tokenInstance.transfer(recipient, 10, { from: owner });

        const balance = await tokenInstance.balanceOf(recipient);
        assert.equal(balance.toNumber(), 10, "Recipient did not receive the tokens");
    });

    it("should correctly set allowance for another account", async () => {
        const allowanceAmount = 50;
        await tokenInstance.approve(recipient, allowanceAmount, { from: owner });
    
        const allowance = await tokenInstance.allowance(owner, recipient);
        assert.equal(allowance.toNumber(), allowanceAmount, "Allowance was not correctly set");
    });

    it("should transfer tokens from one account to another", async () => {
        const transferAmount = 30;
        await tokenInstance.approve(anotherAccount, transferAmount, { from: owner });
        await tokenInstance.transferFrom(owner, recipient, transferAmount, { from: anotherAccount });
    
        const balance = await tokenInstance.balanceOf(recipient);
        assert.equal(balance.toNumber(), transferAmount, "Tokens were not transferred correctly");
    });

    it("should not transfer more than the approved amount", async () => {
        const approveAmount = 20;
        const transferAmount = 30;
        await tokenInstance.approve(anotherAccount, approveAmount, { from: owner });
    
        try {
            await tokenInstance.transferFrom(owner, recipient, transferAmount, { from: anotherAccount });
            assert.fail("The transfer should have thrown an error");
        } catch (error) {
            assert.include(error.message, "Insufficient allowance", "Did not throw correct error");
        }
    });

    it("should pause and unpause the contract", async () => {
        await tokenInstance.pause({ from: owner });
        let paused = await tokenInstance.isPaused();
        assert.equal(paused, true, "Contract should be paused");
    
        await tokenInstance.unpause({ from: owner });
        paused = await tokenInstance.isPaused();
        assert.equal(paused, false, "Contract should be unpaused");
    });
    
    it("should not allow transfers when paused", async () => {
        await tokenInstance.pause({ from: owner });
        try {
            await tokenInstance.transfer(recipient, 10, { from: owner });
            assert.fail("The transfer should have thrown an error");
        } catch (error) {
            assert.include(error.message, "paused", "Transfer did not throw correct error");
        }
    });

    it("should only allow owner to pause and unpause the contract", async () => {
        try {
            await tokenInstance.pause({ from: anotherAccount });
            assert.fail("Pause should only be allowed by owner");
        } catch (error) {
            assert.include(error.message, "Caller is not the owner", "Pause did not throw correct error");
        }
    });
});
