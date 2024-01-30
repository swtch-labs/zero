const SimpleVesting = artifacts.require("SimpleVesting");
const helper = require('./utils.js');

contract("Finance SimpleVesting", (accounts) => {
    let simpleVestingInstance;
    const depositor = accounts[0];
    const beneficiary = accounts[1];
    const nonDepositor = accounts[2];
    const vestingDuration = 12; // months
    const totalVestment = web3.utils.toWei("12", "ether"); // Total 12 Ether, 1 Ether per month
    const oneMonthInSeconds = 30 * 24 * 60 * 60;

    beforeEach(async () => {
        simpleVestingInstance = await SimpleVesting.new(beneficiary, depositor, vestingDuration, totalVestment, { from: depositor });
        // Deposit happens at contract creation before these tests
        await simpleVestingInstance.deposit({ from: depositor, value: totalVestment });
    });

    describe("Constructor", () => {
        it("should set the correct beneficiary", async () => {
            const actualBeneficiary = await simpleVestingInstance.beneficiary();
            assert.equal(actualBeneficiary, beneficiary, "Beneficiary is not set correctly");
        }); 
    });

    describe("Deposit", () => {
        it("should allow the depositor to deposit funds", async () => {
            const contractBalance = await web3.eth.getBalance(simpleVestingInstance.address);
            assert.equal(contractBalance, totalVestment, "Deposit amount did not match");
        });

        it("should not allow a non-depositor to deposit funds", async () => {
            // Deploy a fresh instance of the contract for this test
            const freshInstance = await SimpleVesting.new(beneficiary, depositor, vestingDuration, totalVestment, { from: depositor });
    
            const initialContractBalance = await web3.eth.getBalance(freshInstance.address);
            assert.equal(initialContractBalance, 0, "Initial contract balance should be zero");
    
            const depositAmount = web3.utils.toWei("1", "ether");
    
            try {
                await freshInstance.deposit({ from: nonDepositor, value: depositAmount });
                assert.fail("Non-depositor should not be able to deposit funds");
            } catch (error) {
                assert.include(error.message, "revert", "Should revert with an error");
                assert.include(error.message, "Only depositor can perform this action", "Error message should contain 'Only depositor can perform this action'");
            }
    
            const finalContractBalance = await web3.eth.getBalance(freshInstance.address);
            assert.equal(finalContractBalance, 0, "Contract balance should not change after failed deposit attempt");
        });
    });

    describe("ClaimVestment", () => {
        
        it("should not allow claim if vesting period has not elapsed", async () => {
            try {
                await simpleVestingInstance.claimVestment({ from: beneficiary });
                assert.fail("Beneficiary should not be able to claim vestment before time");
            } catch (error) {
                assert.include(error.message, "At least one month should pass", "Error message should contain 'At least one month should pass'");
            }
        });        

        it("should allow claim after one month", async () => {
            await helper.advanceTimeAndBlock(oneMonthInSeconds); // Advance time by one month
            const initialBalance = await web3.eth.getBalance(beneficiary);
            await simpleVestingInstance.claimVestment({ from: beneficiary });
            const finalBalance = await web3.eth.getBalance(beneficiary);

            assert.isAbove(web3.utils.toBN(finalBalance).cmp(web3.utils.toBN(initialBalance)), 0, "Beneficiary balance should increase after claiming vestment");
        });
        
        it("should correctly calculate the claim amount after several months", async () => {
            const monthsToAdvance = 3;
            await helper.advanceTimeAndBlock(oneMonthInSeconds * monthsToAdvance); // Advance time by 3 months
        
            const initialBalance = await web3.eth.getBalance(beneficiary);
            const txInfo = await simpleVestingInstance.claimVestment({ from: beneficiary });
            const gasUsed = txInfo.receipt.gasUsed;
            const tx = await web3.eth.getTransaction(txInfo.tx);
            const gasPrice = tx.gasPrice;
            const gasCost = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasUsed));
        
            const finalBalance = await web3.eth.getBalance(beneficiary);
            const claimedAmount = web3.utils.toBN(finalBalance).add(gasCost).sub(web3.utils.toBN(initialBalance));
        
            const expectedClaimAmount = web3.utils.toWei("3", "ether"); // 3 Ether for 3 months
            assert.equal(claimedAmount.toString(), expectedClaimAmount, "Claimed amount should be equal to 3 Ether after 3 months");
        });
        
        it("should correctly calculate the claim amount after many months", async () => {
            const monthsToAdvance = 10;
            await helper.advanceTimeAndBlock(oneMonthInSeconds * monthsToAdvance); // Advance time by 10 months
        
            const initialBalance = await web3.eth.getBalance(beneficiary);
            const txInfo = await simpleVestingInstance.claimVestment({ from: beneficiary });
            const gasUsed = txInfo.receipt.gasUsed;
            const tx = await web3.eth.getTransaction(txInfo.tx);
            const gasPrice = tx.gasPrice;
            const gasCost = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasUsed));
        
            const finalBalance = await web3.eth.getBalance(beneficiary);
            const claimedAmount = web3.utils.toBN(finalBalance).add(gasCost).sub(web3.utils.toBN(initialBalance));
        
            const expectedClaimAmount = web3.utils.toWei("10", "ether"); // 10 Ether for 10 months
            assert.equal(claimedAmount.toString(), expectedClaimAmount, "Claimed amount should be equal to 3 Ether after 3 months");
        });
    });
});