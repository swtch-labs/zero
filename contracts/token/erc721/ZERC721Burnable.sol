// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ZERC721Enumerable.sol";

contract ZERC721Burnable is ZERC721Enumerable {
    constructor(string memory name_, string memory symbol_)
        ZERC721Enumerable(name_, symbol_)
    {
        // Additional initialization, if needed
    }

    // TODO
}
