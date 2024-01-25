const RoleBasedAccessControl = artifacts.require("RoleBasedAccessControl");

contract("RoleBasedAccessControl", accounts => {
    const [admin, user1, user2] = accounts;
    const MINTER_ROLE = web3.utils.soliditySha3("MINTER_ROLE");
    let rbac;

    beforeEach(async () => {
        rbac = await RoleBasedAccessControl.new(admin);
    });

    it("should allow granting a role", async () => {
        await rbac.grantRole(MINTER_ROLE, user1, { from: admin });
        assert.isTrue(await rbac.hasRole(MINTER_ROLE, user1), "Role was not granted correctly");
    });

    it("should allow revoking a role", async () => {
        await rbac.grantRole(MINTER_ROLE, user1, { from: admin });
        await rbac.revokeRole(MINTER_ROLE, user1, { from: admin });
        assert.isFalse(await rbac.hasRole(MINTER_ROLE, user1), "Role was not revoked correctly");
    });

    it("should not allow unauthorized users to grant roles", async () => {
        try {
            await rbac.grantRole(MINTER_ROLE, user2, { from: user1 });
            assert.fail("Unauthorized user should not be able to grant roles");
        } catch (error) {
            assert(error.message.includes("revert"), "Expected revert error not received");
        }
    });

    it("should not allow unauthorized users to revoke roles", async () => {
        try {
            await rbac.revokeRole(MINTER_ROLE, user2, { from: user1 });
            assert.fail("Unauthorized user should not be able to revoke roles");
        } catch (error) {
            assert(error.message.includes("revert"), "Expected revert error not received");
        }
    });
});
