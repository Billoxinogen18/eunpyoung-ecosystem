// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EunCoin Staking Contract
 * @notice Users stake EunCoin to earn interest and voting rights.
 */
contract EunStaking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable eunCoin;

    struct StakeInfo {
        uint256 amount;
        uint256 timestamp; // start time
    }

    mapping(address => StakeInfo) public stakes;

    // Annual Percentage Rate expressed in basis points (e.g., 1000 = 10%)
    uint256 public aprBasisPoints = 1000;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    constructor(IERC20 _eunCoin) Ownable(msg.sender) {
        eunCoin = _eunCoin;
    }

    function setApr(uint256 _aprBps) external onlyOwner {
        require(_aprBps <= 5000, "APR too high");
        aprBasisPoints = _aprBps;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount 0");
        StakeInfo storage user = stakes[msg.sender];
        _claimReward(msg.sender);
        eunCoin.safeTransferFrom(msg.sender, address(this), amount);
        user.amount += amount;
        user.timestamp = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        StakeInfo storage user = stakes[msg.sender];
        require(amount > 0 && amount <= user.amount, "Invalid amount");
        uint256 reward = _claimReward(msg.sender);
        user.amount -= amount;
        eunCoin.safeTransfer(msg.sender, amount + reward);
        emit Withdrawn(msg.sender, amount, reward);
    }

    function _claimReward(address account) internal returns (uint256) {
        StakeInfo storage user = stakes[account];
        if (user.amount == 0) return 0;
        uint256 duration = block.timestamp - user.timestamp;
        uint256 reward = (user.amount * aprBasisPoints * duration) / (10000 * 365 days);
        user.timestamp = block.timestamp;
        return reward;
    }

    function pendingReward(address account) external view returns (uint256) {
        StakeInfo storage user = stakes[account];
        if (user.amount == 0) return 0;
        uint256 duration = block.timestamp - user.timestamp;
        return (user.amount * aprBasisPoints * duration) / (10000 * 365 days);
    }
} 