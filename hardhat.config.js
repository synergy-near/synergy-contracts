require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "localhost",
    solidity: "0.8.17",
    networks: {
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
        auroraTestnet: {
            url: process.env.AURORA_URL,
            accounts: [process.env.PRIVATE_KEY],
            gasMultiplier: 1.2,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: {
            auroraTestnet: process.env.AURORASCAN_API_KEY,
            goerli: process.env.ETHERSCAN_API_KEY,
        },
    },
};
