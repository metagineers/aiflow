import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { config } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types"

// Set the config
config({
    "accessNode.api": process.env.FLOW_ACCESSNODE_API, // Mainnet: "https://rest-mainnet.onflow.org"
    "discovery.wallet": process.env.FLOW_DISCOVERY_WALLET, // Mainnet: "https://fcl-discovery.onflow.org/authn"
    "0xProfile": process.env.FLOW_PROFILE_SMART_CONTRACT_ADDRESS, // The account address where the Profile smart contract lives on Testnet
    "private.key": process.env.FLOW_PRIVATE_KEY, // The private key of the account that is running the tool
    "0xFlowAddress": process.env.FLOW_ADDRESS
})

// PK signing stuffs
import pkg from 'elliptic';
const { ec: EC } = pkg;
import { SHA3 } from 'sha3';
const ec_p256 = new EC('p256');

const sign = (message) => {
  const key = ec_p256.keyFromPrivate(Buffer.from(process.env.FLOW_PRIVATE_KEY, "hex"))
  const sig = key.sign(hash(message)) // hashMsgHex -> hash
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

const hash = (message) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
}


// Auth function
const authzFn = async (txAccount) => {
  return {
    ...txAccount,
    addr: process.env.FLOW_ADDRESS,
    keyId: 0,
    signingFunction: async(signable) => {
      return {
        addr: process.env.FLOW_ADDRESS,
        keyId: 0,
        signature: sign(signable.message)
      }
    }
  }
}

const transactionId = await fcl.mutate({
  cadence: `
    import Profile from 0xProfile

    transaction(avatar: String) {
      prepare(account: AuthAccount) {
        account
          .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
          .setAvatar(avatar)
      }
    }
  `,
  args: (arg, t) => [arg("https://avatars.githubusercontent.com/goldzulu", t.String)],
  payer: authzFn,
  proposer: authzFn,
  authorizations: [authzFn],
  limit: 55
})

const transaction = await fcl.tx(transactionId).onceSealed()
console.log(transaction)