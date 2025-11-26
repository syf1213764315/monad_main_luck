# 🎁 Monad 红包 DApp

一个运行在 Monad 链上的 Web3 红包应用，支持公共红包、口令红包、拼手气和均分等多种模式。

## ✨ 功能特性

- 🔗 **多钱包支持** - 支持 MetaMask、Coinbase Wallet、Trust Wallet、WalletConnect 等多种钱包
- 🎲 **拼手气红包** - 随机金额分配，增加趣味性
- ⚖️ **均分红包** - 公平分配，每人金额相等
- 🔐 **口令红包** - 需要正确口令才能领取
- 🌍 **公共红包** - 任何人都可以直接领取
- 📊 **历史记录** - 查看发送和领取的所有红包
- 🔄 **实时更新** - 自动刷新红包状态
- 📱 **响应式设计** - 完美适配移动端和桌面端

## 🚀 快速开始

### 1. 部署智能合约

使用 Remix IDE 或 Hardhat 部署 `RedPacket.sol` 到 Monad 链。

详细步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 2. 配置前端

在 `app.html` 中更新合约地址：

```javascript
const CONTRACT_ADDRESS = '0xYourContractAddressHere';
```

### 3. 运行应用

```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node.js
npx serve .
```

访问 `http://localhost:8000/app.html`

## 📁 项目结构

```
├── RedPacket.sol       # 智能合约
├── app.html           # 完整的前端应用（主文件）
├── index.html         # 原始 UI 模板（仅供参考）
├── README.md          # 项目说明
└── DEPLOYMENT.md      # 详细部署指南
```

## 🔧 技术栈

- **智能合约**: Solidity ^0.8.0
- **前端框架**: React 18
- **Web3 库**: ethers.js v5.7, WalletConnect v1.8
- **样式框架**: Tailwind CSS
- **区块链**: Monad (Chain ID: 143, RPC: https://rpc3.monad.xyz)

## 💼 支持的钱包

本 DApp 支持多种 Web3 钱包连接方式：

### 浏览器扩展钱包
- 🦊 **MetaMask** - 最流行的 Web3 钱包
- 🔵 **Coinbase Wallet** - Coinbase 官方钱包
- ⭐ **Trust Wallet** - 币安官方钱包
- 💼 **其他兼容钱包** - 任何注入 `window.ethereum` 的钱包

### 移动端钱包
- 📱 **WalletConnect** - 支持 200+ 移动钱包
  - Rainbow Wallet
  - imToken
  - TokenPocket
  - Math Wallet
  - 等等...

> 详细说明请查看 [MULTI_WALLET.md](./MULTI_WALLET.md)

## 📖 使用说明

### 发送红包

1. 连接钱包
2. 点击 "发红包"
3. 选择类型（拼手气/均分）
4. 输入金额和个数
5. 选择公共或口令保护
6. 确认交易

### 领取红包

1. 在红包大厅找到红包
2. 点击 "立即开抢"（公共）或 "输入口令"（口令红包）
3. 确认交易
4. 红包金额自动转入钱包

### 查看历史

- **我发出的**: 查看所有发送的红包及领取状态
- **我抢到的**: 查看所有领取的红包和总金额

## 🔒 安全特性

- ✅ 每个地址只能领取一次同一个红包
- ✅ 发送者不能领取自己的红包
- ✅ 口令使用 keccak256 哈希加密
- ✅ 拼手气算法确保公平性
- ✅ 最小红包金额限制（0.001 MON）

## 📝 合约接口

### 核心功能

```solidity
// 创建红包
function createPacket(
    uint256 count,
    PacketType packetType,
    AccessType accessType,
    string memory password
) external payable returns (uint256)

// 领取红包
function claimPacket(uint256 packetId, string memory password) external

// 获取红包详情
function getPacket(uint256 packetId) external view returns (...)

// 获取用户历史
function getUserSentPackets(address user) external view returns (uint256[])
function getUserReceivedPackets(address user) external view returns (uint256[])
```

## 🌐 网络配置

### Monad Testnet

- **Network Name**: Monad Testnet
- **RPC URL**: https://rpc3.monad.xyz
- **Chain ID**: 143
- **Currency Symbol**: MON
- **Block Explorer**: (如果有请添加)

## 🐛 常见问题

**Q: 钱包连接失败？**  
A: 
- 确保已安装钱包扩展并授权网站访问
- 尝试其他支持的钱包
- 使用 WalletConnect 连接移动钱包

**Q: 我可以使用哪些钱包？**  
A: 支持 MetaMask、Coinbase Wallet、Trust Wallet、WalletConnect 等。点击"连接钱包"查看所有可用选项。

**Q: 如何在移动端使用？**  
A: 
- 使用钱包 App 的内置浏览器打开 DApp
- 或选择 WalletConnect 用手机钱包扫码连接

**Q: 可以切换钱包吗？**  
A: 可以。先点击断开按钮，然后重新选择其他钱包连接。

**Q: 交易不确认？**  
A: 测试网可能存在延迟，耐心等待或提高 Gas 价格。

**Q: 红包列表为空？**  
A: 检查合约地址配置是否正确，确保钱包已连接。

**Q: 无法切换网络？**  
A: 手动在钱包中添加 Monad 网络，或使用支持自动添加网络的钱包。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请提交 Issue。

---

**⚠️ 重要提示**：
- 部署合约后务必更新 `app.html` 中的合约地址
- 不要在代码中硬编码私钥
- 测试网仅用于测试，不要使用真实资产
- 主网部署前请进行充分测试和安全审计

祝你使用愉快！🎉
