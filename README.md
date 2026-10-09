# 🎁 Monad 红包 DApp

[English](./README.en.md) · [中文](#monad-红包-dapp)

一个运行在 [Monad](https://monad.xyz) 主网上的 Web3 红包应用，支持公共红包、口令红包、拼手气和均分等多种模式。

**Deployed as a static site on [Netlify](https://www.netlify.com).** 打开仓库根目录的 `index.html` 即可使用，无需构建步骤。

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/syf1213764315/monad_main_luck)

## ✨ 功能特性

- 🟣 **Monad 原生体验** - Monad 品牌视觉、MON 计价、自动添加 Monad Mainnet
- 🔗 **多钱包支持** - MetaMask、Coinbase Wallet、Trust Wallet、WalletConnect
- 🎲 **拼手气红包** - 随机金额分配
- ⚖️ **均分红包** - 每人金额相等
- 🔐 **口令红包** - 需要正确口令才能领取
- 🌍 **公共红包** - 任何人都可以直接领取
- 📊 **历史记录** - 查看发送和领取的所有红包
- 🔄 **实时更新** - 自动刷新红包状态
- 📱 **响应式设计** - 适配移动端和桌面端

## 🚀 快速开始

### 1. 一键部署到 Netlify（推荐）

1. 将本仓库推送到 GitHub
2. 打开 [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. 选择该仓库。构建配置已写在 `netlify.toml` 中：
   - **Build command**: 无需真实构建（静态站点）
   - **Publish directory**: `.`
4. 点击 **Deploy site**
5. 部署完成后访问 Netlify 分配的 URL（也可绑定自定义域名）

也可以使用上面的 **Deploy to Netlify** 按钮，或把仓库拖到 [Netlify Drop](https://app.netlify.com/drop)。

本地预览：

```bash
npx --yes serve .
# 打开 http://localhost:3000
```

### 2. 部署智能合约

使用 Remix IDE 或 Hardhat 将 `RedPacket.sol` 部署到 **Monad Mainnet**。

详细步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 3. 配置前端

在 `index.html` 中更新合约地址：

```javascript
const CONTRACT_ADDRESS = '0xYourContractAddressHere';
```

保存后重新部署到 Netlify（Git 推送会自动触发）。

## 📁 项目结构

```
├── index.html          # 前端应用（Netlify 入口）
├── app.html            # 兼容旧链接，跳转到 index.html
├── RedPacket.sol       # 智能合约
├── netlify.toml        # Netlify 部署配置
├── assets/             # Monad 图标与 favicon
├── README.md           # 中文说明
├── README.en.md        # English README
└── DEPLOYMENT.md       # 合约 + Netlify 部署指南
```

## 🔧 技术栈

- **智能合约**: Solidity ^0.8.0
- **前端**: React 18（CDN，无构建）
- **Web3**: ethers.js v5.7, WalletConnect v1.8
- **样式**: Tailwind CSS + Monad 品牌色
- **托管**: Netlify 静态站点
- **区块链**: Monad Mainnet（Chain ID `143`，RPC `https://rpc.monad.xyz`）

## 💼 支持的钱包

### 浏览器扩展钱包
- 🦊 **MetaMask**
- 🔵 **Coinbase Wallet**
- ⭐ **Trust Wallet**
- 💼 任何注入 `window.ethereum` 的钱包

### 移动端钱包
- 📱 **WalletConnect**（Rainbow、imToken、TokenPocket 等）

> 详细说明请查看 [MULTI_WALLET.md](./MULTI_WALLET.md)

## 📖 使用说明

### 发送红包

1. 连接钱包（应用会提示切换到 Monad）
2. 点击「发红包」
3. 选择类型（拼手气 / 均分）
4. 输入金额和个数
5. 选择公共或口令保护
6. 确认交易

### 领取红包

1. 在红包大厅找到红包
2. 点击「立即开抢」或「输入口令」
3. 确认交易
4. MON 自动转入钱包

### 查看历史

- **我发出的**: 发送的红包及领取进度
- **我抢到的**: 领取记录和累计金额

## 🔒 安全特性

- ✅ 每个地址只能领取一次同一个红包
- ✅ 发送者不能领取自己的红包
- ✅ 口令使用 keccak256 哈希
- ✅ 拼手气算法保证每人至少有一份
- ✅ 最小红包金额限制（0.001 MON）

## 📝 合约接口

```solidity
function createPacket(
    uint256 count,
    PacketType packetType,
    AccessType accessType,
    string memory password
) external payable returns (uint256)

function claimPacket(uint256 packetId, string memory password) external

function getPacket(uint256 packetId) external view returns (...)

function getUserSentPackets(address user) external view returns (uint256[])
function getUserReceivedPackets(address user) external view returns (uint256[])
```

## 🌐 网络配置

### Monad Mainnet

| 参数 | 值 |
|------|-----|
| Network Name | Monad |
| RPC URL | https://rpc.monad.xyz |
| Chain ID | 143 |
| Currency | MON |
| Explorer | https://monadvision.com |

备用 RPC：`https://rpc3.monad.xyz`

## 🐛 常见问题

**Q: 钱包连接失败？**  
A: 确认已安装钱包扩展并授权本站；或改用 WalletConnect。

**Q: 如何在移动端使用？**  
A: 用钱包 App 内置浏览器打开 Netlify 站点，或通过 WalletConnect 扫码。

**Q: 无法切换网络？**  
A: 在钱包中手动添加上表中的 Monad 网络参数。

**Q: 红包列表为空？**  
A: 检查 `index.html` 中的合约地址，并确认钱包已连接到 Monad Mainnet。

**Q: Netlify 部署后页面空白？**  
A: 发布目录必须是仓库根目录 `.`，入口文件为 `index.html`。不要设置错误的 build command。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

MIT License

---

**⚠️ 重要提示**

- 部署合约后务必更新 `index.html` 中的合约地址
- 不要在代码中硬编码私钥
- 主网使用真实 MON，部署前请充分测试并考虑安全审计

祝你在 Monad 上发红包愉快！🎉
