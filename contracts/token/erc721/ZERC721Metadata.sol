// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ZERC721.sol";

contract ZERC721Metadata is ZERC721 {
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory name_, string memory symbol_)
        ZERC721(name_, symbol_) 
    {
        // Additional constructor logic if needed
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function _setTokenURI(uint256 tokenId, string memory _uri) internal {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _uri;
    }

    function mintWithTokenURI(address to, uint256 tokenId, string memory _tokenURI) public {
        mint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI); // Set the token URI
    }
}
