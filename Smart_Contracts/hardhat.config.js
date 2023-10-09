require("dotenv").config()

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")

/******************************************** Private Keys *********************************************/
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY
const POLYGON_DEPLOYER_PK = process.env.POLYGON_DEPLOYER_PK
const TESTNET_DEPLOYER_PK = process.env.TESTNET_DEPLOYER_PK

/******************************************** Deployer address *****************************************/
const DEPLOYER = "0x3904F59DF9199e0d6dC3800af9f6794c9D037eb1"
const TESTNET_DEPLOYER = "0x3904F59DF9199e0d6dC3800af9f6794c9D037eb1"
const ALICE = "0xa354bAF1c0C42caed01deb672BFA6b66Ef61a8B4"

/******************************************* RPC providers **********************************************/
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL
const MUMBAI_TESTNET_RPC_URL = process.env.MUMBAI_TESTNET_RPC_URL
// probando
/************************************** Networks Scans *************************************************/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY

/************************************** Coinmarketcap **************************************************/
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/***************************************** Forks ************************************************************/
const FORK = process.env.FORK

/***************************************** Config ******************************************************/

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.18",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                },
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
            initialBaseFeePerGas: 0,
            forking: {
                //chainId: 137,
                accounts: [DEPLOYER_PRIVATE_KEY],
                url: POLYGON_MAINNET_RPC_URL,
                blockNumber: 35700600,
                enabled: FORK === "true",
            },
        },
        localhost: {
            chainId: 31337,
            timeout: 60000,
        },
        mainnet_polygon: {
            chainId: 137,
            accounts: [DEPLOYER_PRIVATE_KEY || POLYGON_DEPLOYER_PK],
            url: POLYGON_MAINNET_RPC_URL,
            blockConfirmations: 6,
            timeout: 900000,
        },
        testnet_mumbai: {
            chainId: 80001,
            accounts: [DEPLOYER_PRIVATE_KEY || TESTNET_DEPLOYER_PK],
            url: MUMBAI_TESTNET_RPC_URL,
            blockConfirmations: 6,
            timeout: 300000,
        },
    },
    etherscan: {
        apiKey: {
            polygon: POLYGONSCAN_API_KEY,
            polygonMumbai: POLYGONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            mainnet_polygon: DEPLOYER,

            testnet_mumbai: TESTNET_DEPLOYER,

            default: 0,
            localhost: 0,
        },
        Alice: {
            testnet_mumbai: ALICE,

            default: 1,
            localhost: 1,
        },
    },
    mocha: {
        timeout: 300000,
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
    },
}
