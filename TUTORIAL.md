# 📚 Guide d'Utilisation - Private On-Chain Chat

Bienvenue sur **Private On-Chain Chat**, votre application de messagerie chiffrée sur blockchain !

## 🚀 Démarrage Rapide

### Prérequis
- ✅ Navigateur web (Chrome, Firefox, Brave, etc.)
- ✅ Extension MetaMask installée
- ✅ Compte MetaMask avec Sepolia ETH

### Obtenir du Sepolia ETH (Gratuit)
1. Visitez [Sepolia Faucet](https://sepoliafaucet.com/)
2. Connectez votre wallet
3. Demandez des ETH de test (gratuit)

---

## 📖 Guide Étape par Étape

### Étape 1 : Connexion du Wallet 🦊

1. **Cliquez sur "Connect Wallet"** (bouton en haut à droite)
2. **MetaMask s'ouvre** → Sélectionnez votre compte
3. **Confirmez** la connexion
4. **Vérifiez** : Votre adresse apparaît (ex: `0x1234...5678`)

```
┌─────────────────────────────┐
│  Private Chat  [0x12...78]  │ ← Adresse visible
└─────────────────────────────┘
```

---

### Étape 2 : Consulter vos Statistiques 📊

Juste en dessous du header, vous verrez :

```
┌─────────────────────────────┐
│  📊 Statistiques            │
│  Envoyés: 5 | Reçus: 3 | 8  │
└─────────────────────────────┘
```

- **Envoyés** : Nombre de messages que vous avez envoyés
- **Reçus** : Messages reçus (mis à jour avec le bouton 🔄)
- **Total** : Somme des deux

---

### Étape 3 : Vérifier votre Inbox 📬

La section **Inbox** affiche les messages que vous avez reçus.

**Actions** :
- Cliquez sur **🔄** pour actualiser
- Le compteur affiche le nombre de messages

```
┌─────────────────────────────┐
│  📬 Inbox          [🔄]     │
│                             │
│  Messages reçus             │
│  Vous avez 3 messages   [3] │
└─────────────────────────────┘
```

> **Note** : Les messages sont chiffrés. Seuls vous et l'expéditeur pouvez les lire !

---

### Étape 4 : Consulter l'Historique 📤

La section **Messages Envoyés** montre vos 5 derniers messages :

```
┌─────────────────────────────┐
│  📤 Envoyés (5 total)       │
│  ┌─────────────────────────┐│
│  │ À: 0x1234...5678        ││
│  │ "Hello World"           ││
│  │ ✓ Envoyé      14:30     ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

**Informations affichées** :
- Adresse du destinataire (tronquée)
- Contenu du message
- Statut : ✓ Envoyé
- Heure d'envoi

---

### Étape 5 : Envoyer un Message 💌

#### 5.1 Entrer l'Adresse du Destinataire

```
┌─────────────────────────────┐
│  Recipient address (0x...)  │ ← Collez l'adresse ici
└─────────────────────────────┘
```

**Format** : `0x` suivi de 40 caractères hexadécimaux
**Exemple** : `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

#### 5.2 Écrire votre Message

```
┌─────────────────────────────┐
│  Type your message...       │ ← Max 32 caractères
└─────────────────────────────┘
```

**Limite** : 32 caractères maximum
**Caractères autorisés** : Lettres, chiffres, espaces, ponctuation

#### 5.3 Envoyer

1. **Cliquez sur le bouton Send** 📨
2. **Animation** : Un message volant apparaît ! 💌
3. **MetaMask** : Confirmez la transaction (frais de gaz)
4. **Confirmation** : "Message sent (Simulated)"

```
     💌
    /  \
   /    \  ← Animation de message volant
  /______\
```

---

## 🔒 Sécurité & Confidentialité

### Chiffrement FHE
Vos messages sont chiffrés avec **Fully Homomorphic Encryption** :
- ✅ Chiffrement de bout en bout
- ✅ Seuls vous et le destinataire pouvez lire
- ✅ Même le réseau ne peut pas déchiffrer

### Permissions
Le smart contract utilise `FHE.allow()` pour garantir que :
- L'**expéditeur** peut lire le message
- Le **destinataire** peut lire le message
- **Personne d'autre** ne peut accéder au contenu

---

## 💡 Conseils & Astuces

### ✅ Bonnes Pratiques
- **Vérifiez l'adresse** avant d'envoyer (irréversible !)
- **Messages courts** : Max 32 caractères
- **Gardez du Sepolia ETH** pour les frais de gaz

### ⚠️ Limitations Actuelles
- **Gateway Zama** : Actuellement en mode dégradé
- **Simulation** : Les messages sont simulés en attendant
- **32 caractères** : Limite technique du contrat

### 🔄 Actualiser les Données
- Cliquez sur **🔄** dans l'Inbox pour rafraîchir
- Les statistiques se mettent à jour automatiquement

---

## 🆘 Résolution de Problèmes

### Problème : "Please install MetaMask!"
**Solution** : Installez l'extension MetaMask depuis [metamask.io](https://metamask.io/)

### Problème : "Invalid recipient address"
**Solution** : Vérifiez que l'adresse commence par `0x` et contient 42 caractères

### Problème : "Message too long"
**Solution** : Réduisez votre message à 32 caractères maximum

### Problème : Pas de popup MetaMask
**Solution** : 
- Le site est en mode simulation (gateway Zama down)
- Les transactions réelles seront activées une fois le gateway opérationnel

---

## 📊 Comprendre l'Interface

### Header
- **Private Chat** : Logo de l'app
- **Connect Wallet** : Connexion MetaMask
- **Adresse** : Votre wallet (une fois connecté)

### Statistiques
- **Envoyés** : Compteur bleu
- **Reçus** : Compteur violet
- **Total** : Compteur vert

### Inbox
- **Messages reçus** : Nombre de messages
- **🔄 Refresh** : Actualiser

### Historique
- **5 derniers messages** : Liste scrollable
- **Détails** : Destinataire, contenu, heure

### Zone d'Envoi
- **Champ 1** : Adresse du destinataire
- **Champ 2** : Votre message
- **Bouton Send** : Envoyer

---

## 🌟 Fonctionnalités Avancées

### Persistance Locale
Vos statistiques et historique sont **sauvegardés localement** :
- Conservés entre les sessions
- Stockés dans votre navigateur
- Effacés si vous videz le cache

### Animation d'Envoi
À chaque envoi, profitez d'une **animation élégante** :
- Message volant du bas vers le haut
- Rotation 360°
- Effets lumineux

---

## 📞 Support

### Questions ?
- Consultez le [README.md](../README.md)
- Vérifiez le [DEPLOYMENT.md](../DEPLOYMENT.md)

### Bugs ?
- Ouvrez une issue sur GitHub
- Décrivez le problème en détail

---

## 🎉 Profitez de Private Chat !

Vous êtes maintenant prêt à envoyer des messages chiffrés sur la blockchain ! 🚀

**Rappel** : Vos messages sont **privés** et **sécurisés** grâce au chiffrement FHE. Seuls vous et votre destinataire pouvez les lire.

---

*Dernière mise à jour : Décembre 2024*
