import React, { useState, useEffect } from 'react';
import Generator from './components/Generator';
import Header from './components/Header';
import Footer from './components/Footer';
import MintProgress from './components/MintProgress';
import NFTCard from './components/NFTCard';
import { checkMintingStatus } from './utils/zkCompressionAPI';
import './styles/main.css';

/**
 * Main App component
 */
const App = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [mintingStatus, setMintingStatus] = useState(null);
    const [nftData, setNftData] = useState(null);

    useEffect(() => {
        // Check minting status periodically
        const intervalId = setInterval(async () => {
            if (isMinting) {
                const status = await checkMintingStatus();
                setMintingStatus(status);
                if (status === 'completed') {
                    setIsMinting(false);
                    // Fetch minted NFT data
                    fetchNftData();
                }
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [isMinting]);

    /**
     * Fetches the minted NFT data
     */
    const fetchNftData = async () => {
        // Replace with actual API or contract call
        // Example:
        // const response = await fetch('/api/nftData');
        // const data = await response.json();
        // setNftData(data);
    };

    return (
        <div className="app">
            <Header />
            <main>
                <Generator onMintingStart={() => setIsMinting(true)} />
                {isMinting && <MintProgress status={mintingStatus} />}
                {nftData && <NFTCard data={nftData} />}
            </main>
            <Footer />
        </div>
    );
};

export default App;
