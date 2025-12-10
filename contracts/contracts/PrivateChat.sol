// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import "encrypted-types/EncryptedTypes.sol";

contract PrivateChat {
    struct Message {
        euint32 timestamp;
        euint64[4] contentChunks; // 4 x 8 chars = 32 chars max
        address sender;
        uint32 ttl; // 0 means no auto-delete
    }

    // Mapping from receiver address to their messages
    mapping(address => Message[]) private messages;

    // Event to notify when a message is sent
    event MessageSent(address indexed from, address indexed to);

    constructor() {}

    // Send an encrypted message (4 chunks for text)
    function sendMessage(
        address _to,
        bytes32 _chunk1Handle,
        bytes32 _chunk2Handle,
        bytes32 _chunk3Handle,
        bytes32 _chunk4Handle,
        bytes calldata _inputProof,
        uint32 _ttl
    ) public {
        // Convert each chunk from external input
        euint64 chunk1 = FHE.fromExternal(externalEuint64.wrap(_chunk1Handle), _inputProof);
        euint64 chunk2 = FHE.fromExternal(externalEuint64.wrap(_chunk2Handle), _inputProof);
        euint64 chunk3 = FHE.fromExternal(externalEuint64.wrap(_chunk3Handle), _inputProof);
        euint64 chunk4 = FHE.fromExternal(externalEuint64.wrap(_chunk4Handle), _inputProof);
        
        euint32 timestamp = FHE.asEuint32(uint32(block.timestamp));

        // Allow the receiver and the sender to decrypt all chunks
        FHE.allow(chunk1, _to);
        FHE.allow(chunk1, msg.sender);
        FHE.allow(chunk2, _to);
        FHE.allow(chunk2, msg.sender);
        FHE.allow(chunk3, _to);
        FHE.allow(chunk3, msg.sender);
        FHE.allow(chunk4, _to);
        FHE.allow(chunk4, msg.sender);
        FHE.allow(timestamp, _to);
        FHE.allow(timestamp, msg.sender);

        euint64[4] memory chunks = [chunk1, chunk2, chunk3, chunk4];
        
        messages[_to].push(Message({
            timestamp: timestamp,
            contentChunks: chunks,
            sender: msg.sender,
            ttl: _ttl
        }));
        
        emit MessageSent(msg.sender, _to);
    }

    function getMessageCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }

    // Retrieve a specific message
    function getMessage(uint256 index) public view returns (
        euint64,
        euint64,
        euint64,
        euint64,
        euint32,
        address,
        uint32
    ) {
        require(index < messages[msg.sender].length, "Index out of bounds");
        Message storage msgData = messages[msg.sender][index];
        
        return (
            msgData.contentChunks[0],
            msgData.contentChunks[1],
            msgData.contentChunks[2],
            msgData.contentChunks[3],
            msgData.timestamp,
            msgData.sender,
            msgData.ttl
        );
    }
}
