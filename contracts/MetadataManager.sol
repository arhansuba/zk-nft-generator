// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ZKCompression.sol";

contract MetadataManager is Ownable {
    using Counters for Counters.Counter;

    // Counter for metadata IDs
    Counters.Counter private _metadataIdCounter;

    // zkCompression contract instance
    ZKCompression public zkCompression;

    // Mapping from metadata ID to compressed metadata hash
    mapping(uint256 => bytes32) private _metadataHashes;

    // Mapping from metadata ID to original metadata (optional, for reference)
    mapping(uint256 => string) private _metadataOriginals;

    // Events
    event MetadataStored(uint256 indexed metadataId, bytes32 compressedHash);
    event MetadataRetrieved(uint256 indexed metadataId, string originalMetadata);

    // Constructor to initialize the contract
    constructor(address zkCompressionAddress) {
        zkCompression = ZKCompression(zkCompressionAddress);
    }

    // Function to store metadata with zk-SNARK compression
    function storeMetadata(string memory metadata, bytes memory proof) external onlyOwner returns (uint256) {
        require(bytes(metadata).length > 0, "Metadata cannot be empty");

        // Compress the metadata using zk-SNARKs and verify proof
        bytes32 compressedHash = zkCompression.submitAndCompressMetadata(metadata, proof);

        // Increment the metadata ID counter and store the metadata
        uint256 metadataId = _metadataIdCounter.current();
        _metadataIdCounter.increment();

        // Store compressed metadata hash
        _metadataHashes[metadataId] = compressedHash;
        _metadataOriginals[metadataId] = metadata;

        emit MetadataStored(metadataId, compressedHash);

        return metadataId;
    }

    // Function to retrieve metadata by ID
    function retrieveMetadata(uint256 metadataId, bytes memory proof) external view returns (string memory) {
        require(_metadataHashes[metadataId] != bytes32(0), "Metadata ID does not exist");

        // Verify zk-SNARK proof for decompression
        bool validProof = zkCompression.verifyProof(proof);
        require(validProof, "Invalid zk-SNARK proof");

        // Return the original metadata
        string memory originalMetadata = _metadataOriginals[metadataId];

        emit MetadataRetrieved(metadataId, originalMetadata);

        return originalMetadata;
    }

    // Update zkCompression contract address
    function updateZKCompression(address newAddress) external onlyOwner {
        require(newAddress != address(0), "Invalid address");
        zkCompression = ZKCompression(newAddress);
    }
}
