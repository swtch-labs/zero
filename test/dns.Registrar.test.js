const Registrar = artifacts.require("Registrar");

contract("DNS Registrar", accounts => {
    const [owner, user] = accounts;
    let registrar;

    beforeEach(async () => {
        registrar = await Registrar.new();
    });

    it("should allow a user to register an available domain", async () => {
        const domain = "astor.eth";

        await registrar.registerDomain(domain, user, { from: user });
        const domainInfo = await registrar.domains(web3.utils.keccak256(domain));
        
        assert.equal(domainInfo.owner, user, "Domain owner is not correct");
    });

    it("should not allow to register an already registered domain", async () => {
        const domain = "astor.eth";
        
        await registrar.registerDomain(domain, user, { from: user });
        try {
            await registrar.registerDomain(domain, owner, { from: owner });
            assert.fail("Was able to register an already registered domain");
        } catch (error) {
            assert.include(error.message, "revert", "Expected revert error not received");
        }
    });

    it("should allow the domain owner to transfer the domain", async () => {
        const domain = "astor.eth";
        await registrar.registerDomain(domain, user, { from: user });

        await registrar.transferDomain(domain, owner, { from: user });
        const domainInfo = await registrar.domains(web3.utils.keccak256(domain));
        
        assert.equal(domainInfo.owner, owner, "Domain owner transfer failed");
    });
});
