# 🎁 Monad Red Packet DApp

[English](./README.en.md) · [中文](./README.md)

A Web3 red-packet (hongbao) app on [Monad](https://monad.xyz) Mainnet. Send and claim MON with lucky-draw or equal-split modes, public or password-protected packets.

**Hosted as a static site on [Netlify](https://www.netlify.com).** The app is a single `index.html` — no bundler, no build step.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/syf1213764315/monad_main_luck)

## Features

- Native Monad look and feel (brand mark, purple/cyan palette, MON, MonadVision links)
- Multi-wallet: MetaMask, Coinbase Wallet, Trust Wallet, WalletConnect
- Lucky-draw (random) and equal-split packets
- Public packets or password-gated packets
- Send / claim history with live refresh
- Responsive layout for mobile and desktop

## Quick start

### 1. Deploy the frontend on Netlify (recommended)

1. Push this repository to GitHub
2. In [Netlify](https://app.netlify.com), choose **Add new site** → **Import an existing project**
3. Select the repo. Settings are already in `netlify.toml`:
   - **Build command**: none (static site)
   - **Publish directory**: `.`
4. Click **Deploy site**
5. Open the Netlify URL (and optionally attach a custom domain)

You can also click **Deploy to Netlify** above, or drag the folder onto [Netlify Drop](https://app.netlify.com/drop).

Preview locally:

```bash
npx --yes serve .
# open http://localhost:3000
```

### 2. Deploy the smart contract

Deploy `RedPacket.sol` to **Monad Mainnet** with Remix or Hardhat.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full walkthrough.

### 3. Point the UI at your contract

In `index.html`:

```javascript
const CONTRACT_ADDRESS = '0xYourContractAddressHere';
```

Commit and push — Netlify will republish automatically.

## Project layout

```
├── index.html          # DApp entry (Netlify publish root)
├── app.html            # Legacy URL → redirects to index.html
├── RedPacket.sol       # Solidity contract
├── netlify.toml        # Netlify config
├── assets/             # Monad mark + favicon
├── README.md           # Chinese README
├── README.en.md        # This file
└── DEPLOYMENT.md       # Contract + Netlify guide
```

## Stack

- Solidity ^0.8.0
- React 18 via CDN (no build)
- ethers.js v5.7 and WalletConnect v1.8
- Tailwind CSS with Monad brand colors (`#6E54FF`, `#0E091C`, `#85E6FF`)
- Netlify static hosting
- Monad Mainnet — Chain ID `143`, RPC `https://rpc.monad.xyz`

## Wallets

Browser extensions: MetaMask, Coinbase Wallet, Trust Wallet, or any `window.ethereum` provider.

Mobile: WalletConnect (Rainbow, imToken, TokenPocket, and 200+ others).

Details: [MULTI_WALLET.md](./MULTI_WALLET.md)

## How to use

**Send:** connect a wallet (the app will switch you to Monad) → Send → pick lucky draw or equal split → amount and count → public or password → confirm.

**Claim:** open a packet in the hall → Claim now (public) or enter the password → confirm. MON lands in your wallet.

**History:** sent packets and claim progress; received packets and total MON.

## Safety

- One claim per address per packet
- Sender cannot claim their own packet
- Passwords stored as keccak256 hashes
- Random mode keeps a minimum share for every claim
- Minimum packet size 0.001 MON

## Network

| Field | Value |
|------|--------|
| Network Name | Monad |
| RPC URL | https://rpc.monad.xyz |
| Chain ID | 143 |
| Currency | MON |
| Explorer | https://monadvision.com |

Fallback RPC: `https://rpc3.monad.xyz`

## FAQ

**Wallet will not connect.** Install an extension, approve the site, or use WalletConnect.

**Mobile?** Open the Netlify URL in your wallet’s in-app browser, or scan with WalletConnect.

**Cannot switch networks.** Add Monad manually with the table above.

**Empty packet list.** Confirm `CONTRACT_ADDRESS` in `index.html` and that the wallet is on Monad Mainnet (143).

**Blank page after Netlify deploy.** Publish directory must be `.` and the entry file `index.html`. Do not set a Node build command unless you add one.

## License

MIT

---

After deploying the contract, update `index.html`. Never commit private keys. Mainnet uses real MON — test thoroughly and consider an audit before putting meaningful funds in the contract.

Have fun sending luck on Monad.
