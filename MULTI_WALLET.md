# 🔐 多钱包登录功能说明

## 功能概述

Monad 红包 DApp 现已支持多种 Web3 钱包登录，用户可以选择自己喜欢的钱包进行连接。

## 支持的钱包

### 1. 浏览器扩展钱包

#### MetaMask 🦊
- **最流行的 Web3 钱包**
- 支持桌面端和移动端
- 下载地址: https://metamask.io/download/

#### Coinbase Wallet 🔵
- Coinbase 官方钱包
- 集成度高，易于使用
- 下载地址: https://www.coinbase.com/wallet

#### Trust Wallet ⭐
- 币安官方钱包
- 支持多链
- 下载地址: https://trustwallet.com/

#### 其他兼容钱包 💼
- 任何注入 `window.ethereum` 的钱包扩展
- 包括但不限于：Brave Wallet, Opera Wallet 等

### 2. 移动端钱包

#### WalletConnect 📱
- **通用移动钱包连接协议**
- 支持 200+ 移动钱包应用
- 通过扫码连接，安全便捷

**支持的主流钱包**：
- Rainbow Wallet
- Argent
- imToken
- TokenPocket
- Math Wallet
- SafePal
- 等等...

---

## 使用方法

### 连接钱包

1. **点击"连接钱包"按钮**
   - 页面右上角的"连接钱包"按钮
   - 或红包大厅中间的"连接钱包"按钮

2. **选择钱包类型**
   - 弹出钱包选择器
   - 显示所有可用的钱包选项
   - 每个钱包都有图标和说明

3. **完成连接**
   - 点击你想使用的钱包
   - 在钱包中授权连接
   - 如需要，添加/切换到 Monad 网络
   - 连接成功！

### 断开钱包

- 点击地址旁边的 ❌ 按钮即可断开
- WalletConnect 会自动清理连接

### 切换钱包

1. 先断开当前钱包
2. 重新点击"连接钱包"
3. 选择新的钱包类型

---

## 技术实现

### 核心功能

```javascript
// 检测可用钱包
detectWallets() 
// 返回当前环境中所有可用的钱包

// 连接指定钱包
connectWithWallet(walletType)
// walletType: 'metamask' | 'coinbase' | 'trust' | 'walletconnect' | 'injected'

// 断开连接
disconnectWallet()
// 清理所有连接状态
```

### 自动功能

1. **自动检测**
   - 自动检测浏览器中安装的钱包扩展
   - 显示相应的钱包图标和名称

2. **账户监听**
   - 监听账户切换事件
   - 账户改变时自动更新
   - 钱包断开时清理状态

3. **网络管理**
   - 自动切换到 Monad 网络
   - 如果网络不存在，自动添加
   - WalletConnect 使用预配置的 RPC

4. **状态保持**
   - 记住连接的钱包类型
   - 页面刷新时提示重新连接

---

## 开发者指南

### 添加新钱包支持

在 `detectWallets()` 函数中添加检测逻辑：

```javascript
// 检测新钱包
if (typeof window.ethereum !== 'undefined' && window.ethereum.isNewWallet) {
    wallets.push({ 
        id: 'newwallet', 
        name: '新钱包', 
        icon: '🔷' 
    });
}
```

### 自定义钱包连接

修改 `connectWithWallet()` 函数，添加新的连接逻辑：

```javascript
if (walletType === 'newwallet') {
    // 自定义连接逻辑
    const customProvider = await getCustomProvider();
    web3Provider = new ethers.providers.Web3Provider(customProvider);
}
```

---

## 常见问题

### Q1: 为什么我看不到某个钱包？

**A**: 可能的原因：
- 钱包扩展未安装
- 钱包扩展未启用
- 浏览器不兼容
- 需要刷新页面

### Q2: 可以同时连接多个钱包吗？

**A**: 不可以。一次只能连接一个钱包。如需切换，请先断开当前钱包。

### Q3: WalletConnect 连接后如何断开？

**A**: 
1. 在 DApp 中点击断开按钮
2. 或在钱包 App 中手动断开连接

### Q4: 钱包连接后刷新页面会怎样？

**A**: 需要重新连接钱包。出于安全考虑，我们不保存钱包连接状态。

### Q5: 支持哪些链？

**A**: 目前只支持 Monad Testnet (Chain ID: 143)。连接时会自动切换网络。

### Q6: 移动端怎么使用？

**A**: 
- **如果有钱包 App**：使用 App 内置浏览器打开 DApp
- **如果没有钱包 App**：选择 WalletConnect，使用钱包 App 扫码连接

---

## 安全提示

⚠️ **重要安全建议**：

1. **只从官方渠道下载钱包**
   - MetaMask: https://metamask.io
   - 其他钱包的官方网站

2. **验证连接地址**
   - 确保连接的是正确的 DApp
   - 检查浏览器地址栏

3. **保护私钥和助记词**
   - 永远不要分享给任何人
   - DApp 不会要求输入私钥

4. **授权前仔细检查**
   - 查看交易详情
   - 确认网络和金额

5. **使用测试网**
   - 先在测试网熟悉操作
   - 测试网代币无价值

---

## 更新日志

### v1.1.0 (当前版本)
- ✅ 添加多钱包支持
- ✅ 支持 WalletConnect
- ✅ 优化连接流程
- ✅ 添加钱包选择器 UI
- ✅ 改进错误处理

### v1.0.0
- 仅支持 MetaMask

---

## 技术栈

- **ethers.js 5.7**: Web3 核心库
- **WalletConnect v1.8**: 移动钱包连接协议
- **React 18**: UI 框架
- **Tailwind CSS**: 样式框架

---

## 贡献

欢迎贡献代码！如果你想添加对新钱包的支持：

1. Fork 项目
2. 添加钱包检测和连接逻辑
3. 测试功能
4. 提交 Pull Request

---

## 支持

遇到问题？
- 📖 查看 [README.md](./README.md)
- 📋 查看 [QUICKSTART.md](./QUICKSTART.md)
- 🐛 提交 Issue

---

## 相关资源

### 钱包文档
- [MetaMask Docs](https://docs.metamask.io/)
- [WalletConnect Docs](https://docs.walletconnect.com/)
- [Coinbase Wallet Docs](https://docs.cloud.coinbase.com/wallet-sdk/docs)

### Web3 开发
- [ethers.js Documentation](https://docs.ethers.org/v5/)
- [EIP-1193: Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)
- [EIP-3085: wallet_addEthereumChain](https://eips.ethereum.org/EIPS/eip-3085)

---

**享受多钱包支持带来的便利！** 🎉
