const SimpleVesting = artifacts.require("SimpleVesting");
const helper = require('./utils.js');

contract("Finance SimpleVesting - Edge Cases", (accounts) => {
    const depositor = accounts[0];
    const beneficiary = accounts[1];
    const vestingDuration = 12; // months
    const totalVestment = web3.utils.toWei("12", "ether"); // 12 Ether
    const oneMonthInSeconds = 30 * 24 * 60 * 60; // Approximation

    describe("Initialization with Invalid Parameters", () => {
        it("should fail to initialize with zero vesting duration", async () => {
            try {
                await SimpleVesting.new(beneficiary, depositor, 0, totalVestment);
                assert.fail("Contract should not initialize with zero vesting duration");
            } catch (error) {
                assert.include(error.message, "revert", "Should revert with error");
            }
        });

        it("should fail to initialize with zero total vestment", async () => {
            try {
                await SimpleVesting.new(beneficiary, depositor, vestingDuration, 0);
                assert.fail("Contract should not initialize with zero total vestment");
            } catch (error) {
                assert.include(error.message, "revert", "Should revert with error");
            }
        });
    });

    describe("Interactions with Insufficient Balance", () => {
        it("should fail to claim if the contract has insufficient balance", async () => {
            const instance = await SimpleVesting.new(beneficiary, depositor, vestingDuration, totalVestment);
            await helper.advanceTimeAndBlock(oneMonthInSeconds); // Advance time by one month

            try {
                await instance.claimVestment({ from: beneficiary });
                assert.fail("Claim should fail due to insufficient balance");
            } catch (error) {
                assert.include(error.message, "revert", "Should revert with insufficient balance error");
            }
        });
    });

    describe("Claim More Than What Is Due", () => {
        it("should not allow beneficiary to claim more than due", async () => {
            const instance = await SimpleVesting.new(beneficiary, depositor, vestingDuration, totalVestment);
            await instance.deposit({ from: depositor, value: totalVestment });
            await helper.advanceTimeAndBlock(oneMonthInSeconds * 15); // Advance time beyond vesting duration

            try {
                await instance.claimVestment({ from: beneficiary });
                assert.fail("Beneficiary should not be able to claim more than total vestment");
            } catch (error) {
                assert.include(error.message, "revert", "Should revert when trying to claim more than total vestment");
            }
        });
    });

    describe("Claiming After All Vestments Have Been Claimed", () => {
        it("should not allow claiming after all vestments have been claimed", async () => {
            const instance = await SimpleVesting.new(beneficiary, depositor, vestingDuration, totalVestment);
            await instance.deposit({ from: depositor, value: totalVestment });
            await helper.advanceTimeAndBlock(oneMonthInSeconds * 12); // Advance time by 12 months

            // Claim all vestments
            await instance.claimVestment({ from: beneficiary });

            try {
                // Attempt to claim again
                await instance.claimVestment({ from: beneficiary });
                assert.fail("Beneficiary should not be able to claim after all vestments have been claimed");
            } catch (error) {
                assert.include(error.message, "revert", "Should revert when there's nothing left to claim");
            }
        });
    });
});
