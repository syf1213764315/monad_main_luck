require("@nomicfoundation/hardhat-toolbox");

// 如果你想使用环境变量，创建 .env 文件并安装 dotenv
// npm install dotenv
// require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Monad 测试网配置
    monad: {
      url: "https://rpc3.monad.xyz",
      chainId: 143,
      // 请使用环境变量或其他安全方式管理私钥
      // accounts: [process.env.PRIVATE_KEY]
      // 或者使用助记词
      // accounts: {
      //   mnemonic: process.env.MNEMONIC
      // }
    },
    
    // 本地测试网络
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  
  // Gas 报告配置（可选）
  gasReporter: {
    enabled: true,
    currency: "USD"
  },
  
  // 合约验证配置（如果 Monad 支持）
  etherscan: {
    // apiKey: process.env.ETHERSCAN_API_KEY
  }
};
