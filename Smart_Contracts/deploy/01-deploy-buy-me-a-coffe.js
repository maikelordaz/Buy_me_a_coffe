const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../utils/_networks")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("01. Deploying Buy Me A Coffe Contract...")

    const args = []
    const coffe = await deploy("BuyMeACoffe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    log("01. Buy Me A Coffe Contract Deployed!")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("01. Verifying Buy Me A Coffe... ---------------")
        await verify(coffe.address, args)
        log("01. Buy Me A Coffe Verified")
    }
}

module.exports.tags = ["coffe"]
