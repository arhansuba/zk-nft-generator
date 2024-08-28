// Import necessary libraries and contract artifacts
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // Retrieve the deployer account
    const [deployer] = await ethers.getSigners();

    console.log(`Deploying contracts with the account: ${deployer.address}`);

    // Compile contracts if necessary
    await hre.run('compile');

    // Deploy AccessControl contract
    const AccessControl = await ethers.getContractFactory("AccessControl");
    const accessControl = await AccessControl.deploy();
    await accessControl.deployed();
    console.log(`AccessControl deployed to: ${accessControl.address}`);

    // Deploy ZKCompression contract
    const ZKCompression = await ethers.getContractFactory("ZKCompression");
    const zkCompression = await ZKCompression.deploy();
    await zkCompression.deployed();
    console.log(`ZKCompression deployed to: ${zkCompression.address}`);

    // Deploy MetadataManager contract
    const MetadataManager = await ethers.getContractFactory("MetadataManager");
    const metadataManager = await MetadataManager.deploy();
    await metadataManager.deployed();
    console.log(`MetadataManager deployed to: ${metadataManager.address}`);

    // Deploy NFTGenerator contract
    const NFTGenerator = await ethers.getContractFactory("NFTGenerator");
    const nftGenerator = await NFTGenerator.deploy(zkCompression.address, metadataManager.address);
    await nftGenerator.deployed();
    console.log(`NFTGenerator deployed to: ${nftGenerator.address}`);

    // Set up initial roles and permissions
    const ADMIN_ROLE = await accessControl.ADMIN_ROLE();
    const MINTER_ROLE = await accessControl.MINTER_ROLE();

    await accessControl.grantRole(ADMIN_ROLE, deployer.address);
    await accessControl.grantRole(MINTER_ROLE, nftGenerator.address);

    console.log("Roles and permissions set up completed.");
}

// Execute the deploy script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
