# 🚀 快速开始指南

这是一个简化版的部署和使用指南，帮助你快速上手 Monad 红包 DApp。

## 方案一：使用 Remix（推荐新手）⭐

### 步骤 1: 准备钱包

1. 安装 [MetaMask](https://metamask.io/) 浏览器扩展
2. 添加 Monad 网络到 MetaMask：
   - 打开 MetaMask，点击网络下拉菜单
   - 点击"添加网络"
   - 填写以下信息：
     ```
     网络名称: Monad Testnet
     RPC URL: https://rpc3.monad.xyz
     链 ID: 143
     货币符号: MON
     ```
3. 获取一些测试 MON 代币（从水龙头或测试网）

### 步骤 2: 部署合约

1. 打开 [Remix IDE](https://remix.ethereum.org/)
2. 创建新文件 `RedPacket.sol`
3. 复制 `RedPacket.sol` 的全部内容并粘贴
4. 点击左侧的"Solidity Compiler"图标（第二个）
5. 选择编译器版本 `0.8.0` 或更高
6. 点击"Compile RedPacket.sol"
7. 点击左侧的"Deploy & Run Transactions"图标（第三个）
8. 在"Environment"下拉菜单中选择"Injected Provider - MetaMask"
9. 确认 MetaMask 连接
10. 点击橙色的"Deploy"按钮
11. 在 MetaMask 弹窗中确认交易
12. 等待交易确认
13. **复制部署的合约地址**（在"Deployed Contracts"下方）

### 步骤 3: 配置前端

1. 打开项目中的 `app.html` 文件
2. 找到第 46 行（或搜索 `CONTRACT_ADDRESS`）：
   ```javascript
   const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
   ```
3. 将 `0x0000...` 替换为你刚才复制的合约地址
4. 保存文件

### 步骤 4: 运行应用

**方法 A: 使用 Python（如果已安装）**
```bash
cd /path/to/project
python3 -m http.server 8000
```

**方法 B: 使用 Node.js（如果已安装）**
```bash
cd /path/to/project
npx serve .
```

**方法 C: 直接打开**
- 直接在浏览器中打开 `app.html` 文件
- 注意：某些功能可能需要 HTTP 服务器才能正常工作

### 步骤 5: 开始使用

1. 在浏览器中访问 `http://localhost:8000/app.html`
2. 点击"连接钱包"按钮
3. 在 MetaMask 中授权连接
4. 开始发送和领取红包！🎉

---

## 方案二：使用 Hardhat（推荐开发者）🔧

### 步骤 1: 安装依赖

```bash
# 克隆或下载项目
cd monad-red-packet

# 安装 Node.js 依赖
npm install
```

### 步骤 2: 配置环境

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写你的私钥
# 使用文本编辑器打开 .env
nano .env  # 或 vim .env 或 code .env
```

在 `.env` 文件中填写：
```bash
PRIVATE_KEY=你的私钥（从 MetaMask 导出）
```

⚠️ **警告**: 永远不要将 `.env` 文件提交到 Git！

### 步骤 3: 编译合约

```bash
npm run compile
```

### 步骤 4: 部署合约

```bash
npm run deploy
```

部署成功后，你会看到：
```
✅ 合约部署成功!
合约地址: 0xabcd1234...
```

### 步骤 5: 配置前端

将合约地址更新到 `app.html` 的第 46 行（同方案一的步骤 3）

### 步骤 6: 运行应用

```bash
npm run serve
# 或
npm start
```

在浏览器中访问 `http://localhost:8000/app.html`

---

## 方案三：在线部署（无需本地环境）☁️

### 使用 Vercel 或 Netlify

1. 在 [Remix](https://remix.ethereum.org/) 中部署合约（参考方案一）
2. 获取合约地址后，在 `app.html` 中更新
3. 将整个项目上传到 GitHub
4. 在 [Vercel](https://vercel.com/) 或 [Netlify](https://www.netlify.com/) 中导入项目
5. 部署完成后，你会得到一个公开的 URL
6. 分享给朋友，一起抢红包！

---

## 测试合约（可选）

```bash
# 运行测试
npm test

# 查看测试覆盖率
npm run coverage
```

---

## 常见问题解决

### ❌ 钱包连接失败

**问题**: 点击"连接钱包"后没有反应

**解决方案**:
1. 确保已安装 MetaMask
2. 刷新页面重试
3. 检查浏览器控制台是否有错误信息
4. 确保允许网站访问 MetaMask

### ❌ 网络切换失败

**问题**: 提示切换到 Monad 网络失败

**解决方案**:
1. 手动在 MetaMask 中添加 Monad 网络（参考步骤 1）
2. 刷新页面

### ❌ 交易一直待确认

**问题**: 发送或领取红包后，交易长时间不确认

**解决方案**:
1. 等待 1-2 分钟（测试网可能较慢）
2. 在 MetaMask 中检查交易状态
3. 如果失败，重试并提高 Gas 价格

### ❌ 红包列表为空

**问题**: 连接钱包后看不到任何红包

**解决方案**:
1. 检查 `app.html` 中的合约地址是否正确配置
2. 确保合约已成功部署
3. 刷新页面
4. 发送一个测试红包

### ❌ 合约部署失败

**问题**: 在 Remix 中部署时失败

**解决方案**:
1. 确保钱包有足够的 MON 支付 Gas 费用
2. 检查是否连接到正确的网络（Chain ID: 143）
3. 尝试提高 Gas Limit
4. 检查 Monad RPC 是否正常运行

### ❌ 无法领取红包

**问题**: 点击领取后交易失败

**可能原因和解决方案**:
1. **已领取过** - 每个地址只能领取一次
2. **红包已抢完** - 检查剩余数量
3. **口令错误** - 确认口令正确
4. **是自己发的红包** - 不能领取自己的红包
5. **余额不足** - 需要 MON 支付 Gas 费用

---

## 下一步

🎓 **学习更多**:
- 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细部署指南
- 查看 [README.md](./README.md) 了解项目详情
- 研究 `RedPacket.sol` 学习智能合约开发

🔨 **自定义开发**:
- 修改 `app.html` 的 UI 样式
- 在智能合约中添加新功能
- 集成更多 Web3 功能

🚀 **部署到主网**:
- 进行充分的测试
- 进行安全审计
- 准备真实的 MON 代币
- 更新网络配置

---

## 需要帮助？

- 检查 [常见问题](./README.md#常见问题)
- 提交 [Issue](../../issues)
- 查看智能合约测试代码 `test/RedPacket.test.js`

祝你好运！🍀
