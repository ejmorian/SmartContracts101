// Title: Fund Me

//SPDX-License-Identifier: MIT

import "./PriceConverter.sol";

pragma solidity ^0.8.8;

error FundMe__NotOwner();

/** @title A contract for crowd funding */
/**@author ejmorian */
/**@notice this contract is to demo a funding contract */
/**@dev this implements  price feeds as our library */
contract FundMe {
  using PriceConverter for uint256;

  address public immutable i_owner;
  uint256 public constant MINIMUM_USD = 50 * 1e18;
  AggregatorV3Interface public priceFeedAddress;
  address[] public funders;
  mapping(address => uint256) public addressToAmountFunded;

  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }
    // require(msg.sender == i_owner, "you are not the deployer");
    _;
  }

  constructor(address _priceFeed) {
    priceFeedAddress = AggregatorV3Interface(_priceFeed);
    i_owner = msg.sender;
  }

  function fund() public payable {
    require(
      msg.value.getConversionRate(priceFeedAddress) >= MINIMUM_USD,
      "Didn't Send Enough Eth"
    );

    funders.push(msg.sender);
    addressToAmountFunded[msg.sender] = msg.value;
  }

  function withdraw() public onlyOwner {
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
}
