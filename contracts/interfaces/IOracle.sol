// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOracle {
    function getPrice(address _address) external view returns (uint256, uint8);
    function changeFeed(address _address, address _priceFeed) external;
    function changeRusdAddress(address _newAddress) external;
    function changeTruflationFeed(address _address, address _priceFeed) external;
    function updateTruflationPrice(address _address) external;
}
