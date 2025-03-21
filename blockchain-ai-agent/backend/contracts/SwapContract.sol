// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function transfer(address to, uint256 value) external returns (bool);
}

contract SwapContract {
    ISwapRouter public immutable swapRouter;
    IWETH public immutable WETH;
    address public owner;

    constructor(address _swapRouter, address _weth) payable {
        swapRouter = ISwapRouter(_swapRouter);
        WETH = IWETH(_weth);
        owner = msg.sender;
    }

    function swapETHForTokens(address token, uint256 amountOutMin) external payable {
        require(msg.value > 0, "Send ETH to swap");

        // Convert ETH to WETH
        WETH.deposit{value: msg.value}();

        // Approve Uniswap Router to spend WETH
        WETH.transfer(address(swapRouter), msg.value);

        // Set swap parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: address(WETH),
            tokenOut: token,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp + 300,
            amountIn: msg.value,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: 0
        });

        // Execute swap
        swapRouter.exactInputSingle(params);
    }

    receive() external payable {}
}
