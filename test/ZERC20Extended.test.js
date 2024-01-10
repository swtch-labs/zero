const ZERC20Extended = artifacts.require("ZERC20Extended");

contract("ZERC20Extended", accounts => {
    const [owner, spender] = accounts;
    let token;

    beforeEach(async () => {
        token = await ZERC20Extended.new("ZeroToken", "ZTK", web3.utils.toWei('1000', 'ether'));
    });

    it("should correctly increase the allowance", async () => {
        const initialAllowance = await token.allowance(owner, spender);
        const increaseAmount = web3.utils.toWei('100', 'ether');
        await token.increaseAllowance(spender, increaseAmount, { from: owner });
        const newAllowance = await token.allowance(owner, spender);
        assert.equal(
            newAllowance.toString(), 
            initialAllowance.add(new web3.utils.BN(increaseAmount)).toString(),
            "Allowance did not increase correctly"
        );
    });

    it("should correctly decrease the allowance", async () => {
        const setAllowance = web3.utils.toWei('200', 'ether');
        await token.approve(spender, setAllowance, { from: owner });
        const decreaseAmount = web3.utils.toWei('50', 'ether');
        await token.decreaseAllowance(spender, decreaseAmount, { from: owner });
        const newAllowance = await token.allowance(owner, spender);
        assert.equal(
            newAllowance.toString(), 
            new web3.utils.BN(setAllowance).sub(new web3.utils.BN(decreaseAmount)).toString(),
            "Allowance did not decrease correctly"
        );
    });

    it("should revert when trying to decrease allowance below zero", async () => {
        const decreaseAmount = web3.utils.toWei('1', 'ether');
        try {
            await token.decreaseAllowance(spender, decreaseAmount, { from: owner });
            assert.fail("The transaction should have reverted");
        } catch (error) {
            assert(error.message.includes("decreased allowance below zero"), "Incorrect revert reason");
        }
    });

});
