import { ethers } from "hardhat";

async function main() {
    const PrivateChat = await ethers.getContractFactory("PrivateChat");
    const privateChat = await PrivateChat.deploy();

    await privateChat.waitForDeployment();

    console.log("PrivateChat deployed to:", await privateChat.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
