// Title: Fund Me

//SPDX-License-Identifier: MIT

import "./PriceConverter.sol";

pragma solidity ^0.8.8;
error UnAuthorized();

contract FundMe {
  using PriceConverter for uint256;
  address public immutable i_owner;
  AggregatorV3Interface public priceFeedAddress;

  constructor(address _priceFeed) {
    priceFeedAddress = AggregatorV3Interface(_priceFeed);
    i_owner = msg.sender;
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  uint256 public constant MINIMUM_USD = 50 * 1e18;

  address[] public funders;
  mapping(address => uint256) public addressToAmountFunded;

  function fund() public payable {
    require(
      msg.value.getConversionRate(priceFeedAddress) >= MINIMUM_USD,
      "Didn't Send Enough"
    );

    funders.push(msg.sender);
    addressToAmountFunded[msg.sender] = msg.value;
  }

  function Withdraw() public onlyOwner {
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];

      addressToAmountFunded[funder] = 0;
    }

    funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "error");
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert UnAuthorized();
    }
    _;
  }
}
