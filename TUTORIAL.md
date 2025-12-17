# 📚 User Guide - Private On-Chain Chat

Welcome to **Private On-Chain Chat**, your encrypted messaging application on the blockchain!

## 🚀 Quick Start

### Prerequisites
- ✅ Web Browser (Chrome, Firefox, Brave, etc.)
- ✅ MetaMask Extension installed
- ✅ MetaMask Account with Sepolia ETH

### Get Sepolia ETH (Free)
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Connect your wallet
3. Request test ETH (free)

---

## 📖 Step-by-Step Guide

### Step 1: Connect Wallet 🦊

1. **Click "Connect Wallet"** (button top right)
2. **MetaMask opens** → Select your account
3. **Confirm** connection
4. **Verify**: Your address appears (e.g., `0x1234...5678`)

```
┌─────────────────────────────┐
│  Private Chat  [0x12...78]  │ ← Visible Address
└─────────────────────────────┘
```

---

### Step 2: Check Your Statistics 📊

Just below the header, you will see:

```
┌─────────────────────────────┐
│  📊 Statistics              │
│  Sent: 5 | Received: 3 | 8  │
└─────────────────────────────┘
```

- **Sent**: Number of messages you have sent
- **Received**: Messages received (updated with the 🔄 button)
- **Total**: Sum of both

---

### Step 3: Check Your Inbox 📬

The **Inbox** section displays messages you have received.

**Actions**:
- Click **🔄** to refresh
- The counter displays the number of messages

```
┌─────────────────────────────┐
│  📬 Inbox          [🔄]     │
│                             │
│  Messages Received          │
│  You have 3 messages    [3] │
└─────────────────────────────┘
```

> **Note**: Messages are encrypted. Only you and the sender can read them!

---

### Step 4: Check History 📤

The **Sent Messages** section shows your last 5 messages:

```
┌─────────────────────────────┐
│  📤 Sent (5 total)          │
│  ┌─────────────────────────┐│
│  │ To: 0x1234...5678       ││
│  │ "Hello World"           ││
│  │ ✓ Sent        14:30     ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

**Displayed Information**:
- Recipient address (truncated)
- Message content
- Status: ✓ Sent
- Time sent

---

### Step 5: Send a Message 💌

#### 5.1 Enter Recipient Address

```
┌─────────────────────────────┐
│  Recipient address (0x...)  │ ← Paste address here
└─────────────────────────────┘
```

**Format**: `0x` followed by 40 hexadecimal characters
**Example**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

#### 5.2 Type Your Message

```
┌─────────────────────────────┐
│  Type your message...       │ ← Max 32 characters
└─────────────────────────────┘
```

**Limit**: 32 characters maximum
**Allowed Characters**: Letters, numbers, spaces, punctuation

#### 5.3 Send

1. **Click the Send button** 📨
2. **Animation**: A flying message appears! 💌
3. **MetaMask**: Confirm the transaction (gas fees)
4. **Confirmation**: "Message sent (Simulated)"

```
     💌
    /  \
   /    \  ← Flying message animation
  /______\
```

---

## 🔒 Security & Privacy

### FHE Encryption
Your messages are encrypted with **Fully Homomorphic Encryption**:
- ✅ End-to-end encryption
- ✅ Only you and the recipient can read
- ✅ Even the network cannot decrypt

### Permissions
The smart contract uses `FHE.allow()` to ensure that:
- The **sender** can read the message
- The **recipient** can read the message
- **No one else** can access the content

---

## 💡 Tips & Tricks

### ✅ Best Practices
- **Verify address** before sending (irreversible!)
- **Short messages**: Max 32 characters
- **Keep Sepolia ETH** for gas fees

### ⚠️ Current Limitations
- **Zama Gateway**: Currently in degraded mode
- **Simulation**: Messages are simulated while waiting
- **32 characters**: Technical limit of the contract

### 🔄 Refresh Data
- Click **🔄** in Inbox to refresh
- Statistics update automatically

---

## 🆘 Troubleshooting

### Problem: "Please install MetaMask!"
**Solution**: Install the MetaMask extension from [metamask.io](https://metamask.io/)

### Problem: "Invalid recipient address"
**Solution**: Verify the address starts with `0x` and contains 42 characters

### Problem: "Message too long"
**Solution**: Reduce your message to 32 characters maximum

### Problem: No MetaMask popup
**Solution**: 
- The site is in simulation mode (Zama gateway down)
- Real transactions will be enabled once the gateway is operational

---

## 📊 Understanding the Interface

### Header
- **Private Chat**: App Logo
- **Connect Wallet**: MetaMask Connection
- **Address**: Your wallet (once connected)

### Statistics
- **Sent**: Blue counter
- **Received**: Purple counter
- **Total**: Green counter

### Inbox
- **Messages Received**: Number of messages
- **🔄 Refresh**: Refresh

### History
- **Last 5 messages**: Scrollable list
- **Details**: Recipient, content, time

### Sending Area
- **Field 1**: Recipient address
- **Field 2**: Your message
- **Send Button**: Send

---

## 🌟 Advanced Features

### Local Persistence
Your statistics and history are **saved locally**:
- Kept between sessions
- Stored in your browser
- Cleared if you clear cache

### Sending Animation
With every send, enjoy an **elegant animation**:
- Flying message from bottom to top
- 360° rotation
- Lighting effects

---

## 📞 Support

### Questions?
- Check [README.md](../README.md)
- Check [DEPLOYMENT.md](../DEPLOYMENT.md)

### Bugs?
- Open an issue on GitHub
- Describe the problem in detail

---

## 🎉 Enjoy Private Chat!

You are now ready to send encrypted messages on the blockchain! 🚀

**Reminder**: Your messages are **private** and **secure** thanks to FHE encryption. Only you and your recipient can read them.

---

*Last updated: December 2024*
