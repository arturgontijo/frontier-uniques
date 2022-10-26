// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestToken2 is ERC721 {

    address public owner;

    constructor(
        address _owner,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = _owner;
    }

    function mintTo(address _to, uint256 _tokenId) public {
        _mint(_to, _tokenId);
    }

}
