const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../utils/_networks")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("MyContract unit tests", function () {
          let myContract, myContractDeployer, myContractAlice, myContractBob

          beforeEach(async () => {
              // Get the accounts
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              Alice = accounts[1]
              Bob = accounts[2]
              // Deploy contracts
              await deployments.fixture(["all"])
              myContract = await ethers.getContract("MyContract")
              // Connect the users
              myContractDeployer = myContract.connect(deployer)
              myContractAlice = myContract.connect(Alice)
              myContractBob = myContract.connect(Bob)
              // Initialize the interfaces
          })
      })
