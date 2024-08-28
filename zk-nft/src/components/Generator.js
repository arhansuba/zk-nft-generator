import React, { useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'ethers';
import zkCompression from './zkCompression'; // Import zkCompression library or utility
import NFTGeneratorABI from './NFTGeneratorABI.json'; // ABI of the NFTGenerator contract

const Generator = ({ contractAddress }) => {
    const [metadata, setMetadata] = useState('');
    const [proof, setProof] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    // Initialize web3 and contract instance
    const web3 = new Web3(Web3.givenProvider);
    const nftGeneratorContract = new web3.eth.Contract(NFTGeneratorABI, contractAddress);

    // Handle metadata input change
    const handleMetadataChange = (event) => {
        setMetadata(event.target.value);
    };

    // Handle proof input change
    const handleProofChange = (event) => {
        setProof(event.target.value);
    };

    // Mint NFT function
    const mintNFT = async () => {
        if (!metadata || !proof) {
            setMessage('Please provide both metadata and proof.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            // Call smart contract mint function
            const result = await nftGeneratorContract.methods
                .mintNFT(account, metadata, proof)
                .send({ from: account });

            setMessage(`NFT Minted! Transaction Hash: ${result.transactionHash}`);
        } catch (error) {
            console.error(error);
            setMessage('Error minting NFT. Please check the console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="generator-container">
            <h2>Mint Your NFT</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    mintNFT();
                }}
            >
                <div className="form-group">
                    <label htmlFor="metadata">Metadata:</label>
                    <textarea
                        id="metadata"
                        value={metadata}
                        onChange={handleMetadataChange}
                        rows="4"
                        cols="50"
                        placeholder="Enter metadata here"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="proof">zk-SNARK Proof:</label>
                    <textarea
                        id="proof"
                        value={proof}
                        onChange={handleProofChange}
                        rows="4"
                        cols="50"
                        placeholder="Enter zk-SNARK proof here"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Minting...' : 'Mint NFT'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Generator;
