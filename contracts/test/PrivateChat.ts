import { expect } from "chai";
import { ethers } from "hardhat";

describe("PrivateChat", function () {
    it("Should deploy and send a message", async function () {
        const [owner, alice, bob] = await ethers.getSigners();

        // Deploy MockedPrecompile to the specific address expected by TFHE library
        // FHEVMCoprocessorAddress.sol: 0x05fD9B5EFE0a996095f42Ed7e77c390810CF660c
        const MockedPrecompile = await ethers.getContractFactory("MockedPrecompile");
        const mockedPrecompile = await MockedPrecompile.deploy();
        await mockedPrecompile.waitForDeployment();
        const mockedPrecompileAddress = await mockedPrecompile.getAddress();

        const coprocessorAddress = "0x05fD9B5EFE0a996095f42Ed7e77c390810CF660c";
        const code = await ethers.provider.getCode(mockedPrecompileAddress);
        await ethers.provider.send("hardhat_setCode", [
            coprocessorAddress,
            code,
        ]);
        console.log("MockedPrecompile deployed to", coprocessorAddress);

        // Deploy ACL to the specific address expected by TFHE library
        // ACLAddress.sol: 0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92
        const ACL = await ethers.getContractFactory("ACL");
        const acl = await ACL.deploy(coprocessorAddress); // ACL needs coprocessor address
        await acl.waitForDeployment();
        const aclAddress = await acl.getAddress();

        const targetACLAddress = "0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92";
        const aclCode = await ethers.provider.getCode(aclAddress);
        await ethers.provider.send("hardhat_setCode", [
            targetACLAddress,
            aclCode,
        ]);
        console.log("ACL deployed to", targetACLAddress);

        const PrivateChat = await ethers.getContractFactory("PrivateChat");
        const privateChat = await PrivateChat.deploy();
        await privateChat.waitForDeployment();

        console.log("PrivateChat deployed to:", await privateChat.getAddress());

        // Test sending a message
        // Generate valid input for MockedPrecompile
        const inputProof = "0x123456";
        const inputProofHash = ethers.keccak256(inputProof);
        const indexHandle = 0;

        // checkHandle = keccak256(inputProofHash, 0)
        const checkHandle = ethers.solidityPackedKeccak256(["bytes32", "uint8"], [inputProofHash, indexHandle]);

        // inputHandle format: top 29 bytes of checkHandle || indexHandle (1 byte) || type (1 byte) || version (1 byte)
        // type for ebytes256 is 11 (0x0b)

        // 29 bytes = 58 hex chars.
        const top29 = checkHandle.slice(0, 58 + 2); // +2 for 0x prefix

        // indexHandle (1 byte) = 00
        // typeCt (1 byte) = 0b
        // version (1 byte) = 00

        const inputHandle = top29 + "00" + "0b" + "00";

        const ttl = 3600; // 1 hour

        await privateChat.connect(alice).sendMessage(bob.address, inputHandle, inputProof, ttl);
        console.log("Message sent from Alice to Bob");

        // Check message count
        const count = await privateChat.connect(bob).getMessageCount();
        expect(count).to.equal(1);
        console.log("Bob has 1 message");

        // Retrieve message
        const [content, timestamp, sender, msgTtl] = await privateChat.connect(bob).getMessage(0);
        console.log("Message retrieved:", { content, timestamp, sender, msgTtl });

        expect(sender).to.equal(alice.address);
        expect(msgTtl).to.equal(ttl);
    });
});
