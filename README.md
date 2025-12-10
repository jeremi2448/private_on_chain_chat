<div align="center">

# 🔐 Private On-Chain Chat

**Messagerie Chiffrée Décentralisée sur Blockchain**

[![Sepolia](https://img.shields.io/badge/Network-Sepolia-blue)](https://sepolia.etherscan.io/)
[![Zama FHE](https://img.shields.io/badge/Powered%20by-Zama%20FHE-purple)](https://www.zama.ai/)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[🚀 Demo Live](#) • [📖 Documentation](TUTORIAL.md) • [🐛 Report Bug](#) • [✨ Request Feature](#)

![Private Chat Banner](https://via.placeholder.com/800x200/1e293b/818cf8?text=Private+On-Chain+Chat)

</div>

---

## 🌟 Aperçu

**Private On-Chain Chat** est une application de messagerie décentralisée qui utilise le **chiffrement homomorphe complet (FHE)** de Zama pour garantir une confidentialité absolue. Vos messages sont chiffrés de bout en bout et stockés sur la blockchain Ethereum, rendant impossible leur lecture par des tiers.

### ✨ Pourquoi Private Chat ?

- 🔒 **Confidentialité Absolue** : Chiffrement FHE - seuls vous et votre destinataire pouvez lire les messages
- 🌐 **Décentralisé** : Aucun serveur central, données stockées sur blockchain
- 💎 **Transparent** : Smart contracts open source et vérifiables
- 🚀 **Moderne** : Interface élégante avec animations fluides
- 📊 **Statistiques** : Dashboard personnel avec historique et métriques

---

## 🎯 Fonctionnalités

### 💬 Messagerie Chiffrée
- ✅ Messages texte jusqu'à 32 caractères
- ✅ Chiffrement FHE de bout en bout
- ✅ Validation d'adresse Ethereum
- ✅ Animation d'envoi captivante

### 📊 Dashboard Personnel
- ✅ Statistiques en temps réel (envoyés/reçus/total)
- ✅ Historique des 5 derniers messages
- ✅ Inbox avec compteur de messages
- ✅ Persistance locale (localStorage)

### 🎨 Interface Moderne
- ✅ Design dark mode élégant
- ✅ Animations fluides et micro-interactions
- ✅ Responsive (mobile/desktop)
- ✅ Aide intégrée avec tutoriel

---

## 🚀 Démarrage Rapide

### Prérequis

- [MetaMask](https://metamask.io/) installé
- Sepolia ETH ([obtenir gratuitement](https://sepoliafaucet.com/))
- Node.js 18+ (pour développement)

### 🌐 Utilisation (Non-Technique)

1. **Visitez l'application** : [Lien de démo](#)
2. **Connectez MetaMask** : Cliquez sur "Connect Wallet"
3. **Envoyez un message** :
   - Entrez l'adresse du destinataire (0x...)
   - Tapez votre message (max 32 caractères)
   - Cliquez sur "Send" et confirmez dans MetaMask
4. **Consultez vos stats** : Dashboard mis à jour automatiquement

📖 **Guide complet** : [TUTORIAL.md](TUTORIAL.md)

---

## 💻 Installation (Développeurs)

### 1️⃣ Cloner le Projet

```bash
git clone https://github.com/VOTRE_USERNAME/private-on-chain-chat.git
cd private-on-chain-chat
```

### 2️⃣ Configuration des Contrats

```bash
cd contracts
npm install

# Configurer l'environnement
cp .env.example .env
# Éditez .env avec votre PRIVATE_KEY et SEPOLIA_RPC_URL
```

### 3️⃣ Configuration du Frontend

```bash
cd ../frontend
npm install
```

### 4️⃣ Lancer en Local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Structure du Projet

```
private-on-chain-chat/
├── contracts/              # Smart contracts Solidity
│   ├── contracts/
│   │   └── PrivateChat.sol # Contrat principal
│   ├── scripts/
│   │   ├── deploy.ts       # Script de déploiement
│   │   └── interact.ts     # Script d'interaction
│   └── test/               # Tests unitaires
│
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx    # Page principale
│   │   │   └── animations.css
│   │   └── types/
│   │       └── global.d.ts # Types TypeScript
│   └── public/             # Assets statiques
│
├── TUTORIAL.md             # Guide utilisateur complet
├── DEPLOYMENT.md           # Guide de déploiement
└── README.md               # Ce fichier
```

---

## 🔧 Technologies Utilisées

### Smart Contracts
- **Solidity** `^0.8.24` - Langage de smart contracts
- **Hardhat** - Framework de développement
- **Zama FHEVM** - Chiffrement homomorphe
- **ethers.js** - Interaction blockchain

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Styling moderne
- **fhevmjs** - Client FHE
- **Lucide React** - Icônes

---

## 📜 Smart Contract

### Contrat Déployé

- **Réseau** : Sepolia Testnet
- **Adresse** : `0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2`
- **Explorer** : [Voir sur Sepolia Etherscan](https://sepolia.etherscan.io/address/0xF2c786CEc8CF878c73a8640E3F912831eFdB75c2)

### Fonctions Principales

```solidity
// Envoyer un message chiffré
function sendMessage(
    address _to,
    bytes32 _chunk1Handle,
    bytes32 _chunk2Handle,
    bytes32 _chunk3Handle,
    bytes32 _chunk4Handle,
    bytes calldata _inputProof,
    uint32 _ttl
) external;

// Obtenir le nombre de messages reçus
function getMessageCount() external view returns (uint256);

// Récupérer un message
function getMessage(uint256 index) external view returns (...);
```

---

## 🔒 Sécurité & Confidentialité

### Chiffrement FHE

Les messages utilisent le **Fully Homomorphic Encryption (FHE)** de Zama :

```solidity
// Seuls l'expéditeur et le destinataire peuvent déchiffrer
FHE.allow(encryptedContent, _to);        // Destinataire
FHE.allow(encryptedContent, msg.sender); // Expéditeur
```

### Garanties

- ✅ **Chiffrement de bout en bout** : Messages chiffrés côté client
- ✅ **Confidentialité absolue** : Impossible à déchiffrer par des tiers
- ✅ **Stockage sécurisé** : Données chiffrées sur blockchain
- ✅ **Permissions strictes** : Accès limité via `FHE.allow()`

---

## 📊 Statistiques & Métriques

L'application track automatiquement :

- 📤 **Messages envoyés** : Compteur personnel
- 📬 **Messages reçus** : Mis à jour via refresh
- 📈 **Total** : Somme des deux
- 🕐 **Historique** : 5 derniers messages avec timestamps

Toutes les données sont **sauvegardées localement** dans votre navigateur.

---

## 🛠️ Développement

### Compiler les Contrats

```bash
cd contracts
npx hardhat compile
```

### Tester les Contrats

```bash
npx hardhat test
```

### Déployer sur Sepolia

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Build Frontend

```bash
cd frontend
npm run build
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE_USERNAME/private-on-chain-chat)

1. Connectez votre repo GitHub
2. Configurez le root directory : `frontend`
3. Déployez !

### Option 2 : Manuel

Consultez [DEPLOYMENT.md](DEPLOYMENT.md) pour les instructions détaillées.

---

## 📖 Documentation

- 📚 [Guide Utilisateur Complet](TUTORIAL.md)
- 🚀 [Guide de Déploiement](DEPLOYMENT.md)
- 🔗 [Documentation Zama FHE](https://docs.zama.ai/fhevm)
- 📘 [Documentation Next.js](https://nextjs.org/docs)

---

## ⚠️ Limitations Actuelles

- **32 caractères max** par message (limitation technique FHE)
- **ASCII uniquement** (pas d'emojis pour l'instant)
- **Gateway Zama** : Actuellement en mode dégradé (simulation)
- **Frais de gaz** : Requis pour chaque message (Sepolia ETH)

---

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (Complété)
- [x] Smart contract avec FHE
- [x] Frontend Next.js
- [x] Statistiques et historique
- [x] Documentation complète

### 🔄 Phase 2 - Améliorations (En cours)
- [ ] Intégration réelle avec gateway Zama
- [ ] Support de messages plus longs
- [ ] Notifications en temps réel
- [ ] Thèmes personnalisables

### 🔮 Phase 3 - Avancé (Futur)
- [ ] Conversations de groupe
- [ ] Stockage IPFS
- [ ] Mobile app (React Native)
- [ ] Zero-Knowledge Proofs

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

---

## 🙏 Remerciements

- [Zama](https://www.zama.ai/) - Pour la technologie FHE révolutionnaire
- [Ethereum](https://ethereum.org/) - Pour la plateforme blockchain
- [Next.js](https://nextjs.org/) - Pour le framework frontend
- [Vercel](https://vercel.com/) - Pour l'hébergement

---

## 📞 Contact & Support

- 🐛 **Issues** : [GitHub Issues](https://github.com/jeremi2448/private-on-chain-chat/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/jeremi2448/private-on-chain-chat/discussions)
- 📧 **Email** : treepiton@gmail.com
- X  **Twitter** : @Tree14735795
- **Discord** : rib2874

---

<div align="center">

**Fait avec ❤️ en utilisant la technologie FHE de Zama**

[⬆ Retour en haut](#-private-on-chain-chat)

</div>
