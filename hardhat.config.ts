import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({path: __dirname + '/.env'});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17"
  },
  networks: {
      hardhat: {
          // mining: {
          //   auto: false,
          //   interval: [5000, 5000],
          // },
          chainId: 43114,
          forking: {
              url: process.env.FORK_URL_OVERRIDE || "https://rpc.ankr.com/eth",
          },
          accounts: [
            {
              balance: "100000000000000000000000000000",
              privateKey: process.env.PRIVATE_KEY as string,
            },
          ],
      },

      teth: {
          url: "https://goerli.infura.io/v3/",
          accounts: [process.env.PRIVATE_KEY as string || '']
      },
      tbsc: {
          url: "https://data-seed-prebsc-1-s1.binance.org:8545",
          accounts: [process.env.PRIVATE_KEY as string || '']
      },
      tmat: {
          url: "https://rpc-mumbai.maticvigil.com/",
          accounts: [process.env.PRIVATE_KEY as string || '']
      },
      bsc: {
          url: "https://bsc-dataseed1.binance.org/",
          accounts: [process.env.PRIVATE_KEY as string || '']
      },
      eth: {
          url: "https://mainnet.infura.io/v3/",
          accounts: [process.env.PRIVATE_KEY as string || '']
      },
      mat: {
        url: "https://mainnet.infura.io/v3/",
        accounts: [process.env.PRIVATE_KEY as string || '']
      }
  },
  etherscan: {
      apiKey: process.env.BSCSCAN_KEY || undefined,
  },
  mocha: {
      timeout: 100000000,
  },
  gasReporter: {
      enabled: process.env.REPORT_GAS !== undefined,
      currency: "USD",
  },
};

export default config;