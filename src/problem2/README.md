# Problem 2: Fancy Currency Swap Form

A modern, intuitive, and visually stunning cryptocurrency swap web application built for the **99Tech Code Challenge**.

✨ Built with **Vite**, **React**, **TypeScript**, and modern **Glassmorphic CSS**.

---

## 🚀 Quick Start

### 1. Navigate to the project directory
```bash
cd src/problem2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```
Production output will be generated in `src/problem2/dist/`.

---

## 🌟 Key Features

### 1. Live Exchange Rates & Intelligent Deduplication
- Fetches real-time price data directly from `https://interview.switcheo.com/prices.json`.
- **Deduplication algorithm**: Automatically groups by token currency and selects the entry with the most recent timestamp (`date`).
- Filters out tokens with invalid/missing price values.
- Includes automatic periodic refresh every 60 seconds with a manual **Live Rates** refresh trigger button.

### 2. Bidirectional Auto-Calculation
- Typing in **"Amount to send"** automatically calculates **"Amount to receive"** according to market exchange rate.
- Typing in **"Amount to receive"** reverse-calculates **"Amount to send"**.
- Displays real-time estimated **USD valuations** under both input boxes.
- Exchange rate bar with an **invert comparison** button (`1 ETH ≈ X Token` ⇄ `1 Token ≈ Y ETH`).

### 3. Searchable Token Selector Modal
- Search filter by token symbol (e.g. `ETH`, `ATOM`) or token name (e.g. `Cosmos`, `Ethereum`).
- **Popular Tokens** row for 1-click quick selection.
- Graceful **fallback avatar generator**: If an SVG token icon is missing from the Switcheo repository, a stylish deterministic gradient avatar with the token's initials is rendered.
- Displays live market prices and user wallet balances in the token list.

### 4. Robust Validation & UX Feedback
- **Insufficient Balance Detection**: Displays real-time warning if the input exceeds the user's available balance.
- **Dynamic Action Button States**:
  - `Select a token`
  - `Tokens must be different`
  - `Enter an amount`
  - `Insufficient [TOKEN] balance`
  - `Swap [FROM] for [TO]`
- Quick percentage buttons: `25%`, `50%`, `75%`, and `MAX`.
- Smooth animated **Flip Direction button** with 180° rotation.

### 5. Advanced DeFi Parameters
- **Slippage Tolerance Settings**: Quick presets (`0.1%`, `0.5%`, `1.0%`) and custom percentage input.
- Real-time warnings for risky slippage (frontrunning / transaction revert risks).
- Expandable **Slippage & Network details** breakdown:
  - Minimum received after slippage.
  - Liquidity provider fee.
  - Estimated network gas fee.
  - Order routing.

### 6. Realistic Transaction Lifecycle & Success Receipt
- Multi-stage simulated blockchain execution:
  1. *Optimizing Best Route...*
  2. *Waiting for Wallet Approval...*
  3. *Broadcasting to Blockchain...*
- **Celebration Confetti** and **Transaction Receipt**:
  - Clickable mock Etherscan block explorer transaction hash link (`0x...`).
  - Itemized swapped amounts and execution rate.
  - **Dynamic Wallet Balance Update**: Deducts swapped asset and credits received asset in the user's mock wallet.

---

## 🛠️ Tech Stack & Architecture

- **Bundler & Tooling**: [Vite](https://vite.dev/) (fast HMR, optimized production build)
- **UI Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/) + [Switcheo Token Icons](https://github.com/Switcheo/token-icons)
- **Styling**: Vanilla CSS with CSS Custom Properties, Glassmorphism, and responsive CSS Grid/Flexbox
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
