const { network, ethers } = require("hardhat")
const fs = require("fs")
const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const { getContractAddress } = require("ethers/lib/utils")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating to front end...")
        updateContractAddress()
        updateAbi()
        console.log("Front end updated!")
    }
}

async function updateAbi() {
    const myContract = await ethers.getContract("MyContract")
    fs.writeFileSync(frontEndAbiFile, zapper.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddress() {
    const myContract = await ethers.getContract("MyContract")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    const chainId = network.config.chainId.toString()

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(myContract.address)) {
            contractAddresses[chainId].push(myContract.address)
        }
    } else {
        contractAddresses[chainId] = [myContract.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
