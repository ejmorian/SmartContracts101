//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract SimpleStorageFactory {
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        simpleStorageArray.push(new SimpleStorage());
    }

    function setFavouriteNumber(
        uint256 _index,
        uint256 _favouriteNumber
    ) public {
        SimpleStorage currentContract = SimpleStorage(
            simpleStorageArray[_index]
        );
        currentContract.setFavouriteNumber(_favouriteNumber);
    }

    function retrieveFavouriteNumber(
        uint256 _index
    ) public view returns (uint256) {
        SimpleStorage currentContract = SimpleStorage(
            simpleStorageArray[_index]
        );

        return currentContract.favouriteNumber();
    }
}
