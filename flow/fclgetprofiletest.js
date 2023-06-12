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

const profile = await fcl.query({
    cadence: `
      import Profile from 0xProfile

      pub fun main(address: Address): Profile.ReadOnly? {
        return Profile.read(address)
      }
    `,
    args: (arg, t) => [arg(process.env.FLOW_ADDRESS, t.Address)]
})

if (!profile) {
    throw new Error("No profile found. Please initialise a profile first.")
}
else
{
    console.log(profile)
    // {
    //     address: '0xab5381dc94942968',
    //     name: 'Anon',
    //     avatar: '',
    //     color: '#232323',
    //     info: ''
    // }
}
