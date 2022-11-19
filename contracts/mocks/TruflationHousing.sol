// SPDX-License-Identifier: ISC
pragma solidity ^0.8.16;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract TruflationHousing is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public index;

    address private oracle;
    string private externalJobId;
    uint256 private oraclePayment;

    event RequestIndexFulfilled(bytes32 indexed requestId, uint256 indexed index);

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    }

    // Privileged functions
    function setOracleAddress(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    function setExternalJobId(string memory _externalJobId) public onlyOwner {
        externalJobId = _externalJobId;
    }

    function setFeeAmount(uint256 _oraclePayment) public onlyOwner {
        oraclePayment = _oraclePayment;
    }

    function requestIndexData() external {
        Chainlink.Request memory req =
            buildChainlinkRequest(bytes32(bytes(externalJobId)), address(this), this.fulfill.selector);
        req.add("service", "truflation/current");
        req.add("data", '{"location":"uk","categories":"true"}');
        req.add("keypath", "categories.Housing.currentInflationIndex");
        req.add("abi", "int256");
        req.add("multiplier", "1000000000000000000");

        sendChainlinkRequestTo(oracle, req, oraclePayment);
    }

    function fulfill(bytes32 _requestId, bytes memory _index) public recordChainlinkFulfillment(_requestId) {
        uint256 uintIndex = uint256(bytes32(_index));
        emit RequestIndexFulfilled(_requestId, uintIndex);
        index = uintIndex;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
}
