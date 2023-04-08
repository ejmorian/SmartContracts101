//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// ETH/USD Address(Sepolia): 0x694AA1769357215DE4FAC081bf1f309aDC325306

library PriceConverter {
    // gets the price of 1 Eth to USD
    function getConversionRate() internal view returns (uint256) {
        AggregatorV3Interface ethToUSD = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );

        (, int256 answer, , , ) = ethToUSD.latestRoundData();

        return uint256(answer * 1e10);
    }

    function getPriceConversion(
        uint256 _ethAmount
    ) internal view returns (uint256) {
        return (_ethAmount * getConversionRate()) / 1e18;
    }
}
