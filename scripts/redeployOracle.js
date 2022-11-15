const hre = require("hardhat");
const ethers = hre.ethers;
const config = require("./contracts.json");

async function deployOracle() {
    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy();
    await oracle.deployed();
    console.log("=======================");
    console.log("Oracle deployed at { %s }", oracle.address);

    return oracle;
}

async function main() {
    oracle = await deployOracle();

    Insurance = await ethers.getContractFactory("Insurance");
    insurance = await Insurance.attach(config.INSURANCE);

    Synergy = await ethers.getContractFactory("Synergy");
    synergy = await Synergy.attach(config.SYNERGY);

    Synter = await ethers.getContractFactory("Synter");
    synter = await Synter.attach(config.SYNTER);

    Loan = await ethers.getContractFactory("Loan");
    loan = await Loan.attach(config.LOAN);

    await oracle.initialize(
        config.RUSD // _rUsd,
    );

    await insurance.initialize(
        config.RUSD, // _rUsd
        config.RAW, // _raw
        config.SYNERGY, // _synergy
        oracle.address // _oracle
    );

    await synergy.initialize(
        config.RUSD, // _rUsd,
        config.WETH, // _wEth,
        config.RAW, // _raw,
        config.SYNTER, // _synter,
        oracle.address, // _oracle,
        config.TREASURY, // _treasury,
        config.LOAN, // _loan,
        config.INSURANCE // _insurance
    );

    await synter.initialize(
        config.RUSD, // _rUsdAddress,
        config.SYNERGY, // _synergyAddress,
        config.LOAN, // _loanAddress,
        oracle.address, // _oracle,
        config.TREASURY // _treasury
    );

    await loan.initialize(
        config.RUSD, // ISynt(_rUsd);
        config.SYNTER, // ISynter(_synter);
        config.TREASURY, // ITreasury(_treasury);
        oracle.address // IOracle(_oracle);
    );

    await oracle.changeFeed(config.RGLD, config.DATAFEED_RGLD);
    await oracle.changeFeed(config.RGAS, config.DATAFEED_RGAS);
    await oracle.changeFeed(config.RAW, config.DATAFEED_RAW);
    await oracle.changeTruflationFeed(config.RHPI, config.TRUFLATION);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
