// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RedPacket - Monad链红包智能合约
 * @dev 支持公共红包和口令红包，支持拼手气和均分两种模式
 */
contract RedPacket {
    
    // 红包类型
    enum PacketType { RANDOM, EQUAL }  // 拼手气 / 均分
    enum AccessType { PUBLIC, PASSWORD }  // 公共 / 口令
    
    // 红包结构
    struct Packet {
        uint256 id;
        address sender;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 totalCount;
        uint256 remainingCount;
        PacketType packetType;
        AccessType accessType;
        bytes32 passwordHash;  // 存储密码哈希
        uint256 timestamp;
        bool active;
    }
    
    // 领取记录
    struct Claim {
        address claimer;
        uint256 amount;
        uint256 timestamp;
    }
    
    // 存储
    uint256 public nextPacketId;
    mapping(uint256 => Packet) public packets;
    mapping(uint256 => Claim[]) public packetClaims;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    
    // 用户历史
    mapping(address => uint256[]) public userSentPackets;
    mapping(address => uint256[]) public userReceivedPackets;
    
    // 事件
    event PacketCreated(
        uint256 indexed packetId,
        address indexed sender,
        uint256 totalAmount,
        uint256 count,
        PacketType packetType,
        AccessType accessType
    );
    
    event PacketClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 amount
    );
    
    event PacketCompleted(uint256 indexed packetId);
    
    /**
     * @dev 创建红包
     * @param count 红包数量
     * @param packetType 红包类型（拼手气/均分）
     * @param accessType 访问类型（公共/口令）
     * @param password 口令（如果是公共红包则为空）
     */
    function createPacket(
        uint256 count,
        PacketType packetType,
        AccessType accessType,
        string memory password
    ) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(count > 0 && count <= 100, "Count must be between 1 and 100");
        require(msg.value >= count * 0.001 ether, "Amount too small per packet");
        
        bytes32 passwordHash = bytes32(0);
        if (accessType == AccessType.PASSWORD) {
            require(bytes(password).length > 0, "Password required");
            passwordHash = keccak256(abi.encodePacked(password));
        }
        
        uint256 packetId = nextPacketId++;
        
        packets[packetId] = Packet({
            id: packetId,
            sender: msg.sender,
            totalAmount: msg.value,
            remainingAmount: msg.value,
            totalCount: count,
            remainingCount: count,
            packetType: packetType,
            accessType: accessType,
            passwordHash: passwordHash,
            timestamp: block.timestamp,
            active: true
        });
        
        userSentPackets[msg.sender].push(packetId);
        
        emit PacketCreated(
            packetId,
            msg.sender,
            msg.value,
            count,
            packetType,
            accessType
        );
        
        return packetId;
    }
    
    /**
     * @dev 领取红包
     * @param packetId 红包ID
     * @param password 口令（如果是公共红包则为空）
     */
    function claimPacket(uint256 packetId, string memory password) external {
        Packet storage packet = packets[packetId];
        
        require(packet.active, "Packet not active");
        require(packet.remainingCount > 0, "Packet is empty");
        require(!hasClaimed[packetId][msg.sender], "Already claimed");
        require(msg.sender != packet.sender, "Sender cannot claim own packet");
        
        // 验证口令
        if (packet.accessType == AccessType.PASSWORD) {
            require(
                keccak256(abi.encodePacked(password)) == packet.passwordHash,
                "Wrong password"
            );
        }
        
        // 计算领取金额
        uint256 claimAmount;
        if (packet.packetType == PacketType.EQUAL) {
            // 均分模式
            claimAmount = packet.remainingAmount / packet.remainingCount;
        } else {
            // 拼手气模式
            if (packet.remainingCount == 1) {
                // 最后一个红包，拿走所有剩余金额
                claimAmount = packet.remainingAmount;
            } else {
                // 使用伪随机算法
                // 确保每个红包至少0.001 ether
                uint256 minAmount = 0.001 ether;
                uint256 maxAmount = (packet.remainingAmount - minAmount * (packet.remainingCount - 1)) * 2 / packet.remainingCount;
                
                // 生成随机数
                uint256 random = uint256(keccak256(abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    packetId,
                    packet.remainingCount
                ))) % maxAmount;
                
                claimAmount = minAmount + random;
                
                // 确保不会超过剩余金额
                if (claimAmount > packet.remainingAmount - minAmount * (packet.remainingCount - 1)) {
                    claimAmount = packet.remainingAmount - minAmount * (packet.remainingCount - 1);
                }
            }
        }
        
        // 更新状态
        packet.remainingAmount -= claimAmount;
        packet.remainingCount -= 1;
        hasClaimed[packetId][msg.sender] = true;
        
        // 记录领取
        packetClaims[packetId].push(Claim({
            claimer: msg.sender,
            amount: claimAmount,
            timestamp: block.timestamp
        }));
        
        userReceivedPackets[msg.sender].push(packetId);
        
        // 转账
        payable(msg.sender).transfer(claimAmount);
        
        emit PacketClaimed(packetId, msg.sender, claimAmount);
        
        // 如果红包已领完
        if (packet.remainingCount == 0) {
            packet.active = false;
            emit PacketCompleted(packetId);
        }
    }
    
    /**
     * @dev 获取红包详情
     */
    function getPacket(uint256 packetId) external view returns (
        address sender,
        uint256 totalAmount,
        uint256 remainingAmount,
        uint256 totalCount,
        uint256 remainingCount,
        PacketType packetType,
        AccessType accessType,
        uint256 timestamp,
        bool active
    ) {
        Packet memory packet = packets[packetId];
        return (
            packet.sender,
            packet.totalAmount,
            packet.remainingAmount,
            packet.totalCount,
            packet.remainingCount,
            packet.packetType,
            packet.accessType,
            packet.timestamp,
            packet.active
        );
    }
    
    /**
     * @dev 获取红包的领取记录
     */
    function getPacketClaims(uint256 packetId) external view returns (Claim[] memory) {
        return packetClaims[packetId];
    }
    
    /**
     * @dev 获取用户发送的红包ID列表
     */
    function getUserSentPackets(address user) external view returns (uint256[] memory) {
        return userSentPackets[user];
    }
    
    /**
     * @dev 获取用户领取的红包ID列表
     */
    function getUserReceivedPackets(address user) external view returns (uint256[] memory) {
        return userReceivedPackets[user];
    }
    
    /**
     * @dev 获取所有活跃的红包数量
     */
    function getActivePacketCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextPacketId; i++) {
            if (packets[i].active && packets[i].remainingCount > 0) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev 获取最近的N个活跃红包
     */
    function getRecentActivePackets(uint256 limit) external view returns (uint256[] memory) {
        uint256[] memory tempIds = new uint256[](nextPacketId);
        uint256 count = 0;
        
        // 从最新的开始遍历
        for (uint256 i = nextPacketId; i > 0 && count < limit; i--) {
            uint256 packetId = i - 1;
            if (packets[packetId].active && packets[packetId].remainingCount > 0) {
                tempIds[count] = packetId;
                count++;
            }
        }
        
        // 创建正确大小的数组
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempIds[i];
        }
        
        return result;
    }
}
