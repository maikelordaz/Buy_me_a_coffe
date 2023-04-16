const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../utils/_networks")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BuyMeACoffe Unit tests", function () {
          let coffe, coffeAlice
          const name = "Alice"
          const message = "Hello"
          const tip = 10

          beforeEach(async () => {
              // Get the accounts
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              Alice = accounts[1]
              // Deploy contracts
              await deployments.fixture(["coffe"])
              coffe = await ethers.getContract("BuyMeACoffe", deployer)
              coffeAlice = coffe.connect(Alice)
          })

          describe("Revert errors", function () {
              describe("Problems with the deposit amount", function () {
                  it("Should revert if there is no deposit", async function () {
                      await expect(coffe.buyCoffe(name, message)).to.be.revertedWith(
                          "BuyMeACoffe__NotEnoughETH"
                      )
                  })
              })
          })

          describe("Buying a coffe", function () {
              it("Increment the coffe id", async function () {
                  const actualId = await coffe.getCoffeId()

                  await coffeAlice.buyCoffe(name, message, { value: tip })

                  const newId = await coffe.getCoffeId()

                  assert(actualId < newId)
                  assert.equal(actualId.toString(), "0")
                  assert.equal(newId.toString(), "1")
              })

              it("Sets a new coffe", async function () {
                  await coffeAlice.buyCoffe(name, message, { value: tip })

                  const id = await coffe.getCoffeId()

                  const newCoffe = await coffe.getCoffeById(id)

                  assert.equal(newCoffe.from, Alice.address)
                  assert.equal(newCoffe.name, name)
                  assert.equal(newCoffe.message, message)
              })

              it("Emits an event", async function () {
                  expect(await coffeAlice.buyCoffe(name, message, { value: tip })).to.emit(
                      "NewCoffe"
                  )
              })
          })
      })
