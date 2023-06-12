import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
config({
    "accessNode.api": process.env.FLOW_ACCESSNODE_API, // Mainnet: "https://rest-mainnet.onflow.org"
    "discovery.wallet": process.env.FLOW_DISCOVERY_WALLET, // Mainnet: "https://fcl-discovery.onflow.org/authn"
    "0xProfile": process.env.FLOW_PROFILE_SMART_CONTRACT_ADDRESS, // The account address where the Profile smart contract lives on Testnet
    "private.key": process.env.FLOW_PRIVATE_KEY, // The private key of the account that is running the tool
})

// Get the config
import { config } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types"

const response = await fcl.query({
  cadence: `
    pub fun main(): Int {
      return 1 + 2
    }
  `
})

console.log(response) // 3