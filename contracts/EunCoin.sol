// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EunCoin
 * @notice Main utility and reward token for the Eunpyeong-gu ecosystem.
 *         Minted initially to the deployer and further minting controlled by DAO/owner.
 */
contract EunCoin is ERC20, Ownable {
    // Maximum cap for total supply (100 million tokens with 18 decimals)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18;

    constructor(address initialOwner, uint256 initialSupply) ERC20("EunCoin", "EUN") Ownable(initialOwner) {
        require(initialSupply <= MAX_SUPPLY, "Exceeds max supply");
        _mint(initialOwner, initialSupply);
    }

    /**
     * @notice Mint new tokens (only owner)
     * @param to Receiver address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Cap exceeded");
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens from caller's balance
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
} 