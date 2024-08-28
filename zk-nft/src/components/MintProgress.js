import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Contract } from 'ethers';
import NFTGeneratorABI from './NFTGeneratorABI.json'; // ABI of the NFTGenerator contract

const MintProgress = ({ contractAddress, transactionHash }) => {
    const [status, setStatus] = useState('Pending');
    const [transactionReceipt, setTransactionReceipt] = useState(null);
    const [error, setError] = useState(null);
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        // Initialize web3
        const web3Instance = new Web3(Web3.givenProvider);
        setWeb3(web3Instance);
        if (transactionHash) {
            checkTransactionStatus(web3Instance, transactionHash);
        }
    }, [transactionHash]);

    const checkTransactionStatus = async (web3Instance, txHash) => {
        try {
            // Poll for transaction receipt
            const interval = setInterval(async () => {
                try {
                    const receipt = await web3Instance.eth.getTransactionReceipt(txHash);
                    if (receipt) {
                        clearInterval(interval);
                        if (receipt.status) {
                            setStatus('Success');
                            setTransactionReceipt(receipt);
                        } else {
                            setStatus('Failed');
                            setError('Transaction failed');
                        }
                    }
                } catch (err) {
                    console.error(err);
                    setStatus('Error');
                    setError('Error checking transaction status');
                    clearInterval(interval);
                }
            }, 5000); // Check every 5 seconds
        } catch (err) {
            console.error(err);
            setStatus('Error');
            setError('Error initializing transaction status check');
        }
    };

    return (
        <div className="mint-progress-container">
            <h2>Minting Progress</h2>
            <div className="progress-status">
                <p>Status: {status}</p>
                {transactionReceipt && (
                    <p>Transaction Hash: <a href={`https://etherscan.io/tx/${transactionReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionReceipt.transactionHash}</a></p>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default MintProgress;
