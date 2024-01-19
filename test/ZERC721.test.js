const ZERC721 = artifacts.require("ZERC721");
const ZERC721Receiver = artifacts.require("ERC721Receiver");

contract("ZERC721", (accounts) => {
    const [deployer, recipient, anotherAccount] = accounts;
    let zerc721Instance;
    let receiverInstance;

    beforeEach(async () => {
        zerc721Instance = await ZERC721.new("ZeroNFT", "ZNFT");
        receiverInstance = await ZERC721Receiver.new();
    });

    it("should mint a token successfully", async () => {
        await zerc721Instance.mint(recipient, 1, { from: deployer });
    
        const owner = await zerc721Instance.ownerOf(1);
        assert.equal(owner, recipient, "The owner of the minted token is incorrect");
    });

    it("should transfer a token successfully", async () => {
        await zerc721Instance.mint(recipient, 1, { from: deployer });
        await zerc721Instance.transfer(anotherAccount, 1, { from: recipient });
    
        const newOwner = await zerc721Instance.ownerOf(1);
        assert.equal(newOwner, anotherAccount, "Token ownership did not change correctly");
    });

    it("should approve another account to transfer a token", async () => {
        await zerc721Instance.mint(recipient, 1, { from: deployer });
        await zerc721Instance.approve(anotherAccount, 1, { from: recipient });
    
        const approvedAccount = await zerc721Instance.getApproved(1);
        assert.equal(approvedAccount, anotherAccount, "The approved account is incorrect");
    });

    it("should safely transfer a token", async () => {
        await zerc721Instance.mint(deployer, 1, { from: deployer });
        await zerc721Instance.safeTransferFrom(deployer, receiverInstance.address, 1, { from: deployer });

        const newOwner = await zerc721Instance.ownerOf(1);
        assert.equal(newOwner, receiverInstance.address, "Safe transfer did not occur correctly");
    });

});
