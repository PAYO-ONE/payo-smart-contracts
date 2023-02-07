// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";


//  _______    ______  __      __   ______
// |       \  /      \|  \    /  \ /      \
// | $$$$$$$\|  $$$$$$\\$$\  /  $$|  $$$$$$\
// | $$__/ $$| $$__| $$ \$$\/  $$ | $$  | $$
// | $$    $$| $$    $$  \$$  $$  | $$  | $$
// | $$$$$$$ | $$$$$$$$   \$$$$   | $$  | $$
// | $$      | $$  | $$   | $$    | $$__/ $$
// | $$      | $$  | $$   | $$     \$$    $$
//  \$$       \$$   \$$    \$$      \$$$$$$

contract PayoTransfer is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    uint256 public feePercentage;
    address payable public feeCollector;
    IERC20[] public validTokens;
    address private _owner;

    constructor(address _feeCollector) {
        feeCollector = payable(_feeCollector);
        // uint256 feeRate = 1000000;
    }

    function transferETH(address payable _to) public payable {
        require(_to != address(0));
        require(msg.value > 0);
        uint256 fee = (msg.value).div(100).mul(2);
        console.log(fee);
        uint256 value = msg.value.sub(fee);
        console.log(value);
        _to.transfer(value);
        feeCollector.transfer(fee);
    }

    function transferToken(IERC20 _token, address _to, uint256 _value) public {
        require(isValidToken(_token) == true, "Unsupported token");
        require(_to != address(0));
        require(_value > 0);
        require(_value >= 100, "Value too small to calculate fee");
        uint256 fee = _value.div(100).mul(2);
        require(_value >= fee, "Fee greater than value");
        uint256 value = _value.sub(fee);
        _token.safeTransferFrom(msg.sender, _to, value);
        _token.safeTransferFrom(msg.sender, feeCollector, fee);
    }

    function isValidToken(IERC20 _token) internal view returns (bool) {
        for (uint256 i = 0; i < validTokens.length; i++) {
            if (validTokens[i] == _token) {
                return true;
            }
        }
        return false;
    }

    function addValidToken(IERC20 _token) public onlyOwner {
        validTokens.push(_token);
    }
}
