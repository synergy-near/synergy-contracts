const hre = require("hardhat");
const ethers = hre.ethers;
const config = require("./contracts.json");

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

async function deployMockDataFeed(assetName, assetPrice) {
    const MockDataFeed = await ethers.getContractFactory("MockDataFeed");
    const mockDataFeed = await MockDataFeed.deploy(assetName, assetPrice);
    await mockDataFeed.deployed();
    console.log("=======================");
    console.log("MockDataFeed for { %s } deployed at { %s }", assetName, mockDataFeed.address);

    return mockDataFeed;
}

async function createSynt(name, symbol, synter, oracle, price) {
    synt = await deploySynt(name, symbol);

    await synt.initialize(synter.address);
    dataFeed = await deployMockDataFeed(name, price);
    await oracle.changeFeed(synt.address, dataFeed.address);
    await synter.addSynt(synt.address, true);
    console.log("Synt { %s } set with price { %s }", name, synt.address, price / 1e18);
    return synt;
}

async function addSynt(name, symbol, synter, oracle, feedAddress) {
    synt = await deploySynt(name, symbol);

    await synt.initialize(synter.address);
    await oracle.changeFeed(synt.address, feedAddress);
    await synter.addSynt(synt.address, true);
    console.log("Synt { %s } set with feed { %s }", synt.address, feedAddress);
    return synt;
}

async function addTruflationSynt(name, symbol, synter, oracle, feedAddress) {
    synt = await deploySynt(name, symbol);
    await synt.initialize(synter.address);
    await oracle.changeTruflationFeed(synt.address, feedAddress);
    await synter.addSynt(synt.address, true);
    console.log("Truflation Synt { %s } set with feed { %s }", synt.address, feedAddress);
    return synt;
}

async function main() {
    Synter = await ethers.getContractFactory("Synter");
    synter = await Synter.attach("0x771bc3da4AEfAd4D1DDE0D03A28e8043969E0569");

    Oracle = await ethers.getContractFactory("Oracle");
    oracle = await Oracle.attach("0x033Fa01fE5E7D2FEcaa370F7d09FA730CA2E7a6B");

    // const MockDataFeed = await ethers.getContractFactory("MockDataFeed");
    // dataFeed = await MockDataFeed.attach(config.RGAS_DATAFEED);
    // dataFeed.changePrice(ethers.utils.parseEther("12.8"));
    // console.log("Price set : %s", ethers.utils.parseEther("12.8"));

    // await addTruflationSynt("Housing Prices Index", "rHPI", synter, oracle, config.TRUFLATION);

    // rGld = await createSynt("GOLD", "rGLD", synter, oracle, ethers.utils.parseEther("1700")); // 1700 per ounce
    rGas = await createSynt("GAS", "rGAS", synter, oracle, ethers.utils.parseEther("6.4")); // 6.4$ per gallon

    // await oracle.changeFeed(rGld.address, config.DATAFEED_RGLD);
    // await oracle.changeFeed(rGas.address, config.DATAFEED_RGAS);
    await oracle.changeFeed(
        "0x18Cd2C6dD35EED4c06226618A2717F61A7FDAa0e",
        "0xf7ab5C5F2057687B4F17151Cf7E16A47f3B5917D"
    );
    await oracle.changeFeed(
        "0xDA14187c837aB47f997a6DDceFc094A633439704",
        "0x43A6868d3eAb8cC0024390BB874Cf0812a373Cc5"
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
