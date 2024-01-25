const Resolver = artifacts.require("Resolver");

contract("DNS Resolver", accounts => {
    const [owner, user] = accounts;
    let resolver;

    beforeEach(async () => {
        resolver = await Resolver.new(owner);
    });

    it("should allow the owner to set an address", async () => {
        const domain = "astor.eth";
        const address = "0x0000000000000000000000000000000000000001";

        await resolver.setAddress(domain, address, { from: owner });
        const result = await resolver.getAddress(domain);

        assert.equal(result, address, "The address was not set correctly");
    });

    it("should not allow a non-owner to set an address", async () => {
        try {
            const domain = "astor.eth";
            const address = "0x0000000000000000000000000000000000000001";
            
            await resolver.setAddress(domain, address, { from: user });
            assert.fail("Non-owner was able to set the address");
        } catch (error) {
            assert.include(error.message, "revert", "Expected revert error not received");
        }
    });
});
