// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TestToken is ERC721 {

    using SafeMath for uint256;

    address public owner;
    bool public _canMint = false;
    uint256 private _currentId = 0;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function start() public {
        require(msg.sender == owner, "Only owner can start it.");
        _canMint = true;
    }

    function mintTo(address _to) public {
        require(_canMint, "Onwer has not started the minting yet.");
        _currentId = _currentId.add(1);
        _mint(_to, _currentId);
    }

}
