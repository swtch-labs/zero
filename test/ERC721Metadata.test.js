const ERC721Metadata = artifacts.require("ERC721Metadata");

contract("ERC-721 Metadata", (accounts) => {
    const [deployer] = accounts;
    let zerc721MetadataInstance;

    beforeEach(async () => {
        zerc721MetadataInstance = await ERC721Metadata.new("TestToken", "TT");
    });

    it("should set correct token URI for a token", async () => {
        const tokenId = 1;
        const expectedTokenURI = "https://example.com/" + tokenId;

        // Assuming you have a mint function that also sets the token URI
        await zerc721MetadataInstance.mintWithTokenURI(deployer, tokenId, expectedTokenURI, { from: deployer });
        const tokenURI = await zerc721MetadataInstance.tokenURI(tokenId);

        assert.equal(tokenURI, expectedTokenURI, "Token URI was not set correctly");
    });

    // ... additional tests for different URIs, non-existent tokens, etc.
});