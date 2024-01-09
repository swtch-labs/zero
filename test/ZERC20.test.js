const MyToken = artifacts.require("ZERC20");

contract("MyToken", accounts => {
    const [initialHolder, recipient, anotherAccount] = accounts;
    const BigNumber = web3.utils.BN;
    const initialSupply = new BigNumber(1000).mul(new BigNumber(10).pow(new BigNumber(18)));
    
    beforeEach(async () => { 
        this.myToken = await MyToken.new("ZeroToken", "ZTK", '1000');
    });

    // Testing balance
    it("All tokens should be in my account on contract creation", async () => {
        let balance = await this.myToken.balanceOf(initialHolder);
        assert.equal(balance.toString(), initialSupply.toString(), "Initial holder doesn't hold all tokens");
    });    

    // Testing transfer
    it("I can send tokens from Account 1 to Account 2", async () => {
        const sendTokens = 1;
        await this.myToken.transfer(recipient, sendTokens, { from: initialHolder });
        let balance = await this.myToken.balanceOf(recipient);
        assert.equal(balance.valueOf(), sendTokens, "Didn't correctly send tokens");
    });

    // Testing excess
    it("It's not possible to send more tokens than account 1 has", async () => {
        try {
            const excessiveAmount = new web3.utils.BN('1001').mul(new web3.utils.BN('10').pow(new web3.utils.BN('18')));
            await this.myToken.transfer(recipient, excessiveAmount, { from: initialHolder });
            assert.fail();
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        }
    });

    // Testing approvals
    it("should handle approvals correctly", async () => {
        let amount = 100;
        await this.myToken.approve(recipient, amount, { from: initialHolder });
        let allowance = await this.myToken.allowance(initialHolder, recipient);
        assert.equal(allowance, amount, "Allowance wasn't correctly set");
    
        await this.myToken.transferFrom(initialHolder, anotherAccount, amount, { from: recipient });
        let balanceRecipient = await this.myToken.balanceOf(recipient);
        let balanceAnotherAccount = await this.myToken.balanceOf(anotherAccount);
    
        assert.equal(balanceRecipient, 0, "Recipient should have 0 balance");
        assert.equal(balanceAnotherAccount, amount, "Another account didn't receive the tokens");
    });
    
    // Testing Events
    it("should emit Transfer event on transfer", async () => {
        let transfer = await this.myToken.transfer(recipient, 100, { from: initialHolder });
        assert.equal(transfer.logs[0].event, "Transfer", "Transfer event not emitted");
    });
    
    it("should emit Approval event on approve", async () => {
        let approval = await this.myToken.approve(recipient, 100, { from: initialHolder });
        assert.equal(approval.logs[0].event, "Approval", "Approval event not emitted");
    });
    
    // Testing Edge Cases
    it("should not allow transferring to the zero address", async () => {
        try {
            await this.myToken.transfer("0x0000000000000000000000000000000000000000", 100, { from: initialHolder });
            assert.fail("Transfer to the zero address did not fail as expected");
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "Expected revert error not received");
            assert(error.message.includes("Transfer to the zero address is not allowed"), "Unexpected revert reason");
        }
    });

    // Testing failures
    it("should not allow transferring more than balance", async () => {
        try {
            const excessiveAmount = new web3.utils.BN('2000').mul(new web3.utils.BN('10').pow(new web3.utils.BN('18')));
            await this.myToken.transfer(recipient, excessiveAmount, { from: initialHolder });
            assert.fail();
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "Should throw revert error");
        }
    });
    
    // Testing decimal handling
    it("should handle transfers with decimals correctly", async () => {
        let initialSupply = '1000';
        this.myToken = await MyToken.new("ZeroToken", "ZTK", initialSupply);
    
        let transferAmount = web3.utils.toWei('0.1', 'ether'); // 0.1 tokens
        await this.myToken.transfer(recipient, transferAmount, { from: initialHolder });
    
        let balance = await this.myToken.balanceOf(recipient);
        assert.equal(balance.toString(), transferAmount, "Decimal transfer did not occur correctly");
    });

    // Gas Usage Analysis
    it("should have reasonable gas costs for transfers", async () => {
        let receipt = await this.myToken.transfer(recipient, 100, { from: initialHolder });
        console.log(`Gas used for transfer: ${receipt.receipt.gasUsed}`);
        assert(receipt.receipt.gasUsed < 100000, "Gas cost too high");
    });
    
    
});
