import { Tool } from 'langchain/tools';
import Ajv from 'ajv';

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// Get the config
import { config } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types"

config({
  "accessNode.api": process.env.FLOW_ACCESSNODE_API, // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": process.env.FLOW_DISCOVERY_WALLET, // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "0xProfile": process.env.FLOW_PROFILE_SMART_CONTRACT_ADDRESS, // The account address where the Profile smart contract lives on Testnet
  "private.key": process.env.FLOW_PRIVATE_KEY, // The private key of the account that is running the tool
})

async function call({}) {
  // Check if the account has been initialized
  console.log('---' + 'checking profile info' + '---');

  const profileCheck = await fcl.query({
    cadence: `
      import Profile from 0xProfile

      pub fun main(address: Address): Bool {
        return Profile.check(address)
      }
    `,
    args: (arg, t) => [arg(process.env.FLOW_ADDRESS, t.Address)]
  })

  if (profileCheck) {
    console.log('---' + 'profile info exists' + '---');
    // If the account has been initialized, get the profile and return it
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(process.env.FLOW_ADDRESS, t.Address)]
    })
    
    console.log('---' + JSON.stringify(profile) + '---')

    return {
      profile
    }
  } else {

    console.log('---' + 'profile info missing .. init account!' + '---');
    
    throw new Error("No profile was found. Please Initialise a profile first.");
  }
}

// This is a class that corresponds to the Langchain tool definition
// https://js.langchain.com/docs/modules/agents/tools/
// It validates the input & output against the schemas
// and then it calls the tool code
class GetFlowProfile extends Tool {
  name = 'get-flow-profile-info';
  
  description = `Get the profile info of a Flow blockchain account. The action input should adhere to this JSON schema:
  {{}}`;
  
  ajv = new Ajv();

  inputSchema = {};
  
  // optionally can define the schema below but for now let's skip it
  outputSchema = '';

  validate(data, schema) {
    if (schema) {
      const validateSchema = this.ajv.compile(schema);
      if (!validateSchema(data)) {
        throw new Error(this.ajv.errorsText(validateSchema.errors));
      }
    }
  }

  async _call(arg) {
    let output;
    try {
      const input = JSON.parse(arg);
      this.validate(input, this.inputSchema);
      output = await call(input);
      try {
        this.validate(output, this.outputSchema);
      } catch (err) {
        throw new Error(`${err.message}: ${JSON.stringify(output)}`);
      }
    } catch (err) {
      output = { error: err.message || err };
    }
    return JSON.stringify(output);
  }
}

export default GetFlowProfile;