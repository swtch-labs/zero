// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract ERC721Receiver is IERC721Receiver {
    // This can be an event to log the receipt of an NFT
    event Received(address operator, address from, uint256 tokenId, bytes data, uint256 gas);

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // Emit an event that logs the receipt of an NFT
        emit Received(operator, from, tokenId, data, gasleft());

        // Must return this magic value per the specification
        return this.onERC721Received.selector;
    }
}