// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ZKCompression.sol";

contract NFTGenerator is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Counter for token IDs
    Counters.Counter private _tokenIdCounter;

    // Base URI for metadata
    string private _baseTokenURI;

    // Mapping from token ID to compressed metadata hash
    mapping(uint256 => bytes32) private _tokenMetadataHashes;

    // zkCompression contract instance
    ZKCompression public zkCompression;

    // Events
    event NFTMinted(address indexed to, uint256 tokenId, bytes32 metadataHash);

    // Constructor to initialize the contract
    constructor(string memory name, string memory symbol, address zkCompressionAddress) ERC721(name, symbol) {
        zkCompression = ZKCompression(zkCompressionAddress);
    }

    // Set base URI for metadata
    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    // Function to mint a new NFT
    function mintNFT(address to, string memory metadata, bytes memory proof) external onlyOwner returns (uint256) {
        // Compress metadata and verify zk-SNARK proof
        bytes32 metadataHash = zkCompression.submitAndCompressMetadata(metadata, proof);

        // Increment the token ID counter and mint the NFT
        uint256 tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);
        _tokenIdCounter.increment();

        // Store the metadata hash
        _tokenMetadataHashes[tokenId] = metadataHash;

        emit NFTMinted(to, tokenId, metadataHash);
        return tokenId;
    }

    // Function to get token metadata hash
    function getTokenMetadataHash(uint256 tokenId) external view returns (bytes32) {
        require(_exists(tokenId), "ERC721: Query for nonexistent token");
        return _tokenMetadataHashes[tokenId];
    }

    // Override baseURI function from ERC721 to use custom base URI
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Optional: Override tokenURI function to return a token-specific URI if needed
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    // Update zkCompression contract address
    function updateZKCompression(address newAddress) external onlyOwner {
        require(newAddress != address(0), "Invalid address");
        zkCompression = ZKCompression(newAddress);
    }
}
