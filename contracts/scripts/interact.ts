import { ethers } from "hardhat";
import { createInstance } from "fhevmjs";
import { PrivateChat } from "../typechain-types";

async function main() {
    const contractAddress = "0x9D08bb2E3D18cC8Cf66b290b426E646e20383AC6"; // Deployed Sepolia address
    const [signer] = await ethers.getSigners();

    console.log("Interacting with PrivateChat at:", contractAddress);
    console.log("Signer:", signer.address);

    // 1. Initialize FHEVM instance
    const instance = await createInstance({
        chainId: 11155111,
        kmsContractAddress: "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A",
        aclContractAddress: "0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D",
        networkUrl: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
        gatewayUrl: "https://gateway.sepolia.zama.ai/",
    });

    // 2. Create encrypted input
    const messageContent = 12345; // Example integer message (since we use euint256)
    const input = instance.createEncryptedInput(contractAddress, signer.address);
    input.add256(messageContent); // Encrypting as euint256
    const encryptedInput = input.encrypt();

    // 3. Send transaction
    const PrivateChatFactory = await ethers.getContractFactory("PrivateChat");
    const privateChat = PrivateChatFactory.attach(contractAddress) as PrivateChat;

    const ttl = 3600; // 1 hour
    console.log(`Sending message: ${messageContent} with TTL: ${ttl}...`);

    const tx = await privateChat.sendMessage(
        signer.address, // Sending to self for testing
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        ttl
    );

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Message sent successfully!");

    // 4. Fetch message count
    const count = await privateChat.getMessageCount();
    console.log("Message count:", count.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
