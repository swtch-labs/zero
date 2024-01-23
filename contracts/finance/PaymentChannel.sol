// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title PaymentChannel
 * @author astordigital@gmail.com
 * @notice Zero Smart Contracts Payment Channel on Ethereum. Perform repeated payments without committing every transaction to the blockchain.
 */
contract PaymentChannel {
    /**
     * @dev Address of the sender (who funds the contract). 
     */
    address payable public sender;

    /**
     * @dev Address of the receiver (who receives the funds).
     */
    address payable public receiver;

    /**
     * @dev Expiration time (as a Unix timestamp) after which the sender can claim back the funds.
     */
    uint256 public expiration;

    /**
     * @dev Amount of Ether (in wei) deposited in the contract by the sender.
     */
    uint256 public deposit;

    /**
     * @dev Constructor
     * @param _receiver Address of the receiver (who receives the funds).
     * @param duration Expiration duration.
     */
    constructor(address payable _receiver, uint256 duration) payable {
        sender = payable(msg.sender);
        receiver = _receiver;
        expiration = block.timestamp + duration;
        deposit = msg.value;
    }

    /**
     * @dev Close the payment channel.
     * @param amount Amount of Ether (in wei) to transfer to the receiver.
     * @param signature Digital signature from the sender, authorizing the amount.
     */
    function close(uint256 amount, bytes memory signature) external {
        require(msg.sender == receiver, "Only receiver can close the channel");
        require(isValidSignature(amount, signature), "Invalid signature");
        require(amount <= deposit, "Amount exceeds deposit");

        receiver.transfer(amount);
        if (address(this).balance > 0) {
            sender.transfer(address(this).balance);
        }
    }

    /**
     * @dev Internal function to verify the signature.
     * @param amount Amount of Ether (in wei) being claimed.
     * @param signature Digital signature to validate.
     */
    function isValidSignature(uint256 amount, bytes memory signature) internal view returns (bool) {
        bytes32 message = prefixed(keccak256(abi.encodePacked(this, amount)));
        return recoverSigner(message, signature) == sender;
    }

    /**
     * @dev Extend the expiration of the channel.
     * @param newExpiration New expiration timestamp for the channel.
     */
    function extend(uint256 newExpiration) external {
        require(msg.sender == sender, "Only sender can extend expiration");
        require(newExpiration > expiration, "New expiration must be later than current expiration");
        expiration = newExpiration;
    }

    /**
     * @dev Allow the sender to claim the funds after the channel has expired.
     */
    function claimTimeout() external {
        require(block.timestamp >= expiration, "Channel not yet expired");
        sender.transfer(address(this).balance);
    }

    /**
     * @dev Internal function to recover the signer from a signature.
     * @param message Hashed message that was signed.
     * @param sig Signature to extract the signer.
     */
    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
        return ecrecover(message, v, r, s);
    }

    /**
     * @dev Internal function to split a signature into its components.
     * @param sig The full signature to split.
     * @return Tuple of the Signature components.
     */
    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65, "Invalid signature length");
        // ECDSA signature component r, first 32 bytes of the signature
        bytes32 r;
        // ECDSA signature component s, next 32 bytes of the signature
        bytes32 s;
        // Ethereum recovery identifier.
        uint8 v;
        // Common Ethereum pattern to decode the components of an ECDSA signature
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        // return tuple of Signature components
        return (v, r, s);
    }

    /**
     * @dev Internal function to prefix a hash with the Ethereum signed message header.
     * @param hash Original hash to be prefixed.
     */
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}
