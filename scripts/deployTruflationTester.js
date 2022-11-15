const hre = require("hardhat");
const ethers = hre.ethers;
const config = require("./contracts.json");

async function main() {
    Tester = await ethers.getContractFactory("TruflationTester");
    tester = await Tester.deploy(
        "0xcf72083697aB8A45905870C387dC93f380f2557b",
        "8b459447262a4ccf8863962e073576d9",
        1000000000000
    );

    console.log("TruflationTester deployed at { %s }", tester.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
