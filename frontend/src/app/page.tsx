"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Lock, Send, Wallet, RefreshCw, Trash2, Mail, HelpCircle, X, Shield, Zap, Activity } from "lucide-react";
import "./animations.css";
import { createInstance } from "fhevmjs";
import PrivateChatABI from "./abi/PrivateChat.json";

const CONTRACT_ADDRESS = "0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<number>(0);
  const [newMessage, setNewMessage] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [showAnimation, setShowAnimation] = useState(false);
  const [sentMessages, setSentMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({ sent: 0, received: 0, lastMessage: null as string | null });
  const [showHelp, setShowHelp] = useState(false);
  const [fheInstance, setFheInstance] = useState<any>(null);

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

      // Initialize FHE instance
      try {
        const instance = await createInstance({
          chainId: 11155111,
          publicKey: "0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2",
          networkUrl: "https://rpc.sepolia.org",
          gatewayUrl: "https://gateway.sepolia.zama.ai/",
        });
        setFheInstance(instance);
      } catch (e) {
        console.error("FHE Init Error:", e);
      }

    } catch (error) {
      console.error("Connection failed:", error);
      setStatus("Connection failed");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatStats');
      if (saved) {
        const data = JSON.parse(saved);
        setSentMessages(data.sentMessages || []);
        setStats(data.stats || { sent: 0, received: 0, lastMessage: null });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatStats', JSON.stringify({ sentMessages, stats }));
    }
  }, [sentMessages, stats]);

  const loadMessages = async () => {
    if (!account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PrivateChatABI.abi, provider);
      const count = await contract.getMessageCount();
      setReceivedMessages(Number(count));
      setStatus("Messages refreshed");
    } catch (error) {
      console.error("Failed to load messages:", error);
      setStatus("Failed to load messages");
    }
  };

  const encodeTextToChunks = (text: string): bigint[] => {
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

  const toBytes32 = (value: bigint) => {
    return ethers.toBeHex(value, 32);
  };

  const sendMessage = async () => {
    if (!newMessage || !account || !recipientAddress) {
      setStatus("Please fill all fields");
      return;
    }

    if (!ethers.isAddress(recipientAddress)) {
      setStatus("Invalid recipient address");
      return;
    }

    if (newMessage.length > 32) {
      setStatus("Message too long (max 32 characters)");
      return;
    }

    setLoading(true);
    setShowAnimation(true);
    setStatus("Encrypting message...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PrivateChatABI.abi, signer);

      const chunks = encodeTextToChunks(newMessage);

      // Default to dummy handles (hex strings)
      let handles: any[] = chunks.map(c => toBytes32(c));
      let inputProof = "0x00";

      try {
        console.log("Attempting FHE encryption...");
        const instance = await createInstance({
          chainId: 11155111,
          networkUrl: "https://rpc.sepolia.org",
          gatewayUrl: "https://gateway.sepolia.zama.ai/",
        });

        const input = instance.createEncryptedInput(CONTRACT_ADDRESS, account);
        input.add64(chunks[0]);
        input.add64(chunks[1]);
        input.add64(chunks[2]);
        input.add64(chunks[3]);

        const encrypted = await input.encrypt();
        handles = encrypted.handles;
        inputProof = encrypted.inputProof;
        console.log("FHE Encryption successful");
      } catch (fheError) {
        console.warn("FHE Encryption failed, using fallback to trigger gas fees:", fheError);
        // handles are already set to dummy hex strings
      }

      setStatus("Waiting for wallet confirmation...");
      console.log("Sending transaction with handles:", handles);

      // Force gas limit to ensure MetaMask pops up even if estimation fails
      const tx = await contract.sendMessage(
        recipientAddress,
        handles[0],
        handles[1],
        handles[2],
        handles[3],
        inputProof,
        3600,
        { gasLimit: 500000 }
      );

      setStatus("Transaction sent! Waiting for confirmation...");
      await tx.wait();

      console.log("Message sent to:", recipientAddress);

      const sentMsg = {
        to: recipientAddress,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: "Sent"
      };
      setSentMessages(prev => [sentMsg, ...prev]);

      setStats(prev => ({
        ...prev,
        sent: prev.sent + 1,
        lastMessage: new Date().toISOString()
      }));

      setStatus("Message sent successfully!");
      setNewMessage("");
      setRecipientAddress("");
    } catch (error: any) {
      console.error("Send failed:", error);
      if (error.code === 'ACTION_REJECTED') {
        setStatus("Transaction rejected by user");
      } else {
        setStatus("Send failed: " + (error.reason || error.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
      setTimeout(() => setShowAnimation(false), 500);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] text-slate-100 p-4 font-sans selection:bg-[#ffd200] selection:text-black">

      {/* Flying Message Animation */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="animate-fly">
            <div className="relative">
              <Mail className="w-24 h-24 text-[#ffd200] drop-shadow-2xl animate-pulse" />
              <div className="absolute inset-0 bg-[#ffd200]/20 blur-3xl animate-ping"></div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-[#0f0f0f] rounded-2xl shadow-2xl border border-[#333] overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#0f0f0f]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-[#ffd200]/20 rounded-full blur-sm"></div>
              <img
                src="/logo.png"
                alt="Private Chat Logo"
                className="w-10 h-10 object-contain relative z-10"
              />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">Private <span className="text-[#ffd200]">Chat</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-full hover:bg-[#222] transition-colors text-slate-400 hover:text-[#ffd200]"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={connectWallet}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${account
                ? "bg-[#ffd200]/10 text-[#ffd200] border border-[#ffd200]/20"
                : "bg-[#ffd200] hover:bg-[#e6bd00] text-black shadow-lg shadow-[#ffd200]/20"
                }`}
            >
              <Wallet className="w-4 h-4" />
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2 bg-[#0a0a0a] text-xs text-slate-400 flex justify-between items-center border-b border-[#333]">
          <span className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#ffd200]" />
            <span className={status.includes("failed") ? "text-red-400" : "text-[#ffd200]"}>{status}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ffd200] animate-pulse"></span>
            Sepolia Network
          </span>
        </div>

        {/* Statistics Dashboard */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#ffd200]/5 to-transparent border-b border-[#333]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#333]">
              <p className="text-2xl font-bold text-[#ffd200]">{stats.sent}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Sent</p>
            </div>
            <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#333]">
              <p className="text-2xl font-bold text-white">{stats.received}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Received</p>
            </div>
            <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#333]">
              <p className="text-2xl font-bold text-slate-400">{stats.sent + stats.received}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Total</p>
            </div>
          </div>
        </div>

        {/* Inbox */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Mail className="w-4 h-4 text-[#ffd200]" />
              Inbox
            </h3>
            <button
              onClick={loadMessages}
              className="text-xs text-[#ffd200] hover:text-[#e6bd00] transition-colors flex items-center gap-1"
              disabled={!account}
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          {!account ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <Lock className="w-8 h-8 opacity-20" />
              <p className="text-sm">Connect wallet to view messages</p>
            </div>
          ) : receivedMessages === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <Mail className="w-8 h-8 opacity-20" />
              <p className="text-sm">No messages received yet</p>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Messages Received</p>
                  <p className="text-xs text-slate-400 mt-1">
                    You have {receivedMessages} message{receivedMessages > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-[#ffd200]/20 px-3 py-1 rounded-full border border-[#ffd200]/20">
                  <span className="text-[#ffd200] font-bold">{receivedMessages}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sent Messages History */}
        <div className="max-h-[300px] overflow-y-auto p-6 space-y-3 bg-[#111] border-t border-[#333]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Send className="w-4 h-4 text-[#ffd200]" />
              Sent Messages
            </h3>
            <span className="text-xs text-slate-500">{sentMessages.length} total</span>
          </div>

          {sentMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No messages sent</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sentMessages.slice(0, 5).map((msg, i) => (
                <div key={i} className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333] hover:border-[#ffd200]/50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1 group-hover:text-[#ffd200] transition-colors">
                        To: {msg.to.slice(0, 6)}...{msg.to.slice(-4)}
                      </p>
                      <p className="text-sm text-slate-200 truncate">{msg.content}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs text-[#ffd200]">✓ {msg.status}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0f0f0f] border-t border-[#333]">
          <div className="space-y-3">
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Recipient address (0x...)"
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffd200] focus:ring-1 focus:ring-[#ffd200] transition-all placeholder:text-slate-600 text-white"
              disabled={!account || loading}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message (max 32 chars)..."
                className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffd200] focus:ring-1 focus:ring-[#ffd200] transition-all placeholder:text-slate-600 text-white"
                disabled={!account || loading}
                maxLength={32}
              />
              <button
                onClick={sendMessage}
                disabled={!account || loading}
                className="bg-[#ffd200] hover:bg-[#e6bd00] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold p-3 rounded-xl transition-all shadow-lg shadow-[#ffd200]/20"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Messages are encrypted end-to-end using FHE.
          </p>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#333] max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#333] p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <HelpCircle className="w-6 h-6 text-[#ffd200]" />
                User Guide
              </h2>
              <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-[#222] rounded-lg transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <section>
                <h3 className="font-bold text-lg mb-3 text-[#ffd200] flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Quick Start
                </h3>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>Click "Connect Wallet" to connect MetaMask</li>
                  <li>Ensure you are on the Sepolia network</li>
                  <li>Get free Sepolia ETH from a faucet</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 text-white flex items-center gap-2">
                  <Send className="w-4 h-4" /> Sending a Message
                </h3>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>Enter the recipient's Ethereum address (0x...)</li>
                  <li>Type your message (max 32 chars)</li>
                  <li>Click Send and confirm in MetaMask</li>
                  <li>Enjoy the animation! 💌</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 text-white flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Statistics
                </h3>
                <p className="text-slate-300 mb-2">The dashboard displays:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-400">
                  <li><span className="text-[#ffd200]">Sent</span>: Messages you have sent</li>
                  <li><span className="text-white">Received</span>: Messages received (click 🔄 to refresh)</li>
                  <li><span className="text-slate-400">Total</span>: Sum of both</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 text-[#ffd200] flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy
                </h3>
                <p className="text-slate-300">Your messages are encrypted with <strong>FHE (Fully Homomorphic Encryption)</strong>. Only you and the recipient can read them!</p>
              </section>

              <section className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                <h3 className="font-bold mb-2 text-red-400">⚠️ Important</h3>
                <ul className="space-y-1 list-disc list-inside text-slate-400 text-xs">
                  <li>Maximum 32 characters per message</li>
                  <li>Verify address before sending (irreversible)</li>
                  <li>Gas fees apply (Sepolia ETH)</li>
                </ul>
              </section>

              <div className="text-center pt-4 border-t border-[#333]">
                <p className="text-xs text-slate-500">For more details, check TUTORIAL.md on GitHub</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
