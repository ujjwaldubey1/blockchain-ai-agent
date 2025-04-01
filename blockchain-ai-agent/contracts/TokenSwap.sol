// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenSwap {
    // Mapping to store swap data for each user
    mapping(address => SwapData) public userSwapData;

    struct SwapData {
        uint256 lastSwapAmount;
        uint256 lastSwapTimestamp;
        uint256 totalSwaps;
    }

    // Event emitted when a swap occurs
    event SwapExecuted(address indexed user, uint256 amount, uint256 timestamp);

    // Function to execute a swap
    function executeSwap(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Update user's swap data
        userSwapData[msg.sender].lastSwapAmount = amount;
        userSwapData[msg.sender].lastSwapTimestamp = block.timestamp;
        userSwapData[msg.sender].totalSwaps += 1;

        emit SwapExecuted(msg.sender, amount, block.timestamp);
    }

    // Function to get swap data for a user
    function getSwapData(address user) external view returns (SwapData memory) {
        return userSwapData[user];
    }
} 