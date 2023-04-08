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
      // expect(currentValue.toString()).to.equal(expectedValue);
    })

    it("Update favourite number when we call setFavouiteNumber", async () => {
        const transactionResponse = await simpleStorage.setFavouriteNumber("101");
        await transactionResponse.wait(1)
        const updatedNumber = await simpleStorage.favouriteNumber();
        const expectedValue = 101;

        assert.equal(updatedNumber.toString(), expectedValue);
    })

    it("mapping of person and their favourite number matches", async ()=>{
      const transactionResponse = await simpleStorage.setPeopleFavouriteNumber("JMorian", 101);
      await transactionResponse.wait(1)
      const personFavouriteNumber = await simpleStorage.peopleToFavouriteNumber("JMorian");
      const favouriteNumber = 101;

      assert.equal(personFavouriteNumber, favouriteNumber);
    })

})