// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IZKVerifier.sol";

contract ZKCompression is Ownable {
    // Events for logging purposes
    event MetadataCompressed(address indexed user, bytes32 compressedHash);
    event MetadataDecompressed(address indexed user, string metadata);

    // Structure to store compressed metadata
    struct CompressedMetadata {
        bytes32 compressedHash; // The zk-SNARK compressed hash of metadata
        string originalMetadata; // Optionally store the original metadata for proof validation
        bool exists;
    }

    // Mapping to store compressed metadata against user addresses
    mapping(address => CompressedMetadata) public compressedData;

    // Interface for the zk-SNARK Verifier
    IZKVerifier public zkVerifier;

    // Constructor to initialize zkVerifier contract address
    constructor(address _zkVerifier) {
        zkVerifier = IZKVerifier(_zkVerifier);
    }

    // Function to submit and compress metadata using zk-SNARKs
    function submitAndCompressMetadata(
        string memory metadata,
        bytes memory proof
    ) external returns (bytes32) {
        require(bytes(metadata).length > 0, "Metadata cannot be empty");

        // Compress the metadata using zk-SNARKs (off-chain, but store the compressed proof hash)
        bytes32 compressedHash = keccak256(abi.encodePacked(metadata));

        // Verify the zk-SNARK proof (off-chain)
        bool validProof = zkVerifier.verifyProof(proof);
        require(validProof, "Invalid zk-SNARK proof");

        // Store compressed metadata in the contract
        compressedData[msg.sender] = CompressedMetadata({
            compressedHash: compressedHash,
            originalMetadata: metadata,
            exists: true
        });

        emit MetadataCompressed(msg.sender, compressedHash);

        return compressedHash;
    }

    // Function to decompress metadata using zk-SNARK verification
    function decompressMetadata(
        bytes32 compressedHash,
        bytes memory proof
    ) external view returns (string memory) {
        require(compressedData[msg.sender].exists, "No metadata found for user");
        require(compressedData[msg.sender].compressedHash == compressedHash, "Hash mismatch");

        // Verify zk-SNARK proof for decompression
        bool validProof = zkVerifier.verifyProof(proof);
        require(validProof, "Invalid zk-SNARK proof");

        // Return the original metadata after decompression
        string memory originalMetadata = compressedData[msg.sender].originalMetadata;

        emit MetadataDecompressed(msg.sender, originalMetadata);

        return originalMetadata;
    }

    // Update the zkVerifier contract address in case of upgrades
    function updateVerifier(address _newVerifier) external onlyOwner {
        require(_newVerifier != address(0), "Invalid verifier address");
        zkVerifier = IZKVerifier(_newVerifier);
    }
}
