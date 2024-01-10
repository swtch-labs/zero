const ZERC20Burnable = artifacts.require("ZERC20Burnable");

contract("ZERC20Burnable", accounts => {
    const [owner, approvedAccount] = accounts;
    let token;
    const initialSupply = web3.utils.toWei('1000', 'ether');

    beforeEach(async () => {
        token = await ZERC20Burnable.new("ZeroToken", "ZTK", initialSupply);
    });

    it("should burn tokens correctly", async () => {
        const burnAmount = web3.utils.toWei('100', 'ether');
        const initialOwnerBalance = await token.balanceOf(owner);
        const initialTotalSupply = await token.totalSupply();
    
        await token.burn(burnAmount, { from: owner });
    
        const newOwnerBalance = await token.balanceOf(owner);
        const newTotalSupply = await token.totalSupply();
    
        assert.equal(
            newOwnerBalance.toString(), 
            initialOwnerBalance.sub(new web3.utils.BN(burnAmount)).toString(),
            "Owner's balance did not decrease correctly"
        );
    
        assert.equal(
            newTotalSupply.toString(),
            initialTotalSupply.sub(new web3.utils.BN(burnAmount)).toString(),
            "Total supply did not decrease correctly"
        );
    });

    it("should burn tokens from an approved account correctly", async () => {
        const burnAmount = web3.utils.toWei('50', 'ether');
        await token.approve(approvedAccount, burnAmount, { from: owner });
    
        const initialOwnerBalance = await token.balanceOf(owner);
        const initialTotalSupply = await token.totalSupply();
    
        await token.burnFrom(owner, burnAmount, { from: approvedAccount });
    
        const newOwnerBalance = await token.balanceOf(owner);
        const newTotalSupply = await token.totalSupply();
    
        assert.equal(
            newOwnerBalance.toString(), 
            initialOwnerBalance.sub(new web3.utils.BN(burnAmount)).toString(),
            "Owner's balance did not decrease correctly"
        );
    
        assert.equal(
            newTotalSupply.toString(),
            initialTotalSupply.sub(new web3.utils.BN(burnAmount)).toString(),
            "Total supply did not decrease correctly"
        );
    });    

});
