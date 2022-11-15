// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ITruflationTester {
    function requestYoyInflation() external returns (bytes32 requestId);
    function fulfillYoyInflation(bytes32 _requestId, bytes memory _inflation) external;
    function changeOracle(address _oracle) external;
    function changeJobId(string memory _jobId) external;
    function changeFee(uint256 _fee) external;
    function getChainlinkToken() external view returns (address);
    function withdrawLink() external;
    function inflationWei() external view returns (int256);
    function requestInflationWei() external returns (bytes32 requestId);
    function fulfillInflationWei(bytes32 _requestId, bytes memory _inflation) external;
}
