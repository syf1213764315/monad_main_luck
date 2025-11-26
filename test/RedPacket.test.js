const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RedPacket Contract", function () {
  let RedPacket;
  let redPacket;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // 部署合约
    RedPacket = await ethers.getContractFactory("RedPacket");
    redPacket = await RedPacket.deploy();
    await redPacket.deployed();
  });

  describe("创建红包", function () {
    it("应该成功创建公共拼手气红包", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const count = 5;
      const packetType = 0; // RANDOM
      const accessType = 0; // PUBLIC
      const password = "";

      const tx = await redPacket.createPacket(
        count,
        packetType,
        accessType,
        password,
        { value: amount }
      );

      await expect(tx)
        .to.emit(redPacket, "PacketCreated")
        .withArgs(0, owner.address, amount, count, packetType, accessType);

      const packet = await redPacket.getPacket(0);
      expect(packet.sender).to.equal(owner.address);
      expect(packet.totalAmount).to.equal(amount);
      expect(packet.totalCount).to.equal(count);
      expect(packet.active).to.equal(true);
    });

    it("应该成功创建口令红包", async function () {
      const amount = ethers.utils.parseEther("0.5");
      const count = 3;
      const packetType = 1; // EQUAL
      const accessType = 1; // PASSWORD
      const password = "hello123";

      await redPacket.createPacket(
        count,
        packetType,
        accessType,
        password,
        { value: amount }
      );

      const packet = await redPacket.getPacket(0);
      expect(packet.accessType).to.equal(accessType);
    });

    it("金额为0时应该失败", async function () {
      await expect(
        redPacket.createPacket(5, 0, 0, "", { value: 0 })
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("红包数量超过100应该失败", async function () {
      await expect(
        redPacket.createPacket(101, 0, 0, "", { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Count must be between 1 and 100");
    });

    it("口令红包未提供口令应该失败", async function () {
      await expect(
        redPacket.createPacket(5, 0, 1, "", { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Password required");
    });
  });

  describe("领取红包", function () {
    beforeEach(async function () {
      // 创建一个测试红包
      await redPacket.createPacket(
        5,
        0, // RANDOM
        0, // PUBLIC
        "",
        { value: ethers.utils.parseEther("1.0") }
      );
    });

    it("应该成功领取公共红包", async function () {
      const balanceBefore = await addr1.getBalance();

      const tx = await redPacket.connect(addr1).claimPacket(0, "");
      const receipt = await tx.wait();

      const balanceAfter = await addr1.getBalance();
      
      // 余额应该增加（减去 gas 费用）
      expect(balanceAfter).to.be.gt(balanceBefore.sub(receipt.gasUsed.mul(receipt.effectiveGasPrice)));

      // 检查是否已标记为已领取
      expect(await redPacket.hasClaimed(0, addr1.address)).to.equal(true);

      // 剩余数量应该减少
      const packet = await redPacket.getPacket(0);
      expect(packet.remainingCount).to.equal(4);
    });

    it("重复领取应该失败", async function () {
      await redPacket.connect(addr1).claimPacket(0, "");

      await expect(
        redPacket.connect(addr1).claimPacket(0, "")
      ).to.be.revertedWith("Already claimed");
    });

    it("发送者不能领取自己的红包", async function () {
      await expect(
        redPacket.connect(owner).claimPacket(0, "")
      ).to.be.revertedWith("Sender cannot claim own packet");
    });

    it("所有红包领完后应该无法继续领取", async function () {
      // 领取所有5个红包
      await redPacket.connect(addr1).claimPacket(0, "");
      await redPacket.connect(addr2).claimPacket(0, "");
      await redPacket.connect(addrs[0]).claimPacket(0, "");
      await redPacket.connect(addrs[1]).claimPacket(0, "");
      await redPacket.connect(addrs[2]).claimPacket(0, "");

      // 第6个人尝试领取应该失败
      await expect(
        redPacket.connect(addrs[3]).claimPacket(0, "")
      ).to.be.revertedWith("Packet is empty");
    });
  });

  describe("口令红包", function () {
    const password = "secret123";

    beforeEach(async function () {
      await redPacket.createPacket(
        3,
        1, // EQUAL
        1, // PASSWORD
        password,
        { value: ethers.utils.parseEther("0.3") }
      );
    });

    it("正确口令应该成功领取", async function () {
      await expect(
        redPacket.connect(addr1).claimPacket(0, password)
      ).to.emit(redPacket, "PacketClaimed");
    });

    it("错误口令应该失败", async function () {
      await expect(
        redPacket.connect(addr1).claimPacket(0, "wrongpassword")
      ).to.be.revertedWith("Wrong password");
    });
  });

  describe("均分红包", function () {
    it("每个人应该获得相同金额", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const count = 4;

      await redPacket.createPacket(count, 1, 0, "", { value: amount });

      // 领取第一个
      const tx1 = await redPacket.connect(addr1).claimPacket(0, "");
      const receipt1 = await tx1.wait();
      const event1 = receipt1.events.find(e => e.event === "PacketClaimed");
      const amount1 = event1.args.amount;

      // 领取第二个
      const tx2 = await redPacket.connect(addr2).claimPacket(0, "");
      const receipt2 = await tx2.wait();
      const event2 = receipt2.events.find(e => e.event === "PacketClaimed");
      const amount2 = event2.args.amount;

      // 两个金额应该相等（或非常接近，考虑到舍入）
      expect(amount1).to.be.closeTo(amount2, ethers.utils.parseEther("0.001"));
    });
  });

  describe("查询功能", function () {
    beforeEach(async function () {
      // 创建多个红包
      await redPacket.createPacket(3, 0, 0, "", { value: ethers.utils.parseEther("0.3") });
      await redPacket.createPacket(2, 1, 0, "", { value: ethers.utils.parseEther("0.2") });
      
      // 领取一些红包
      await redPacket.connect(addr1).claimPacket(0, "");
      await redPacket.connect(addr1).claimPacket(1, "");
    });

    it("应该正确返回用户发送的红包", async function () {
      const sentPackets = await redPacket.getUserSentPackets(owner.address);
      expect(sentPackets.length).to.equal(2);
    });

    it("应该正确返回用户领取的红包", async function () {
      const receivedPackets = await redPacket.getUserReceivedPackets(addr1.address);
      expect(receivedPackets.length).to.equal(2);
    });

    it("应该正确返回红包的领取记录", async function () {
      const claims = await redPacket.getPacketClaims(0);
      expect(claims.length).to.equal(1);
      expect(claims[0].claimer).to.equal(addr1.address);
    });

    it("应该正确返回最近的活跃红包", async function () {
      const activePackets = await redPacket.getRecentActivePackets(10);
      expect(activePackets.length).to.be.gte(2);
    });
  });

  describe("事件", function () {
    it("创建红包应该触发 PacketCreated 事件", async function () {
      await expect(
        redPacket.createPacket(5, 0, 0, "", { value: ethers.utils.parseEther("1") })
      ).to.emit(redPacket, "PacketCreated");
    });

    it("领取红包应该触发 PacketClaimed 事件", async function () {
      await redPacket.createPacket(5, 0, 0, "", { value: ethers.utils.parseEther("1") });
      
      await expect(
        redPacket.connect(addr1).claimPacket(0, "")
      ).to.emit(redPacket, "PacketClaimed");
    });

    it("红包领完应该触发 PacketCompleted 事件", async function () {
      await redPacket.createPacket(1, 0, 0, "", { value: ethers.utils.parseEther("0.1") });
      
      await expect(
        redPacket.connect(addr1).claimPacket(0, "")
      ).to.emit(redPacket, "PacketCompleted").withArgs(0);
    });
  });
});
