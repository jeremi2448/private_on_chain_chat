<div align="center">

# 🔐 Private On-Chain Chat

**Decentralized Encrypted Messaging on Blockchain**

[![Sepolia](https://img.shields.io/badge/Network-Sepolia-blue)](https://sepolia.etherscan.io/)
[![Zama FHE](https://img.shields.io/badge/Powered%20by-Zama%20FHE-purple)](https://www.zama.ai/)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[🚀 Live Demo](#) • [📖 Documentation](TUTORIAL.md) • [🐛 Report Bug](#) • [✨ Request Feature](#)

![Private Chat Banner](https://via.placeholder.com/800x200/1e293b/818cf8?text=Private+On-Chain+Chat)

</div>

---

## 🌟 Overview

**Private On-Chain Chat** is a decentralized messaging application that leverages Zama's **Fully Homomorphic Encryption (FHE)** to ensure absolute privacy. Your messages are end-to-end encrypted and stored on the Ethereum blockchain, making them readable only by you and the recipient.

### ✨ Why Private Chat?

- 🔒 **Absolute Privacy**: FHE encryption - only you and your recipient can read messages
- 🌐 **Decentralized**: No central server, data stored on blockchain
- 💎 **Transparent**: Open source and verifiable smart contracts
- 🚀 **Modern**: Sleek interface with smooth animations
- 📊 **Statistics**: Personal dashboard with history and metrics

---

## 🎯 Features

### 💬 Encrypted Messaging
- ✅ Text messages up to 32 characters
- ✅ End-to-end FHE encryption
- ✅ Ethereum address validation
- ✅ Captivating sending animation

### 📊 Personal Dashboard
- ✅ Real-time statistics (sent/received/total)
- ✅ History of last 5 messages
- ✅ Inbox with message counter
- ✅ Local persistence (localStorage)

### 🎨 Modern Interface
- ✅ Elegant dark mode design
- ✅ Smooth animations and micro-interactions
- ✅ Responsive (mobile/desktop)
- ✅ Integrated help with tutorial

---

## 🚀 Quick Start

### Prerequisites

- [MetaMask](https://metamask.io/) installed
- Sepolia ETH ([get for free](https://sepoliafaucet.com/))
- Node.js 18+ (for development)

### 🌐 Usage (Non-Technical)

1. **Visit the application**: [Demo Link](#)
2. **Connect MetaMask**: Click "Connect Wallet"
3. **Send a message**:
   - Enter recipient address (0x...)
   - Type your message (max 32 chars)
   - Click "Send" and confirm in MetaMask
4. **Check your stats**: Dashboard updates automatically

📖 **Full Guide**: [TUTORIAL.md](TUTORIAL.md)

---

## 💻 Installation (Developers)

### 1️⃣ Clone the Project

```bash
git clone https://github.com/YOUR_USERNAME/private-on-chain-chat.git
cd private-on-chain-chat
```

### 2️⃣ Contract Configuration

```bash
cd contracts
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PRIVATE_KEY and SEPOLIA_RPC_URL
```

### 3️⃣ Frontend Configuration

```bash
cd ../frontend
npm install
```

### 4️⃣ Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Project Structure

```
private-on-chain-chat/
├── contracts/              # Solidity Smart contracts
│   ├── contracts/
│   │   └── PrivateChat.sol # Main contract
│   ├── scripts/
│   │   ├── deploy.ts       # Deployment script
│   │   └── interact.ts     # Interaction script
│   └── test/               # Unit tests
│
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx    # Main page
│   │   │   └── animations.css
│   │   └── types/
│   │       └── global.d.ts # TypeScript types
│   └── public/             # Static assets
│
├── TUTORIAL.md             # Full user guide
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

---

## 🔧 Technologies Used

### Smart Contracts
- **Solidity** `^0.8.24` - Smart contract language
- **Hardhat** - Development framework
- **Zama FHEVM** - Homomorphic encryption
- **ethers.js** - Blockchain interaction

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Static typing
- **Tailwind CSS 4** - Modern styling
- **fhevmjs** - FHE client
- **Lucide React** - Icons

---

## 📜 Smart Contract

### Deployed Contract

- **Network**: Sepolia Testnet
- **Address**: `0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2`
- **Explorer**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2)

### Key Functions

```solidity
// Send an encrypted message
function sendMessage(
    address _to,
    bytes32 _chunk1Handle,
    bytes32 _chunk2Handle,
    bytes32 _chunk3Handle,
    bytes32 _chunk4Handle,
    bytes calldata _inputProof,
    uint32 _ttl
) external;

// Get received message count
function getMessageCount() external view returns (uint256);

// Retrieve a message
function getMessage(uint256 index) external view returns (...);
```

---

## 🔒 Security & Privacy

### FHE Encryption

Messages use Zama's **Fully Homomorphic Encryption (FHE)**:

```solidity
// Only sender and recipient can decrypt
FHE.allow(encryptedContent, _to);        // Recipient
FHE.allow(encryptedContent, msg.sender); // Sender
```

### Guarantees

- ✅ **End-to-end encryption**: Messages encrypted client-side
- ✅ **Absolute privacy**: Impossible for third parties to decrypt
- ✅ **Secure storage**: Encrypted data on blockchain
- ✅ **Strict permissions**: Access limited via `FHE.allow()`

---

## 📊 Statistics & Metrics

The application automatically tracks:

- 📤 **Sent messages**: Personal counter
- 📬 **Received messages**: Updated via refresh
- 📈 **Total**: Sum of both
- 🕐 **History**: Last 5 messages with timestamps

All data is **saved locally** in your browser.

---

## 🛠️ Development

### Compile Contracts

```bash
cd contracts
npx hardhat compile
```

### Test Contracts

```bash
npx hardhat test
```

### Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Build Frontend

```bash
cd frontend
npm run build
```

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/private-on-chain-chat)

1. Connect your GitHub repo
2. Configure root directory: `frontend`
3. Deploy!

### Option 2: Manual

Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📖 Documentation

- 📚 [Full User Guide](TUTORIAL.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🔗 [Zama FHE Documentation](https://docs.zama.ai/fhevm)
- 📘 [Next.js Documentation](https://nextjs.org/docs)

---

## ⚠️ Current Limitations

- **Max 32 characters** per message (FHE technical limitation)
- **ASCII only** (no emojis for now)
- **Zama Gateway**: Currently in degraded mode (simulation)
- **Gas fees**: Required for each message (Sepolia ETH)

---

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (Completed)
- [x] Smart contract with FHE
- [x] Next.js Frontend
- [x] Statistics and history
- [x] Complete documentation

### 🔄 Phase 2 - Improvements (In Progress)
- [ ] Real integration with Zama gateway
- [ ] Support for longer messages
- [ ] Real-time notifications
- [ ] Customizable themes

### 🔮 Phase 3 - Advanced (Future)
- [ ] Group conversations
- [ ] IPFS storage
- [ ] Mobile app (React Native)
- [ ] Zero-Knowledge Proofs

---

## 🤝 Contribution

Contributions are welcome! Here's how to participate:

1. **Fork** the project
2. **Create** a branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT** License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Zama](https://www.zama.ai/) - For the revolutionary FHE technology
- [Ethereum](https://ethereum.org/) - For the blockchain platform
- [Next.js](https://nextjs.org/) - For the frontend framework
- [Vercel](https://vercel.com/) - For hosting

---

## 📞 Contact & Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/jeremi2448/private-on-chain-chat/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/jeremi2448/private-on-chain-chat/discussions)
- 📧 **Email**: treepiton@gmail.com
- X **Twitter**: @Tree14735795
- **Discord**: rib2874

---

<div align="center">

**Made with ❤️ using Zama FHE technology**

[⬆ Back to top](#-private-on-chain-chat)

</div>
