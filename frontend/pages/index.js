import Head from "next/head"
import styles from "../styles/Home.module.css"
import { abi, mumbaiAddress } from "../constants/index"
import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Toaster } from "react-hot-toast"
import BuyCoffe from "../components/buyCoffe"
import Footer from "../components/footer"

export default function Home() {
    // Contract Address & ABI
    //const contractAddress = "0x3FD8878D672C0eD2b225E1abaDA254004e5C6fd1"
    //const contractABI = abi.abi

    // Component state
    const [currentAccount, setCurrentAccount] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [coffees, setCoffees] = useState([])
    const [totalTip, setTotalTip] = useState(0)

    const onNameChange = (event) => {
        setName(event.target.value)
    }
    const onTipChange = (event) => {
        if (event.target.value > 0) {
            setTotalTip(event.target.value)
        } else {
            setTotalTip(1)
        }
    }
    const coffeePrice = () => {
        return totalTip * 1
    }

    const onMessageChange = (event) => {
        setMessage(event.target.value)
    }

    // Wallet connection logic
    const isWalletConnected = async () => {
        try {
            const { ethereum } = window

            const accounts = await ethereum.request({ method: "eth_accounts" })
            console.log("accounts: ", accounts)

            if (accounts.length > 0) {
                const account = accounts[0]
                console.log("wallet is connected! " + account)
            } else {
                console.log("make sure MetaMask is connected")
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
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })

            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        //const contractABI = abi.abi
        let buyMeACoffee
        isWalletConnected()
        // Function to fetch all coffees stored on-chain.
        const getCoffees = async () => {
            try {
                const { ethereum } = window
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const buyMeACoffee = new ethers.Contract(mumbaiAddress, abi, signer)

                    console.log("fetching coffees from the blockchain..")
                    const coffees = await buyMeACoffee.getCoffes()
                    console.log("fetched!")
                    setCoffees(coffees)
                } else {
                    console.log("MetaMask is not connected")
                }
            } catch (error) {
                console.log(error)
            }
        }
        getCoffees()
        // Clear the form fields.
        setName("")
        setMessage("")

        // Create an event handler function for when someone sends
        // us a new coffee.
        const onNewCoffe = (from, timestamp, name, message) => {
            console.log("Coffe received: ", from, timestamp, name, message)
            setCoffees((prevState) => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message,
                    name,
                },
            ])
        }

        const { ethereum } = window

        // Listen for new coffee events.
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any")
            const signer = provider.getSigner()
            buyMeACoffee = new ethers.Contract(mumbaiAddress, abi, signer)

            buyMeACoffee.on("NewCoffe", onNewCoffe)
        }

        return () => {
            if (buyMeACoffee) {
                buyMeACoffee.off("NewCoffe", onNewCoffe)
            }
        }
    }, [])
    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>Buy Maikel a Coffee!</title>
                    <meta name="description" content="Tipping site" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <div>
                        <Toaster />
                    </div>
                    <h1 className="font-bold text-6xl m-10">Buy Maikel a Coffee!</h1>

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
                                        placeholder="Jhon Doe"
                                        onChange={onNameChange}
                                    />
                                </div>
                                <br />
                                <div className="formgroup">
                                    <label>Send Maikel a message</label>
                                    <br />
                                    <textarea
                                        className="rounded-md pl-2"
                                        rows={3}
                                        placeholder="Enjoy your coffee!"
                                        id="message"
                                        onChange={onMessageChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mt-5">
                                    <h2 className="text-center">
                                        How many coffee&apos;s do you want to send?
                                    </h2>
                                    <div className="flex justify-center items-center align-center gap-5 mt-5">
                                        <span className="text-5xl">☕</span>
                                        <span
                                            onClick={() => {
                                                setTotalTip(1)
                                            }}
                                            className="text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer  hover:bg-amber-900"
                                        >
                                            1
                                        </span>
                                        <span
                                            onClick={() => {
                                                setTotalTip(3)
                                            }}
                                            className="text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer  hover:bg-amber-900"
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
                                <div className="flex flex-col align-center justify-center">
                                    <BuyCoffe
                                        quantity={1}
                                        coffeeType={"Coffee"}
                                        tip={`1 MATIC`}
                                        price={coffeePrice().toString()}
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

                {currentAccount && <h1>Coffee received!</h1>}

                {currentAccount &&
                    coffees.map((coffee, idx) => {
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
                                <p className="font-bold">&quot;{coffee.message}&quot;</p>
                                <p>From: {coffee.name}</p>
                            </div>
                        )
                    })}

                <Footer />
            </div>
        </>
    )
}
