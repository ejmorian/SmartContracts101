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
  AggregatorV3Interface private s_priceFeedAddress;
  address[] private s_funders;
  mapping(address => uint256) private s_addressToAmountFunded;

  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }
    // require(msg.sender == i_owner, "you are not the deployer");
    _;
  }

  constructor(address _priceFeed) {
    s_priceFeedAddress = AggregatorV3Interface(_priceFeed);
    i_owner = msg.sender;
  }

  function fund() public payable {
    require(
      msg.value.getConversionRate(s_priceFeedAddress) >= MINIMUM_USD,
      "Didn't Send Enough Eth"
    );

    s_funders.push(msg.sender);
    s_addressToAmountFunded[msg.sender] = msg.value;
  }

  // function withdraw() public onlyOwner {
  //   for (
  //     uint256 funderIndex = 0;
  //     funderIndex < s_funders.length;
  //     funderIndex++
  //   ) {
  //     address funder = s_funders[funderIndex];

  //     s_addressToAmountFunded[funder] = 0;
  //   }

  //   s_funders = new address[](0);

  //   (bool callSuccess, ) = payable(msg.sender).call{
  //     value: address(this).balance
  //   }("");
  //   require(callSuccess, "error");
  // }

  function cheaperWithdraw() public payable onlyOwner {
    address[] memory funders = s_funders;
    for (uint256 i = 0; i < funders.length; i++) {
      address funder = funders[i];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "error");
  }

  function getPriceFeedAddress() public view returns (AggregatorV3Interface) {
    return s_priceFeedAddress;
  }

  function getFunders(uint _index) public view returns (address) {
    return s_funders[_index];
  }

  function getAddressToAmountFunded(
    address _funderAddress
  ) public view returns (uint256) {
    return s_addressToAmountFunded[_funderAddress];
  }
}
