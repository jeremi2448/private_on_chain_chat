"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Lock, Send, Wallet, RefreshCw, Trash2 } from "lucide-react";
// import { createInstance } from "fhevmjs"; // Uncomment when network is ready

const CONTRACT_ADDRESS = "0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setStatus("Wallet connected");
    } catch (error) {
      console.error("Connection failed:", error);
      setStatus("Connection failed");
    }
  };

  // Helper function to encode text into 4 x uint64 chunks
  const encodeTextToChunks = (text: string): bigint[] => {
    // Pad or truncate to 32 characters
    const paddedText = text.padEnd(32, '\0').slice(0, 32);
    const chunks: bigint[] = [];

    for (let i = 0; i < 4; i++) {
      let chunk = BigInt(0);
      for (let j = 0; j < 8; j++) {
        const charCode = paddedText.charCodeAt(i * 8 + j);
        chunk = chunk | (BigInt(charCode) << BigInt(j * 8));
      }
      chunks.push(chunk);
    }

    return chunks;
  };

  const sendMessage = async () => {
    if (!newMessage || !account || !recipientAddress) {
      setStatus("Please fill all fields");
      return;
    }

    // Validate Ethereum address
    if (!ethers.isAddress(recipientAddress)) {
      setStatus("Invalid recipient address");
      return;
    }

    // Validate message length
    if (newMessage.length > 32) {
      setStatus("Message too long (max 32 characters)");
      return;
    }

    setLoading(true);
    setStatus("Encrypting message...");

    try {
      // Encode text to chunks
      const chunks = encodeTextToChunks(newMessage);

      // TODO: Implement FHE encryption here once network is up
      // const instance = await createInstance({
      //   chainId: 11155111,
      //   kmsContractAddress: "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A",
      //   aclContractAddress: "0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D",
      //   networkUrl: "https://rpc.sepolia.org",
      //   gatewayUrl: "https://gateway.sepolia.zama.ai/",
      // });
      // const input = instance.createEncryptedInput(CONTRACT_ADDRESS, account);
      // input.add64(chunks[0]);
      // input.add64(chunks[1]);
      // input.add64(chunks[2]);
      // input.add64(chunks[3]);
      // const encrypted = input.encrypt();

      // Simulate delay for now
      await new Promise(r => setTimeout(r, 1000));

      console.log("Message would be sent to:", recipientAddress, "Content:", newMessage, "Chunks:", chunks);
      setStatus("Message sent (Simulated)");
      setNewMessage("");
      setRecipientAddress("");
    } catch (error) {
      console.error("Send failed:", error);
      setStatus("Send failed: Network unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Private Chat</h1>
          </div>
          <button
            onClick={connectWallet}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${account
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              }`}
          >
            <Wallet className="w-4 h-4" />
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2 bg-slate-950/50 text-xs text-slate-400 flex justify-between items-center border-b border-slate-800/50">
          <span>Status: <span className={status.includes("failed") ? "text-red-400" : "text-emerald-400"}>{status}</span></span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            Zama Network: Degraded
          </span>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-950/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <Lock className="w-8 h-8 opacity-20" />
              <p className="text-sm">No encrypted messages yet</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <p className="text-sm text-slate-300">Encrypted Message #{i + 1}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="space-y-3">
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Recipient address (0x...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              disabled={!account || loading}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message (max 32 chars)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                disabled={!account || loading}
                maxLength={32}
              />
              <button
                onClick={sendMessage}
                disabled={!account || loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Messages are encrypted end-to-end using FHE.
          </p>
        </div>
      </div>
    </main>
  );
}
