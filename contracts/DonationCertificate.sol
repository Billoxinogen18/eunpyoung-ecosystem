// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationCertificate is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    event CertificateMinted(address indexed donor, uint256 indexed tokenId, string uri);

    constructor() ERC721("DonationCertificate", "DONATE") Ownable(msg.sender) {}

    function mintCertificate(address to, string memory uri) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit CertificateMinted(to, tokenId, uri);
        return tokenId;
    }
} 