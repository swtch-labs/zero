const ZERC721Enumerable = artifacts.require("ZERC721Enumerable");

contract("ZERC721Enumerable", accounts => {
    const [deployer] = accounts;
    let zerc721EnumerableInstance;

    beforeEach(async () => {
        zerc721EnumerableInstance = await ZERC721Enumerable.new("TestToken", "TT");
    });

    it("should correctly track total supply", async () => {
        await zerc721EnumerableInstance.mint(deployer, 1, { from: deployer });
        await zerc721EnumerableInstance.mint(deployer, 2, { from: deployer });

        const totalSupply = await zerc721EnumerableInstance.totalSupply();
        assert.equal(totalSupply.toNumber(), 2, "Total supply is incorrect");
    });

    // it("should enumerate owned tokens", async () => {
    //     await zerc721EnumerableInstance.mint(deployer, 1, { from: deployer });
    //     await zerc721EnumerableInstance.mint(deployer, 2, { from: deployer });

    //     const firstTokenId = await zerc721EnumerableInstance.tokenOfOwnerByIndex(deployer, 0);
    //     const secondTokenId = await zerc721EnumerableInstance.tokenOfOwnerByIndex(deployer, 1);

    //     assert.equal(firstTokenId.toNumber(), 1, "First token ID is incorrect");
    //     assert.equal(secondTokenId.toNumber(), 2, "Second token ID is incorrect");
    // });

    // ... additional tests for non-existent indices, tokens of different owners, etc.
});
