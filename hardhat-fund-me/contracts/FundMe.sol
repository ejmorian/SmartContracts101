// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    address internal immutable owner;
    uint256 internal constant minUsd = 50 * 1e18;
    address[] public funders;
    mapping(address => uint) contribution;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(
            msg.value.getPriceConversion() >= minUsd,
            "insufficient amount..."
        );
        funders.push(msg.sender);
        contribution[msg.sender] = msg.value;
    }

    function withdraw() external OnlyOwner {
        //reset records
        for (
            uint256 fundersIndex;
            fundersIndex < funders.length;
            fundersIndex++
        ) {
            address funder = funders[fundersIndex];
            contribution[funder] = 0;
        }

        funders = new address[](0);

        (bool succes, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(succes, "error");
    }

    modifier OnlyOwner() {
        require(msg.sender == owner, "unauthorise request");
        _;
    }
}
