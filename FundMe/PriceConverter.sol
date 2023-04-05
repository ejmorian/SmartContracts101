//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import chainlink data feeds ABI
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // gets the price of 1ETH to USD
    function getPrice() internal view returns (uint256) {
        // Create an instance of ABI and link it to the ETH/USD contract address
        AggregatorV3Interface myContract = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        //the function returns a tuple so we need to create a tuple of values to recieve the response.
        (, int256 answer, , , ) = myContract.latestRoundData();
        //get the target value and add neccessary decimals to it to perform calc
        return uint256(answer * 1e10);
    }

    //perform connversion from ETH to USD
    function getConversionRate(
        uint256 _ethAmount
    ) internal view returns (uint256) {
        //perform conversion and remove unneccessary dec
        return ((_ethAmount * getPrice()) / 1e18);
    }
}
