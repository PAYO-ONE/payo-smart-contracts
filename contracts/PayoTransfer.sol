// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


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
    address private _owner;

    mapping(address => bool) public validTokens;

    
    constructor(address payable  _feeCollector, uint _fee) {
        feeCollector = _feeCollector;
        feePercentage = _fee;
    }

    function transferETH(address payable _to) external payable {
        require(_to != address(0));
        require(msg.value >= 10000, "Value too small to calculate fee");
        uint256 fee = (msg.value).div(10000).mul(feePercentage);
        uint256 value = msg.value.sub(fee);
        _to.transfer(value);
        feeCollector.transfer(fee);
    }

    function transferToken(IERC20 _token, address _to, uint256 _value) external {
        require(validTokens[address(_token)], "Unsupported token");
        require(_to != address(0));
        require(_value >= 10000, "Value too small to calculate fee");
        uint256 fee = _value.div(10000).mul(feePercentage);
        uint256 value = _value.sub(fee);
        _token.safeTransferFrom(msg.sender, _to, value);
        _token.safeTransferFrom(msg.sender, feeCollector, fee);
    }

    function addValidToken(IERC20 _token) external onlyOwner {
        require(!validTokens[address(_token)], 'this token already add');
        validTokens[address(_token)] = true;
    }

    function deleteValidToken(IERC20 _token) external  onlyOwner {
        delete validTokens[address(_token)];
    }
    
    function changeFeeCollector(address payable  _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }

    function changeFeePercent(uint256 _fee) external onlyOwner {
        require(_fee < 10000, 'fee is to high');
        feePercentage = _fee;
    }
}