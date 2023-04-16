require("dotenv").config()

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")

/******************************************** Private Keys *********************************************/
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY
const ETHEREUM_DEPLOYER_PK = process.env.ETHEREUM_DEPLOYER_PK
const POLYGON_DEPLOYER_PK = process.env.POLYGON_DEPLOYER_PK
const TESTNET_DEPLOYER_PK = process.env.TESTNET_DEPLOYER_PK

/******************************************** Deployer address *****************************************/
const DEPLOYER = "0x3904F59DF9199e0d6dC3800af9f6794c9D037eb1"
const TESTNET_DEPLOYER = "0x3904F59DF9199e0d6dC3800af9f6794c9D037eb1"
const ALICE = "0xa354bAF1c0C42caed01deb672BFA6b66Ef61a8B4"
const BOB = "0xd26235AF7919C81470481fF4436B5465B0bbF6F2"
const CHARLIE = "0xd26235AF7919C81470481fF4436B5465B0bbF6F2"
const EVA = "0x860e2d006d2FEE4c2D62aDe279d289fA045C0D47"

/******************************************* RPC providers **********************************************/
const ETHEREUM_MAINNET_RPC_URL = process.env.ETHEREUM_MAINNET_RPC_URL
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL
const GOERLI_TESTNET_RPC_URL = process.env.GOERLI_TESTNET_RPC_URL
const MUMBAI_TESTNET_RPC_URL = process.env.MUMBAI_TESTNET_RPC_URL

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
                version: "0.8.9",
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
        mainnet_ethereum: {
            chainId: 1,
            accounts: [DEPLOYER_PRIVATE_KEY || ETHEREUM_DEPLOYER_PK],
            url: ETHEREUM_MAINNET_RPC_URL,
            blockConfirmations: 6,
            timeout: 900000,
        },
        mainnet_polygon: {
            chainId: 137,
            accounts: [DEPLOYER_PRIVATE_KEY || POLYGON_DEPLOYER_PK],
            url: POLYGON_MAINNET_RPC_URL,
            blockConfirmations: 6,
            timeout: 900000,
        },
        testnet_goerli: {
            chainId: 5,
            accounts: [DEPLOYER_PRIVATE_KEY || TESTNET_DEPLOYER_PK],
            url: GOERLI_TESTNET_RPC_URL,
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
            mainnet: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
            polygonMumbai: POLYGONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            mainnet_ethereum: DEPLOYER,
            mainnet_polygon: DEPLOYER,

            testnet_goerli: TESTNET_DEPLOYER,
            testnet_mumbai: TESTNET_DEPLOYER,

            default: 0,
            localhost: 0,
        },
        Alice: {
            testnet_goerli: ALICE,
            testnet_mumbai: ALICE,

            default: 1,
            localhost: 1,
        },
        Bob: {
            testnet_goerli: BOB,
            testnet_mumbai: BOB,

            default: 2,
            localhost: 2,
        },
        Charlie: {
            testnet_goerli: CHARLIE,
            testnet_mumbai: CHARLIE,

            default: 3,
            localhost: 3,
        },
        Eva: {
            testnet_goerli: EVA,
            testnet_mumbai: EVA,

            default: 4,
            localhost: 4,
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
