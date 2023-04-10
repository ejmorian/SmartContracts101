//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import chainlink data feeds ABI
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
  // gets the price of 1ETH to USD
  function getPrice(
    AggregatorV3Interface priceFeed
  ) internal view returns (uint256) {
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    return uint256(answer * 1e10);
  }

  function getConversionRate(
    uint256 _ethAmount,
    AggregatorV3Interface priceFeed
  ) internal view returns (uint256) {
    return ((_ethAmount * getPrice(priceFeed)) / 1e18);
  }
}
