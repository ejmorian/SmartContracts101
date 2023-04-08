const {ethers} = require("hardhat");
const {expect, assert} = require("chai");

describe("SimpleStorage", async () => {

  let simpleStorageFactory, simpleStorage;

    beforeEach(async () => {
      simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
      simpleStorage = await simpleStorageFactory.deploy();
    })

    it("Start with a favourite number of 0", async ()=> {
      const currentValue = await simpleStorage.favouriteNumber();
      const expectedValue = 0;

      //assert
      // expect

      assert.equal(currentValue.toString(), expectedValue);
    })

    it("Update favourite number when we call setFavouiteNumber", async () => {
        await simpleStorage.setFavouriteNumber("101").wait(1);
        const updatedNumber = await simpleStorage.favouriteNumber();
        const expectedValue = 101;

        assert.equal(updatedNumber.toString(), expectedValue);
    })

})