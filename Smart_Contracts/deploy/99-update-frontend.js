require("dotenv").config()
const { network, ethers } = require("hardhat")
const fs = require("fs")
const { frontEndContractsFile, frontEndAbiLocation } = require("../utils/_exports")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END === true) {
        console.log("Updating Front End!...")
        await updateContractAddresses()
        await updateAbi()
        console.log("...Front End Updated!")
    }
}

async function updateAbi() {
    const coffe = await ethers.getContract("BuyMeACoffe")

    fs.writeFileSync(
        `${frontEndAbiLocation}BuyMeACoffe.json`,
        coffe.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const coffe = await ethers.getContract("BuyMeACoffe")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["BuyMeACoffe"].includes(coffe.address)) {
            contractAddresses[chainId]["BuyMeACoffe"].push(coffe.address)
        }
    } else {
        contractAddresses[chainId] = { BuyMeACoffe: [coffe.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "front"]
