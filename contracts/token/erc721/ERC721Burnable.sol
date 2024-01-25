// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC721Enumerable.sol";

contract ERC721Burnable is ERC721Enumerable {
    constructor(string memory name_, string memory symbol_)
        ERC721Enumerable(name_, symbol_)
    {
        // Additional initialization
    }

    // TODO
}
