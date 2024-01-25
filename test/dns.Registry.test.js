const Registry = artifacts.require("Registry");
const Registrar = artifacts.require("Registrar");
const Resolver = artifacts.require("Resolver");

contract("DNS Registry", accounts => {
    const [deployer, domainOwner, otherAccount] = accounts;
    let registry, registrar, resolver;

    beforeEach(async () => {
        // Deploy Registrar and Resolver contracts
        registrar = await Registrar.new({ from: deployer });
        resolver = await Resolver.new(deployer, { from: deployer });

        // Deploy Registry and pass the address of Registrar
        registry = await Registry.new(registrar.address, { from: deployer });
    });

    it("should allow a user to register an available domain", async () => {
        const domain = "astor.eth";
    
        await registrar.registerDomain(domain, domainOwner, { from: domainOwner });
        const domainInfo = await registrar.domains(web3.utils.keccak256(domain));
        
        assert.equal(domainInfo.owner, domainOwner, "Domain owner is not correct");
    
        // Check if the domain is registered
        const isRegistered = (await registrar.isDomainRegistered(domain));
        assert.isTrue(isRegistered, "The domain should be registered");
    });
    

    it("should set and get the correct owner of a domain", async () => {
        const domain = "astor.eth";
        
        await registrar.registerDomain(domain, domainOwner, { from: domainOwner });
        await registry.setOwner(domain, domainOwner, { from: domainOwner });

        const owner = await registry.getOwner(domain);
        assert.equal(owner, domainOwner, "The owner is not set correctly");
    });

    it("should set and get the correct resolver address", async () => {
        const domain = "astor.eth";
        await registrar.registerDomain(domain, domainOwner, { from: domainOwner });
        await registry.setResolver(domain, resolver.address, { from: domainOwner });

        const resolverAddress = await registry.getResolverAddress(domain);
        assert.equal(resolverAddress, resolver.address, "The resolver address is not set correctly");
    });

    it("should resolve a domain to the correct address", async () => {
        const domain = "astor.eth";
        const domainAddress = "0x0000000000000000000000000000000000000001";
        
        await registrar.registerDomain(domain, domainOwner, { from: domainOwner });
        await registry.setResolver(domain, resolver.address, { from: domainOwner });
        await resolver.setAddress(domain, domainAddress, { from: deployer });

        const resolvedAddress = await registry.resolveDomain(domain);
        assert.equal(resolvedAddress, domainAddress, "The domain does not resolve to the correct address");
    });

    // Additional tests can include checking access control, 
    // domain registration validations, and error handling.
});
