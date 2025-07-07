// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NanumCoin.sol";

/**
 * @title DonationConverter
 * @notice Allows users to convert EunCoin into NanumCoin 1:1 for donation purposes.
 */
contract DonationConverter is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable eunCoin;
    NanumCoin public immutable nanumCoin;

    event Converted(address indexed user, uint256 amount);

    constructor(IERC20 _eunCoin, NanumCoin _nanumCoin) Ownable(msg.sender) {
        eunCoin = _eunCoin;
        nanumCoin = _nanumCoin;
    }

    /**
     * @notice Convert EunCoin to NanumCoin (1:1 ratio)
     * @param amount Amount to convert
     */
    function convert(uint256 amount) external {
        require(amount > 0, "Amount 0");
        eunCoin.safeTransferFrom(msg.sender, address(this), amount);
        nanumCoin.mint(msg.sender, amount);
        emit Converted(msg.sender, amount);
    }

    /**
     * @notice Owner can donate accumulated EunCoin to designated charity address
     */
    function donateAccumulated(address to, uint256 amount) external onlyOwner {
        eunCoin.safeTransfer(to, amount);
    }
} 