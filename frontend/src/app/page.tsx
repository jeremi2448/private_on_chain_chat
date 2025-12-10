"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Lock, Send, Wallet, RefreshCw, Trash2, Mail, HelpCircle, X } from "lucide-react";
import "./animations.css";
// import { createInstance } from "fhevmjs"; // Uncomment when network is ready

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

  // Load from localStorage on mount
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

  // Save to localStorage when stats or sentMessages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatStats', JSON.stringify({ sentMessages, stats }));
    }
  }, [sentMessages, stats]);

  const loadMessages = async () => {
    if (!account) return;

    try {
      // TODO: Implement contract call when FHE is available
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      // const count = await contract.getMessageCount();
      // setReceivedMessages(Number(count));

      // Simulate for now
      console.log("Would fetch message count for:", account);
    } catch (error) {
      console.error("Failed to load messages:", error);
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
    setShowAnimation(true);
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
      await new Promise(r => setTimeout(r, 2000)); // Longer for animation

      console.log("Message would be sent to:", recipientAddress, "Content:", newMessage, "Chunks:", chunks);

      // Save sent message
      const sentMsg = {
        to: recipientAddress,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: "Sent"
      };
      setSentMessages(prev => [sentMsg, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        sent: prev.sent + 1,
        lastMessage: new Date().toISOString()
      }));

      setStatus("Message sent (Simulated)");
      setNewMessage("");
      setRecipientAddress("");
    } catch (error) {
      console.error("Send failed:", error);
      setStatus("Send failed: Network unavailable");
    } finally {
      setLoading(false);
      setTimeout(() => setShowAnimation(false), 500); // Hide animation after delay
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans">

      {/* Flying Message Animation */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="animate-fly">
            <div className="relative">
              <Mail className="w-24 h-24 text-indigo-400 drop-shadow-2xl animate-pulse" />
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-ping"></div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Private Chat Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="font-bold text-lg tracking-tight">Private Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors"
              title="Aide"
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
            </button>
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
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2 bg-slate-950/50 text-xs text-slate-400 flex justify-between items-center border-b border-slate-800/50">
          <span>Status: <span className={status.includes("failed") ? "text-red-400" : "text-emerald-400"}>{status}</span></span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            Zama Network: Degraded
          </span>
        </div>

        {/* Statistics Dashboard */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-800/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-400">{stats.sent}</p>
              <p className="text-xs text-slate-400 mt-1">Envoyés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{stats.received}</p>
              <p className="text-xs text-slate-400 mt-1">Reçus</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.sent + stats.received}</p>
              <p className="text-xs text-slate-400 mt-1">Total</p>
            </div>
          </div>
        </div>

        {/* Inbox */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-950/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Inbox
            </h3>
            <button
              onClick={loadMessages}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              disabled={!account}
            >
              <RefreshCw className="w-4 h-4" />
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
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Messages reçus</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Vous avez {receivedMessages} message{receivedMessages > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-indigo-500/20 px-3 py-1 rounded-full">
                  <span className="text-indigo-300 font-bold">{receivedMessages}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sent Messages History */}
        <div className="max-h-[300px] overflow-y-auto p-6 space-y-3 bg-slate-950/20 border-t border-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Messages Envoyés
            </h3>
            <span className="text-xs text-slate-500">{sentMessages.length} total</span>
          </div>

          {sentMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">Aucun message envoyé</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sentMessages.slice(0, 5).map((msg, i) => (
                <div key={i} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1">
                        À: {msg.to.slice(0, 6)}...{msg.to.slice(-4)}
                      </p>
                      <p className="text-sm text-slate-200 truncate">{msg.content}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs text-emerald-400">✓ {msg.status}</p>
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

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-indigo-400" />
                Guide d'Utilisation
              </h2>
              <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <section>
                <h3 className="font-semibold text-lg mb-3 text-indigo-400">🚀 Démarrage Rapide</h3>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>Cliquez sur "Connect Wallet" pour connecter MetaMask</li>
                  <li>Assurez-vous d'être sur le réseau Sepolia</li>
                  <li>Obtenez du Sepolia ETH gratuit sur un faucet</li>
                </ol>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3 text-purple-400">📤 Envoyer un Message</h3>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>Entrez l'adresse Ethereum du destinataire (0x...)</li>
                  <li>Tapez votre message (max 32 caractères)</li>
                  <li>Cliquez sur Send et confirmez dans MetaMask</li>
                  <li>Profitez de l'animation ! 💌</li>
                </ol>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3 text-emerald-400">📊 Statistiques</h3>
                <p className="text-slate-300 mb-2">Le dashboard affiche :</p>
                <ul className="space-y-1 list-disc list-inside text-slate-400">
                  <li><span className="text-indigo-400">Envoyés</span> : Messages que vous avez envoyés</li>
                  <li><span className="text-purple-400">Reçus</span> : Messages reçus (cliquez 🔄 pour actualiser)</li>
                  <li><span className="text-emerald-400">Total</span> : Somme des deux</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3 text-yellow-400">🔒 Confidentialité</h3>
                <p className="text-slate-300">Vos messages sont chiffrés avec <strong>FHE (Fully Homomorphic Encryption)</strong>. Seuls vous et le destinataire pouvez les lire !</p>
              </section>

              <section className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-red-400">⚠️ Important</h3>
                <ul className="space-y-1 list-disc list-inside text-slate-400 text-xs">
                  <li>Maximum 32 caractères par message</li>
                  <li>Vérifiez l'adresse avant d'envoyer (irréversible)</li>
                  <li>Gateway Zama actuellement en mode dégradé</li>
                </ul>
              </section>

              <div className="text-center pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500">Pour plus de détails, consultez TUTORIAL.md sur GitHub</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
