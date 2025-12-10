// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import "encrypted-types/EncryptedTypes.sol";

contract PrivateChat {
    struct Message {
        euint32 timestamp;
        euint256 content;
        address sender;
        uint32 ttl; // 0 means no auto-delete
    }

    // Mapping from receiver address to their messages
    mapping(address => Message[]) private messages;

    // Event to notify when a message is sent
    event MessageSent(address indexed from, address indexed to);

    constructor() {}

    // Send an encrypted message
    function sendMessage(address _to, bytes32 _inputHandle, bytes calldata _inputProof, uint32 _ttl) public {
        euint256 encryptedContent = FHE.fromExternal(externalEuint256.wrap(_inputHandle), _inputProof);
        euint32 timestamp = FHE.asEuint32(uint32(block.timestamp));

        // Allow the receiver and the sender to decrypt the message
        FHE.allow(encryptedContent, _to);
        FHE.allow(encryptedContent, msg.sender);
        FHE.allow(timestamp, _to);
        FHE.allow(timestamp, msg.sender);

        messages[_to].push(Message({
            timestamp: timestamp,
            content: encryptedContent,
            sender: msg.sender,
            ttl: _ttl
        }));
        
        emit MessageSent(msg.sender, _to);
    }

    function getMessageCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }

    // Retrieve a specific message handle and expiration status
    function getMessage(uint256 index) public view returns (euint256, euint32, address, uint32) {
        require(index < messages[msg.sender].length, "Index out of bounds");
        Message storage msgData = messages[msg.sender][index];
        
        // Return the handles and public ttl.
        // Client must decrypt timestamp and check if (timestamp + ttl < current_time)
        return (msgData.content, msgData.timestamp, msgData.sender, msgData.ttl);
    }
}
