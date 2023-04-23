import Head from "next/head"
import styles from "../styles/Home.module.css"
import Footer from "../components/footer"

export default function Home() {
    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>Buy me a Coffe!</title>
                    <meta name="dscription" content="Tipping site" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Footer />
            </div>
        </>
    )
}
