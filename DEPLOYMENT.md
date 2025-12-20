# 🚀 Guide de Déploiement GitHub + Vercel

## Étape 1 : Pousser sur GitHub

### Initialiser Git
```bash
cd c:\Users\Jeremi\.gemini\antigravity\scratch\private_on_chain_chat
git init
git add .
git commit -m "Initial commit: Private On-Chain Chat DApp"
```

### Créer un repo sur GitHub
1. Allez sur https://github.com/new
2. Nom du repo : `private-on-chain-chat`
3. Description : "Encrypted chat using Zama FHE on Ethereum"
4. Choisissez Public ou Private
5. **NE PAS** initialiser avec README (on l'a déjà)
6. Cliquez "Create repository"

### Pousser le code
```bash
git remote add origin https://github.com/VOTRE_USERNAME/private-on-chain-chat.git
git branch -M main
git push -u origin main
```

## Étape 2 : Déployer sur Vercel

### Option A : Via le site web (Recommandé)
1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Cliquez "Add New" → "Project"
4. Importez votre repo `private-on-chain-chat`
5. **Configuration importante** :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
6. Cliquez "Deploy"

### Option B : Via CLI
```bash
npm i -g vercel
cd frontend
vercel
```

## Étape 3 : Tester

Une fois déployé, Vercel vous donnera une URL comme :
```
https://private-on-chain-chat.vercel.app
```

### Test Checklist
- [ ] La page se charge
- [ ] Le bouton "Connect Wallet" fonctionne
- [ ] MetaMask se connecte sur Sepolia
- [ ] L'adresse du contrat est correcte (`0x9D08...`)
- [ ] Le statut affiche "Zama Network: Degraded" (normal pour l'instant)

## ⚠️ Important

- **Ne jamais commit** votre fichier `.env` avec votre clé privée !
- Le `.gitignore` protège déjà ce fichier
- Pour les collaborateurs : ils doivent créer leur propre `.env` à partir de `.env.example`

## 🎉 C'est tout !

Votre DApp est maintenant :
- ✅ Sur GitHub (code source)
- ✅ Déployé sur Vercel (accessible publiquement)
- ✅ Connecté au contrat Sepolia

Partagez l'URL Vercel pour que d'autres testent !
