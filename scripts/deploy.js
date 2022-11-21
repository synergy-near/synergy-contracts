const hre = require("hardhat");
const ethers = hre.ethers;

async function deployTreasury() {
    const owner = await ethers.getSigner();
    const Treasury = await ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy();
    await treasury.deployed();
    console.log("=======================");
    console.log("Treasury deployed at { %s }", treasury.address);

    return treasury;
}

async function deploySynter() {
    const Synter = await ethers.getContractFactory("Synter");
    const synter = await Synter.deploy(
        3e4 // _swapFee (0,03%)
    );
    await synter.deployed();
    console.log("=======================");
    console.log("Synter deployed at { %s }", synter.address);

    return synter;
}

async function deploySynt(name, symbol) {
    const Synt = await ethers.getContractFactory("Synt");
    const synt = await Synt.deploy(
        name, // name
        symbol, // symbol
        ethers.utils.parseEther("1000000000") // maxSupply
    );
    await synt.deployed();
    console.log("=======================");
    console.log("Synt { %s } deployed at { %s }", name, synt.address);

    return synt;
}

async function deploySynergy() {
    const Synergy = await ethers.getContractFactory("Synergy");
    const synergy = await Synergy.deploy(
        2e8, // _minCollateralRatio, (200%)
        15e7, // _liquidationCollateralRatio, (150%)
        1e7, // _liquidationPenalty, (10%)
        1e7 // _treasuryFee (10%)
    );
    await synergy.deployed();
    console.log("=======================");
    console.log("Synergy deployed at { %s }", synergy.address);

    return synergy;
}

async function deployOracle() {
    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy();
    await oracle.deployed();
    console.log("=======================");
    console.log("Oracle deployed at { %s }", oracle.address);

    return oracle;
}

async function deployLoan() {
    const Loan = await ethers.getContractFactory("Loan");
    const loan = await Loan.deploy(
        15e7, // _minCollateralRatio, (150%)
        12e7, // _liquidationCollateralRatio, (120%)
        1e7, // _liquidationPenalty, (10%)
        1e7 // _treasuryFee); (10%)
    );
    await loan.deployed();
    console.log("=======================");
    console.log("Loan deployed at { %s }", loan.address);

    return loan;
}

async function deployInsurance() {
    const Insurance = await ethers.getContractFactory("Insurance");
    const insurance = await Insurance.deploy(
        2592000, // _minLockTime (30 days)
        63070000 // _maxLockTime (2 years)
    );
    await insurance.deployed();
    console.log("=======================");
    console.log("Insurance deployed at { %s }", insurance.address);

    return insurance;
}

async function deployRaw() {
    const Raw = await ethers.getContractFactory("Raw");
    const raw = await Raw.deploy();
    await raw.deployed();
    console.log("=======================");
    console.log("RAW deployed at { %s }", raw.address);

    return raw;
}

async function deployMockWeth() {
    const MockWeth = await ethers.getContractFactory("MockWeth");
    const mockWeth = await MockWeth.deploy();
    await mockWeth.deployed();
    console.log("=======================");
    console.log("MockWeth deployed at { %s }", mockWeth.address);

    return mockWeth;
}

async function deployMockDataFeed(assetName, assetPrice) {
    const MockDataFeed = await ethers.getContractFactory("MockDataFeed");
    const mockDataFeed = await MockDataFeed.deploy(assetName, assetPrice);
    await mockDataFeed.deployed();
    console.log("=======================");
    console.log("MockDataFeed for { %s } deployed at { %s }", assetName, mockDataFeed.address);

    return mockDataFeed;
}

async function main() {
    // treasury = await deployTreasury();
    Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.attach("0xcB8ADE5a0122D2Ee4fD91b0d533d4d7c63044ce7");
    // synter = await deploySynter(); // need init
    Synter = await ethers.getContractFactory("Synter");
    synter = await Synter.attach("0x771bc3da4AEfAd4D1DDE0D03A28e8043969E0569");
    // rUsd = await deploySynt("Raw USD", "rUSD"); // need init
    Rusd = await ethers.getContractFactory("Synt");
    rUsd = await Rusd.attach("0xeb8514f2f953E7c266C4dc08477f28089c793dd1");
    // synergy = await deploySynergy(); // need init
    Synergy = await ethers.getContractFactory("Synergy");
    synergy = Synergy.attach("0x3020F71F49bB99920368A3f068f437880391F094");
    // oracle = await deployOracle(); // need init
    Oracle = await ethers.getContractFactory("Oracle");
    oracle = await Oracle.attach("0x033Fa01fE5E7D2FEcaa370F7d09FA730CA2E7a6B");
    // loan = await deployLoan(); // need init
    Loan = await ethers.getContractFactory("Loan");
    loan = await Loan.attach("0x4d19BC4b07F97926544CEAC7CaAA6023F942A720");
    // insurance = await deployInsurance(); // need init
    Insurance = await ethers.getContractFactory("Insurance");
    insurance = await Insurance.attach("0x1FA0c70dD4A072eF4F21dFbD98c708889eFF5f59");
    //raw = await deployRaw(); // need init
    Raw = await ethers.getContractFactory("Raw");
    raw = await Raw.attach("0x18Cd2C6dD35EED4c06226618A2717F61A7FDAa0e");
    //wEth = await deployMockWeth();
    Weth = await ethers.getContractFactory("MockWeth");
    wEth = Weth.attach("0xDA14187c837aB47f997a6DDceFc094A633439704");

    await synter.initialize(
        rUsd.address, // _rUsdAddress,
        synergy.address, // _synergyAddress,
        loan.address, // _loanAddress,
        oracle.address, // _oracle,
        treasury.address // _treasury
    );

    await synergy.initialize(
        rUsd.address, // _rUsd,
        wEth.address, // _wEth, !!! todo
        raw.address, // _raw,
        synter.address, // _synter,
        oracle.address, // _oracle,
        treasury.address, // _treasury,
        loan.address, // _loan,
        insurance.address // _insurance
    );

    await rUsd.initialize(
        synter.address // _synter
    );

    await oracle.initialize(
        rUsd.address // _rUsd
    );

    await insurance.initialize(
        rUsd.address, // _rUsd
        raw.address, // _raw
        synergy.address, // _synergy
        oracle.address // _oracle
    );

    await loan.initialize(
        rUsd.address, // ISynt(_rUsd);
        synter.address, // ISynter(_synter);
        oracle.address, // IOracle(_oracle);
        treasury.address // ITreasury(_treasury);
    );

    await raw.initialize(
        insurance.address // _insurance
    );

    // set datafeed for RAW with price 10$
    dataFeed = await deployMockDataFeed("RAW", ethers.utils.parseEther("10"));
    await oracle.changeFeed(raw.address, dataFeed.address);

    // set datafeed for wETH
    dataFeed = await deployMockDataFeed("WETH", ethers.utils.parseEther("1200"));
    await oracle.changeFeed(wEth.address, dataFeed.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
