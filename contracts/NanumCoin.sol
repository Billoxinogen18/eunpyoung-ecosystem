// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NanumCoin
 * @notice Donation token minted upon conversion from EunCoin via DonationConverter contract.
 */
contract NanumCoin is ERC20, Ownable {
    address public converter;

    constructor(address _converter, address dao) ERC20("NanumCoin", "NANUM") Ownable(dao) {
        converter = _converter;
    }

    modifier onlyConverter() {
        require(msg.sender == converter, "Only converter");
        _;
    }

    /**
     * @notice Update converter address (only owner/DAO)
     */
    function setConverter(address _converter) external onlyOwner {
        require(_converter != address(0), "Invalid address");
        converter = _converter;
    }

    function mint(address to, uint256 amount) external onlyConverter {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
} 