const {expect,assert} = require("chai");
const {ethers} = require("hardhat");

describe("SimpleStorage", ()=> {
    let simpleStorage, simpleStorageFactory
    beforeEach(async ()=> {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    })

    it("return the favourite number, must be initially zero", async () => {
        const currentNumber = await simpleStorage.retrieve();
        const expectedValue = 0;

        assert.equal(currentNumber, expectedValue);
    })

    it("the favourite number updates when setter is called", async () => {
        
        await simpleStorage.store(101);
        const currentNumber = await simpleStorage.retrieve();
        const expectedNumber = 101
        if (currentNumber !== 0){
            assert.equal(Number(currentNumber), 101);
        } else {
            assert.throw(console.error(e));
        }
        
    })

    it("add new person favourite to the list", async () => {
        const name = "JM"
        const number = 6
        await simpleStorage.addPerson(name, number)
        const person = await simpleStorage.people(0)
        const personName = person.name;
        const personNumber = person.favoriteNumber;

        assert.equal(person.name, name);
        assert.equal(person.favoriteNumber, number);


    })
    
})