import Head from "next/head"
import styles from "../styles/Home.module.css"
import Buy from "../components/buy"
import Footer from "../components/footer"
import { abi, mumbaiAddress /*, contractAddresses */ } from "../constants"
//import { useMoralis } from "react-moralis"
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import React from "react"
import ethers from "ethers"

export default function Home() {
    /*
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const coffeAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    */

    const [currentAccount, setCurrentAccount] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [totalTip, setTotalTip] = useState(0)
    const [coffes, setCoffes] = useState([])

    // Connect wallet

    const isWalletConnected = async () => {
        try {
            const { ethereum } = window

            const accounts = await ethereum.request({ method: "eth_accounts" })
            console.log("accounts: ", accounts)

            if (accounts.length > 0) {
                const account = accounts[0]
                console.log("Wallet connected!" + account)
            } else {
                console.log("Connect your wallet")
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                console.log("Please install Metamask")

                const accounts = await ethereum.request({ method: "ethe_requestAccounts" })

                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onNameChange = (event) => {
        setName(event.target.value)
    }

    const onMessageChange = (event) => {
        setMessage(event.target.value)
    }

    const onTipChange = (event) => {
        if (event.target.value > 0) {
            setTotalTip(event.target.value)
        } else {
            setTotalTip(1)
        }
    }

    const coffePrice = () => {
        return totalTip * 0.001
    }

    useEffect(() => {
        let coffe
        isWalletConnected()
        //Coffes stored on chain
        const getCoffes = async () => {
            try {
                const { ethereum } = window
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const coffe = new ethers.Contract(mumbaiAddress, abi, signer)

                    console.log("Fetching coffes on blockchain...")
                    const coffes = await coffe.getCoffes()
                    console.log("Done")
                    setCoffes(coffes)
                } else {
                    console.log("MetaMAsk not connected")
                }
            } catch (error) {
                console.log(error)
            }
            getCoffes()
            setName("")
            setMessage("")

            const onNewCoffe = (from, timestamp, name, message) => {
                console.log("Coffe received: ", from, timestamp, name, messsage)
                setCoffes((prevState) => [
                    ...prevState,
                    {
                        address: from,
                        timestamp: new Date(timestamp * 1000),
                        message,
                        name,
                    },
                ])
            }
        }

        const { ethereum } = window

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any")
            const signer = provider.getSigner()
            coffe = new ethers.Contract(mumbaiAddress, abi, signer)

            coffe.on("NewCoffe", onNewCoffe)
        }

        return () => {
            if (coffe) {
                coffe.off("NewCoffe", onNewCoffe)
            }
        }
    }, [])

    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>Buy me a Coffe!</title>
                    <meta name="dscription" content="Tipping site" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className={styles.main}>
                    <div>
                        <Toaster />
                    </div>
                    <h1 className="font/bold text-6xl m-10">Buy Maikel a Coffe!</h1>
                    {currentAccount ? (
                        <div className="flex w-auto flex-col p-10 rounded-xl">
                            <form className="w-full flex flex-col items-center">
                                <div>
                                    <label>Name</label>
                                    <br />
                                    <input
                                        className="rounded-md pl-2"
                                        id="name"
                                        type="text"
                                        placeholder="anon"
                                        onChange={onNameChange}
                                    />
                                </div>
                                <br />
                                <div className="formgroup">
                                    <label>Give Maikel a message</label>
                                    <br />
                                    <textarea
                                        className="rounded-md pl-2"
                                        rows={3}
                                        placeholder="Enjoy this nice coffe"
                                        id="message"
                                        onChange={onMessageChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mt-5">
                                    <h2 className="text-center">
                                        How many coffe&apos;s do you want to buy
                                    </h2>
                                    <div className="flex justify-center items-center align-center gap-5 mt-5">
                                        <span className="text-5xl">☕</span>
                                        <span
                                            onClick={() => {
                                                setTotalTip(1)
                                            }}
                                            className="text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer hover:bg-amber-900"
                                        >
                                            1
                                        </span>
                                        <span
                                            onClick={() => {
                                                setTotalTip(3)
                                            }}
                                            className="text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer hover:bg-amber-900"
                                        >
                                            3
                                        </span>
                                        <span
                                            onClick={() => {
                                                setTotalTip(5)
                                            }}
                                            className="text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer hover:bg-amber-900"
                                        >
                                            5
                                        </span>
                                        <input
                                            min="1"
                                            max="5000"
                                            type="number"
                                            placeholder={totalTip}
                                            onChange={onTipChange}
                                            value={totalTip}
                                            className="text-3xl bg-gray-100 resize-none border-2 border-gray-200 w-12 h-12 active:bg-gray-400 pl-2 text-center overflow-hidden"
                                        ></input>
                                    </div>
                                </div>
                                <div className="flex flex'col align'center justify'center">
                                    <Buy
                                        quantity={1}
                                        coffeType={"Coffe"}
                                        tip={`1 MATIC`}
                                        price={coffePrice().toString()}
                                        name={name}
                                        message={message}
                                    />
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-gray-200 px-4 py-2 rounded-full cursor-pointer font-bold text-white"
                        >
                            {" "}
                            Connect your wallet{" "}
                        </button>
                    )}
                </main>

                {currentAccount && <h1>Thanks for the coffe!</h1>}

                {currentAccount &&
                    coffes.map((coffe, idx) => {
                        return (
                            <div
                                key={idx}
                                className="p-8"
                                style={{
                                    border: "2px solid",
                                    borderRadius: "5px",
                                    padding: "5px",
                                    margin: "5px",
                                    display: "grid",
                                    placeItems: "center",
                                }}
                            >
                                <p className="font-bold">&quot;{coffe.message}&quot;</p>
                                <p>From: {coffe.name}</p>
                            </div>
                        )
                    })}
                <Footer />
            </div>
        </>
    )
}
