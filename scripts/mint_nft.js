const { ethers } = require("ethers");
const fs = require("fs");
require('dotenv').config();

// Load environment variables
const {
    INFURA_PROJECT_ID,
    DEPLOYER_PRIVATE_KEY,
    NFT_GENERATOR_CONTRACT_ADDRESS,
    ZK_COMPRESSION_CONTRACT_ADDRESS,
    METADATA_API_URL
} = process.env;

// Connect to the Ethereum network
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

// Load ABI and contract addresses
const nftGeneratorABI = JSON.parse(fs.readFileSync('./artifacts/NFTGenerator.json')).abi;
const zkCompressionABI = JSON.parse(fs.readFileSync('./artifacts/ZKCompression.json')).abi;

const nftGenerator = new ethers.Contract(NFT_GENERATOR_CONTRACT_ADDRESS, nftGeneratorABI, wallet);
const zkCompression = new ethers.Contract(ZK_COMPRESSION_CONTRACT_ADDRESS, zkCompressionABI, wallet);

// Function to mint NFT
async function mintNFT(tokenURI) {
    try {
        // Fetch compressed metadata using zk compression API
        const compressedMetadata = await fetchCompressedMetadata(tokenURI);
        
        // Mint NFT with compressed metadata
        const tx = await nftGenerator.mintWithMetadata(compressedMetadata);
        console.log(`Minting NFT... Transaction hash: ${tx.hash}`);

        await tx.wait();
        console.log(`NFT minted successfully with tokenURI: ${tokenURI}`);
    } catch (error) {
        console.error(`Error minting NFT: ${error.message}`);
    }
}

// Function to fetch compressed metadata from the zk compression API
async function fetchCompressedMetadata(tokenURI) {
    const response = await fetch(`${METADATA_API_URL}/compress?uri=${encodeURIComponent(tokenURI)}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch compressed metadata: ${response.statusText}`);
    }
    const data = await response.json();
    return data.compressedMetadata;
}

// Example usage: minting an NFT with a sample token URI
const sampleTokenURI = "https://example.com/api/token/12345";
mintNFT(sampleTokenURI);
