//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice() internal view returns (uint256) {
        AggregatorV3Interface myContract = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 answer, , , ) = myContract.latestRoundData();
        return uint256(answer * 1e10);
    }

    function getConversionRate(
        uint256 _ethAmountß
    ) internal view returns (uint256) {
        return ((_ethAmount * getPrice()) / 1e18);
    }
}
