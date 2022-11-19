const hre = require("hardhat");
const ethers = hre.ethers;
const config = require("./contracts.json");

async function main() {
    Housing = await ethers.getContractFactory("TruflationHousing");
    housing = await Housing.deploy();

    console.log("TruflationHousing deployed at { %s }", housing.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
