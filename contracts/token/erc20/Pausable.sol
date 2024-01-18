// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Pausable {
    bool private _paused;
    address private _owner;

    event Paused(address account);
    event Unpaused(address account);

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    constructor() {
        _owner = msg.sender;
        _paused = false;
    }

    function pause() public onlyOwner {
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    function isPaused() public view returns (bool) {
        return _paused;
    }
}
