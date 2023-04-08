//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    uint256 public favouriteNumber;
    People[] public people;
    mapping(string => uint256) public peopleToFavouriteNumber;

    struct People {
        string name;
        uint256 number;
    }

    function setFavouriteNumber(uint256 _favouriteNumber) public virtual {
        favouriteNumber = _favouriteNumber;
    }

    function setPeopleFavouriteNumber(
        string memory _name,
        uint256 _favouriteNumber
    ) public {
        people.push(People(_name, _favouriteNumber));
        peopleToFavouriteNumber[_name] = _favouriteNumber;
    }
}
