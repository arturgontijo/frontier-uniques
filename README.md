# Frontier EVM NFTs to Uniques Pallet (Proof-of-Concept)

### Running Frontier

```shell
cd frontier/
cargo build --release --no-default-features --features manual-seal
./target/release/frontier-template-node --log evm=trace --dev --sealing instant
```

### Running NFT Solidity Tests (on frontier chain)

```shell
cd nft-solidity/
npm i
npx hardhat compile
REPORT_GAS=true npx hardhat test --network frontier
```

### Running Subviz (ReactJS+D3+PolkadotJS)

```shell
cd storage-visualizer/subviz/
yarn
RPC_ENDPOINT=ws://localhost:9944 yarn start
```
