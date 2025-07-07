# Eunpyoung Ecosystem

A blockchain-based ecosystem featuring EunCoin, NanumCoin, staking functionality, and donation conversion.

## Project Structure

- `contracts/`: Solidity smart contracts
  - `EunCoin.sol`: Main token contract
  - `NanumCoin.sol`: Secondary token contract
  - `Staking.sol`: Staking functionality
  - `DonationConverter.sol`: Donation conversion system
- `frontend/`: Next.js web application
- `scripts/`: Deployment scripts
- `test/`: Contract test files

## Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Hardhat

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/eunpyoung-ecosystem.git
cd eunpyoung-ecosystem
```

2. Install dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### Development

1. Compile contracts
```bash
npx hardhat compile
```

2. Run tests
```bash
npx hardhat test
```

3. Deploy contracts
```bash
npx hardhat run scripts/deploy.ts
```

4. Run frontend
```bash
cd frontend
npm run dev
```

## License

MIT 