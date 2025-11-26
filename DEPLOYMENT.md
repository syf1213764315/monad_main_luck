# Monad 红包 DApp 部署说明

## 项目概述

这是一个运行在 Monad 链上的 Web3 红包应用，支持以下功能：

✅ 连接 Web3 钱包（MetaMask等）  
✅ 发送公共红包和口令红包  
✅ 拼手气（随机分配）和均分两种模式  
✅ 领取红包  
✅ 查看发送和领取历史  

## 文件说明

- `RedPacket.sol` - 智能合约源代码
- `app.html` - 完整的前端应用（包含所有功能）
- `index.html` - 原始 UI 模板（仅供参考）

## 部署步骤

### 1. 部署智能合约

#### 方法一：使用 Remix IDE（推荐）

1. 打开 [Remix IDE](https://remix.ethereum.org/)
2. 创建新文件 `RedPacket.sol`，粘贴 `RedPacket.sol` 的内容
3. 编译合约：
   - 选择 Solidity 编译器版本 `0.8.0` 或更高
   - 点击 "Compile RedPacket.sol"
4. 部署合约：
   - 切换到 "Deploy & Run Transactions" 标签
   - Environment 选择 "Injected Provider - MetaMask"
   - 确保 MetaMask 已连接到 Monad 网络：
     - Network Name: `Monad Testnet`
     - RPC URL: `https://rpc3.monad.xyz`
     - Chain ID: `143`
     - Currency Symbol: `MON`
   - 点击 "Deploy"
   - 在 MetaMask 中确认交易
5. 复制部署后的合约地址

#### 方法二：使用 Hardhat

```bash
# 安装依赖
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 初始化 Hardhat 项目
npx hardhat init

# 将 RedPacket.sol 复制到 contracts/ 目录

# 配置 hardhat.config.js
```

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    monad: {
      url: "https://rpc3.monad.xyz",
      chainId: 143,
      accounts: ["YOUR_PRIVATE_KEY"] // 注意：不要提交私钥到代码库
    }
  }
};
```

```bash
# 编译
npx hardhat compile

# 部署
npx hardhat run scripts/deploy.js --network monad
```

### 2. 配置前端

1. 打开 `app.html` 文件
2. 找到第 46 行的 `CONTRACT_ADDRESS` 常量
3. 将其替换为你部署的合约地址：

```javascript
const CONTRACT_ADDRESS = '0xYourContractAddressHere';
```

### 3. 运行应用

#### 方法一：本地运行

```bash
# 使用 Python 启动简单的 HTTP 服务器
python3 -m http.server 8000

# 或使用 Node.js
npx serve .
```

然后在浏览器中打开 `http://localhost:8000/app.html`

#### 方法二：部署到服务器

将 `app.html` 上传到任何静态网站托管服务：
- GitHub Pages
- Vercel
- Netlify
- AWS S3
- 任何 Web 服务器

### 4. 使用前准备

1. 安装 MetaMask 钱包扩展
2. 添加 Monad 网络到 MetaMask（应用会自动提示添加）
3. 获取一些测试 MON 代币（从水龙头或测试网获取）

## 使用说明

### 连接钱包

1. 点击页面右上角的 "连接钱包" 按钮
2. 在 MetaMask 中选择要连接的账户
3. 授权应用访问你的钱包
4. 如果网络不正确，应用会自动提示切换或添加 Monad 网络

### 发送红包

1. 点击底部 "发红包" 按钮
2. 选择红包类型：
   - **拼手气**：每个红包金额随机，增加趣味性
   - **普通均分**：每个红包金额相等
3. 输入总金额（MON）
4. 输入红包个数（1-100）
5. 选择领取方式：
   - **公共可见**：任何人都可以直接领取
   - **口令保护**：需要输入正确的口令才能领取
6. 如果选择口令保护，设置一个口令
7. 点击 "塞进红包" 按钮
8. 在 MetaMask 中确认交易
9. 等待交易确认

### 领取红包

#### 公共红包
1. 在红包大厅中找到想要领取的红包
2. 点击 "立即开抢" 按钮
3. 在 MetaMask 中确认交易
4. 等待交易确认，红包金额会自动转入你的钱包

#### 口令红包
1. 点击 "输入口令" 按钮
2. 在弹出的对话框中输入正确的口令
3. 点击 "开红包" 按钮
4. 在 MetaMask 中确认交易

### 查看历史

1. 点击底部 "记录" 按钮
2. 查看统计信息：
   - 你发出的红包数量
   - 你抢到的总金额
3. 查看详细记录：
   - **领取记录明细**：你领取过的所有红包
   - **发送记录**：你发送的所有红包及领取状态

## 智能合约功能说明

### 主要功能

- `createPacket()` - 创建红包
- `claimPacket()` - 领取红包
- `getPacket()` - 获取红包详情
- `getPacketClaims()` - 获取红包的所有领取记录
- `getUserSentPackets()` - 获取用户发送的红包列表
- `getUserReceivedPackets()` - 获取用户领取的红包列表
- `getRecentActivePackets()` - 获取最近的活跃红包

### 安全特性

- 每个地址只能领取一次同一个红包
- 发送者不能领取自己的红包
- 口令红包使用 keccak256 哈希验证
- 拼手气红包使用伪随机算法确保公平性
- 每个红包至少 0.001 MON

## 技术栈

- **智能合约**: Solidity ^0.8.0
- **前端**: React 18 (通过 CDN)
- **Web3 库**: ethers.js v5.7
- **样式**: Tailwind CSS
- **区块链**: Monad (Chain ID: 143)

## 注意事项

1. **合约地址配置**：部署合约后必须在 `app.html` 中更新 `CONTRACT_ADDRESS`
2. **网络配置**：确保 MetaMask 连接到正确的 Monad 网络
3. **Gas 费用**：每次交易需要支付 Gas 费用（MON）
4. **测试网**：如果是测试网，确保有足够的测试代币
5. **私钥安全**：永远不要在代码中硬编码私钥或助记词
6. **合约验证**：建议在区块浏览器上验证合约代码以提高透明度

## 常见问题

### Q: 钱包连接失败？
A: 检查是否安装了 MetaMask，并确保已授权网站访问钱包。

### Q: 交易一直不确认？
A: Monad 测试网可能存在延迟，耐心等待或提高 Gas 价格。

### Q: 无法切换到 Monad 网络？
A: 在 MetaMask 中手动添加网络，使用上述网络配置参数。

### Q: 红包列表不显示？
A: 确保合约地址配置正确，并且钱包已连接。刷新页面重试。

### Q: 领取红包失败？
A: 可能原因：
- 红包已被抢完
- 已经领取过该红包
- 口令错误
- 余额不足支付 Gas 费用

## 开发者信息

如需修改或扩展功能，请参考：
- [Solidity 文档](https://docs.soliditylang.org/)
- [ethers.js 文档](https://docs.ethers.org/v5/)
- [React 文档](https://react.dev/)

## 许可证

MIT License

---

祝你使用愉快！🎁🎉
