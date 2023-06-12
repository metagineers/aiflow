import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
config({
    "accessNode.api": process.env.FLOW_ACCESSNODE_API, // Mainnet: "https://rest-mainnet.onflow.org"
    "discovery.wallet": process.env.FLOW_DISCOVERY_WALLET, // Mainnet: "https://fcl-discovery.onflow.org/authn"
    "0xProfile": process.env.FLOW_PROFILE_SMART_CONTRACT_ADDRESS, // The account address where the Profile smart contract lives on Testnet
    "private.key": process.env.FLOW_PRIVATE_KEY, // The private key of the account that is running the tool
})

// key signing stuffs
import pkg from 'elliptic';
const { ec: EC } = pkg;

import { SHA3 } from 'sha3';

const ec = new EC('p256');

const key = ec.keyFromPrivate(process.env.FLOW_PRIVATE_KEY);

// Get the config
import { config } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types"

// Get account from latest block height
const account = await fcl.account(process.env.FLOW_ADDRESS);

console.log(account) 