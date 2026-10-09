// 演示脚本 - 展示红包合约的各种功能
// 使用方法: npx hardhat run scripts/demo.js --network monad

const hre = require("hardhat");

async function main() {
  console.log("🎁 Monad 红包合约演示\n");
  console.log("=".repeat(50));

  // 获取测试账户
  const [sender, receiver1, receiver2, receiver3] = await hre.ethers.getSigners();
  
  console.log("\n📋 测试账户:");
  console.log("发送者:", sender.address);
  console.log("领取者1:", receiver1.address);
  console.log("领取者2:", receiver2.address);
  console.log("领取者3:", receiver3.address);

  // 部署合约
  console.log("\n🚀 部署合约...");
  const RedPacket = await hre.ethers.getContractFactory("RedPacket");
  const redPacket = await RedPacket.deploy();
  await redPacket.deployed();
  console.log("✅ 合约地址:", redPacket.address);

  // 测试 1: 创建公共拼手气红包
  console.log("\n" + "=".repeat(50));
  console.log("📦 测试 1: 创建公共拼手气红包");
  console.log("=".repeat(50));
  
  const amount1 = hre.ethers.utils.parseEther("1.0");
  console.log("总金额: 1.0 MON");
  console.log("红包个数: 5");
  console.log("类型: 拼手气 (随机)");
  console.log("访问: 公共");
  
  const tx1 = await redPacket.createPacket(5, 0, 0, "", { value: amount1 });
  await tx1.wait();
  console.log("✅ 红包创建成功! ID: 0");

  // 查看红包信息
  const packet0 = await redPacket.getPacket(0);
  console.log("\n红包详情:");
  console.log("- 发送者:", packet0.sender);
  console.log("- 总金额:", hre.ethers.utils.formatEther(packet0.totalAmount), "MON");
  console.log("- 总个数:", packet0.totalCount.toString());
  console.log("- 剩余个数:", packet0.remainingCount.toString());

  // 测试 2: 领取公共红包
  console.log("\n" + "=".repeat(50));
  console.log("🎯 测试 2: 领取公共红包");
  console.log("=".repeat(50));

  console.log("\n👤 领取者1 开抢...");
  const claimTx1 = await redPacket.connect(receiver1).claimPacket(0, "");
  const receipt1 = await claimTx1.wait();
  const claimEvent1 = receipt1.events.find(e => e.event === "PacketClaimed");
  const claimedAmount1 = hre.ethers.utils.formatEther(claimEvent1.args.amount);
  console.log("✅ 领取成功! 获得:", claimedAmount1, "MON");

  console.log("\n👤 领取者2 开抢...");
  const claimTx2 = await redPacket.connect(receiver2).claimPacket(0, "");
  const receipt2 = await claimTx2.wait();
  const claimEvent2 = receipt2.events.find(e => e.event === "PacketClaimed");
  const claimedAmount2 = hre.ethers.utils.formatEther(claimEvent2.args.amount);
  console.log("✅ 领取成功! 获得:", claimedAmount2, "MON");

  console.log("\n👤 领取者3 开抢...");
  const claimTx3 = await redPacket.connect(receiver3).claimPacket(0, "");
  const receipt3 = await claimTx3.wait();
  const claimEvent3 = receipt3.events.find(e => e.event === "PacketClaimed");
  const claimedAmount3 = hre.ethers.utils.formatEther(claimEvent3.args.amount);
  console.log("✅ 领取成功! 获得:", claimedAmount3, "MON");

  // 查看领取记录
  console.log("\n📊 领取记录:");
  const claims = await redPacket.getPacketClaims(0);
  claims.forEach((claim, index) => {
    console.log(`${index + 1}. ${claim.claimer.substring(0, 10)}... 领取了 ${hre.ethers.utils.formatEther(claim.amount)} MON`);
  });

  // 测试 3: 创建口令红包
  console.log("\n" + "=".repeat(50));
  console.log("🔐 测试 3: 创建口令红包");
  console.log("=".repeat(50));

  const amount2 = hre.ethers.utils.parseEther("0.6");
  const password = "MonadRedPacket2024";
  console.log("总金额: 0.6 MON");
  console.log("红包个数: 3");
  console.log("类型: 均分");
  console.log("访问: 口令保护");
  console.log("口令:", password);

  const tx2 = await redPacket.createPacket(3, 1, 1, password, { value: amount2 });
  await tx2.wait();
  console.log("✅ 口令红包创建成功! ID: 1");

  // 测试 4: 领取口令红包
  console.log("\n" + "=".repeat(50));
  console.log("🔓 测试 4: 领取口令红包");
  console.log("=".repeat(50));

  console.log("\n👤 领取者1 尝试用错误口令...");
  try {
    await redPacket.connect(receiver1).claimPacket(1, "wrongpassword");
    console.log("❌ 不应该成功");
  } catch (error) {
    console.log("✅ 正确拒绝! 原因: 口令错误");
  }

  console.log("\n👤 领取者1 使用正确口令...");
  const claimTx4 = await redPacket.connect(receiver1).claimPacket(1, password);
  const receipt4 = await claimTx4.wait();
  const claimEvent4 = receipt4.events.find(e => e.event === "PacketClaimed");
  const claimedAmount4 = hre.ethers.utils.formatEther(claimEvent4.args.amount);
  console.log("✅ 领取成功! 获得:", claimedAmount4, "MON (均分)");

  // 测试 5: 查询功能
  console.log("\n" + "=".repeat(50));
  console.log("📈 测试 5: 查询功能");
  console.log("=".repeat(50));

  const sentPackets = await redPacket.getUserSentPackets(sender.address);
  console.log("\n发送者发送的红包数量:", sentPackets.length);
  
  const receivedPackets1 = await redPacket.getUserReceivedPackets(receiver1.address);
  console.log("领取者1领取的红包数量:", receivedPackets1.length);

  const activePackets = await redPacket.getRecentActivePackets(10);
  console.log("当前活跃的红包数量:", activePackets.length);

  // 测试 6: 边界情况
  console.log("\n" + "=".repeat(50));
  console.log("⚠️  测试 6: 边界情况");
  console.log("=".repeat(50));

  console.log("\n尝试重复领取...");
  try {
    await redPacket.connect(receiver1).claimPacket(0, "");
    console.log("❌ 不应该成功");
  } catch (error) {
    console.log("✅ 正确拒绝! 原因: 已经领取过");
  }

  console.log("\n尝试领取自己的红包...");
  try {
    await redPacket.connect(sender).claimPacket(0, "");
    console.log("❌ 不应该成功");
  } catch (error) {
    console.log("✅ 正确拒绝! 原因: 不能领取自己的红包");
  }

  // 最终统计
  console.log("\n" + "=".repeat(50));
  console.log("📊 最终统计");
  console.log("=".repeat(50));

  const totalPackets = await redPacket.nextPacketId();
  console.log("总共创建的红包:", totalPackets.toString());
  console.log("活跃的红包:", activePackets.length);
  
  const packet0Final = await redPacket.getPacket(0);
  const packet1Final = await redPacket.getPacket(1);
  console.log("\n红包 0:");
  console.log("- 已领取:", packet0Final.totalCount.toNumber() - packet0Final.remainingCount.toNumber(), "/", packet0Final.totalCount.toString());
  console.log("- 已发出:", hre.ethers.utils.formatEther(packet0Final.totalAmount.sub(packet0Final.remainingAmount)), "MON");
  
  console.log("\n红包 1:");
  console.log("- 已领取:", packet1Final.totalCount.toNumber() - packet1Final.remainingCount.toNumber(), "/", packet1Final.totalCount.toString());
  console.log("- 已发出:", hre.ethers.utils.formatEther(packet1Final.totalAmount.sub(packet1Final.remainingAmount)), "MON");

  console.log("\n" + "=".repeat(50));
  console.log("✅ 所有测试完成!");
  console.log("=".repeat(50));
  console.log("\n💡 提示: 将合约地址 " + redPacket.address + " 更新到 index.html 中");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
