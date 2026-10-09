// Hardhat 部署脚本
// 使用方法: npx hardhat run deploy.js --network monad

const hre = require("hardhat");

async function main() {
  console.log("开始部署 RedPacket 合约到 Monad 链...");
  
  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);
  
  // 获取账户余额
  const balance = await deployer.getBalance();
  console.log("账户余额:", hre.ethers.utils.formatEther(balance), "MON");
  
  // 部署合约
  const RedPacket = await hre.ethers.getContractFactory("RedPacket");
  console.log("正在部署合约...");
  
  const redPacket = await RedPacket.deploy();
  await redPacket.deployed();
  
  console.log("✅ 合约部署成功!");
  console.log("合约地址:", redPacket.address);
  console.log("");
  console.log("📝 下一步操作:");
  console.log("1. 复制上面的合约地址");
  console.log("2. 打开 index.html 文件");
  console.log("3. 找到 CONTRACT_ADDRESS 常量");
  console.log("4. 将合约地址替换进去");
  console.log("");
  console.log("🔗 在区块浏览器上验证合约:");
  console.log("合约地址:", redPacket.address);
  console.log("构造函数参数: 无");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
