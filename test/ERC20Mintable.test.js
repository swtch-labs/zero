const ERC20Mintable = artifacts.require("ERC20Mintable");

contract("ERC-20 Mintable", accounts => {
    const [owner, recipient] = accounts;
    let token;

    beforeEach(async () => {
        token = await ERC20Mintable.new("ZeroToken", "ZTK", web3.utils.toWei('1000', 'ether'));
    });

    it("should mint tokens correctly", async () => {
        const mintAmount = web3.utils.toWei('100', 'ether');
        const initialTotalSupply = await token.totalSupply();
        const initialRecipientBalance = await token.balanceOf(recipient);

        await token.mint(recipient, mintAmount);

        const newTotalSupply = await token.totalSupply();
        const newRecipientBalance = await token.balanceOf(recipient);

        assert.equal(
            newTotalSupply.toString(), 
            initialTotalSupply.add(new web3.utils.BN(mintAmount)).toString(),
            "Total supply did not increase correctly"
        );

        assert.equal(
            newRecipientBalance.toString(), 
            initialRecipientBalance.add(new web3.utils.BN(mintAmount)).toString(),
            "Recipient balance did not increase correctly"
        );
    });

    // Additional tests can be added here, e.g., testing access control for the mint function
});
