import toast from "react-hot-toast"
import React from "react"
import { ethers } from "ethers"
import { abi, mumbaiAddress /*, contractAddresses*/ } from "../constants"
//import { useMoralis } from "react-moralis"

function Buy(props) {
    const buyCoffe = async () => {
        /*
        const { chainId: chainIdHex } = useMoralis()
        const chainId = parseInt(chainIdHex)
        const coffeAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
        */
        
        if (!props.price) {
            return toast.error("Invalid price")
        }

        try {
            // Mtamask installed?
            const { ethereum } = window
            if (ethereum) {
                // New Web3 provider and signer
                const provider = new ethers.providers.Web3Provider(ethereum, "any")
                const signer = provider.getSigner()
                // New instance of the smart contract
                const buyMeACoffe = new ethers.Contract(mumbaiAddress, abi, signer)
            }

            if (props.price === "1" || props.price === 1) {
                toast.success("Buying coffee!...")
                console.log("Buying coffee!...")
            } else {
                toast.success("Buying large coffee!...")
                console.log("Buying large coffee!...")
            }

            // Calling Contract Function
            const coffeTx = await buyMeACoffe.buyCoffe(
                props.name ? props.name : "Ian",
                props.message ? props.message : "Enjoy!!!",
                { value: ethers.utils.parseEther(props.price) }
            )

            await coffeTx.wait()

            console.log("done", coffeTx.hash)
            toast.success("done", coffeTx.hash)

            if (props.price === "1" || props.price === 1) {
                toast.success("Coffe purchased!...")
                console.log("Coffe purchased!...")
            } else {
                toast.success("Large coffee purchased!...")
                console.log("Large coffee purchased!...")
            }
        } catch (error) {
            // User rejects?
            if (error.includes("user rejected transaction")) {
                toast.error("User rejected transaction")
            } else {
                toast.error(error.message)
            }
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={buyCoffe}
                className="bg-amber-900 px-4 py-2 rounded-full cursor-pointer text-white m-5 hovr:bg-amber-700 transition"
            >{`Buy a coff for ${props.price} MATIC`}</button>
        </>
    )
}

export default Buy
