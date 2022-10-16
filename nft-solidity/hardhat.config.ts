import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    geth: {
      url: "http://127.0.0.1:8545",
    },
    frontier: {
      url: "http://127.0.0.1:9933",
			chainId: 1337,
			accounts: [
				"0x99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342",
				"0xe2033d436ce0614acc1ee15bd20428b066013f827a15cc78b063f83ac0baae64"
			],
    }
  },
  solidity: {
    compilers: [
			{
				version: "0.7.6",
			},
			{
				version: "0.4.18",
			},
		],
  },
};

export default config;
