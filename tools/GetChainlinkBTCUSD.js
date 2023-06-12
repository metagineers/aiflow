import { Tool } from 'langchain/tools';
import Ajv from 'ajv';


// Import Thirdweb SDK
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

// The following is the actual code that will be
// run by the tool when it is called
import axios from "axios";

async function call({}) {
  // From chainlink docs
  const aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "description",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
      name: "getRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ]
  const addr = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"

  // Contract ABI and address (replace with actual values)
  const contractAbi = aggregatorV3InterfaceABI
  const contractAddress = addr

  // Initialize the SDK (in this example, we're using read-only mode)
  const sdk = new ThirdwebSDK(Sepolia);

  // Get the contract
  const contract = await sdk.getContract(contractAddress, contractAbi);

  // get the decimals
  const decimals = await contract.call("decimals");

  console.log("Decimals: " + BigInt(decimals));

  // Interact with the contract
  const latestRoundData = await contract.call("latestRoundData");

  console.log("------" + JSON.stringify(latestRoundData[1]))
  console.log("------" + latestRoundData[1].toHexString())
  console.log("----------" + JSON.stringify(latestRoundData, null, 2))
  console.log("PropDesc" + Object.getOwnPropertyDescriptor(latestRoundData[1], 'hex'))
  // Seems the return value is an array which is detected as all bignumbers by thirdweb sdk without the types in the output definition of the ABIs
  // shown below:
  // outputs: [
  //   { internalType: "uint80", name: "roundId", type: "uint80" },
  //   { internalType: "int256", name: "answer", type: "int256" },
  //   { internalType: "uint256", name: "startedAt", type: "uint256" },
  //   { internalType: "uint256", name: "updatedAt", type: "uint256" },
  //   { internalType: "uint80", name: "answeredInRound", type: "uint80" },
  // ],



  // So the output format given by thirdweb is like this
  // get the price from the second element of the latestRoundData array and take the hex value and convert it to a decimal string
  
  const price = BigInt(latestRoundData[1].toHexString()).toString();

  // get price to 8 decimals
  const priceWithDecimals = price.slice(0, price.length - 8) + "." + price.slice(price.length - 8);
  console.log(price);
  console.log(priceWithDecimals);

  return {
    price: priceWithDecimals,
  }
}




// This is a class that corresponds to the Langchain tool definition
// https://js.langchain.com/docs/modules/agents/tools/
// It validates the input & output against the schemas
// and then it calls the tool code
class GetChainlinkBTCUSD extends Tool {
  name = 'get-latest-btc-price-in-usd';
  
  description = `Get the latest btc price in usd from chainlink price feed using the following schema:
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

export default GetChainlinkBTCUSD;