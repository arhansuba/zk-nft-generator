// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IZKVerifier {
    function verifyProof(bytes memory proof) external view returns (bool);
}
