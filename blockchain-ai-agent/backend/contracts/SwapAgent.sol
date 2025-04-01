// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SwapAgent {
    address public owner;

    // Store swap data for each user
    mapping(address => uint256) public swapAmounts;
    mapping(address => string) public swapTargets;

    event SwapExecuted(address indexed user, uint256 amount, string targetChain);

    constructor() {
        owner = msg.sender;
    }

    // Function to perform the swap and store data
    function swapTokens(uint256 amount, string memory targetChain) public {
        require(amount > 0, "Amount must be greater than zero");

        // Store the swap data
        swapAmounts[msg.sender] = amount;
        swapTargets[msg.sender] = targetChain;

        emit SwapExecuted(msg.sender, amount, targetChain);
    }

    // Function to get swap data for a user
    function getSwapData(address user) public view returns (uint256 amount, string memory targetChain) {
        return (swapAmounts[user], swapTargets[user]);
    }
}
