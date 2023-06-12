import { OpenAI } from "langchain/llms/openai"
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { HumanChatMessage, SystemChatMessage } from "langchain/schema"
import { LLMChain } from "langchain/chains"
import { PassThrough } from "stream"
import { CallbackManager } from "langchain/callbacks"

// ****** AGENTS import ******

import { initializeAgentExecutorWithOptions } from 'langchain/agents';

// ****** End AGENTS import *******

// ****** Tools import ******* STEP 1 - Import your tools here

// Please add your tools here and or remove tools that you don't use
// It is important to note that the more tools you put the more context window will be used

// Some LLMS has a context size limit and you might get unpredictable results or  error
// if you use too many tools
// You can possibly specialises the endpoints below with each endpoint better are doing certain things

import {
  //SerpAPI,
  //AIPluginTool,
  RequestsGetTool,
  RequestsPostTool,
} from 'langchain/tools';

import {
  Calculator,
} from 'langchain/tools/calculator';

// CRYPTO SPECIFIC TOOLS
// Below are examples of tools that has been precreated for you to use and derived from since the the tools are open sourced
// and the tools source code can be found in the tools folder

// General Crypto tools
import GetCryptocurrencyMetadataBySymbolOrSlug from './tools/GetCryptocurrencyMetadataBySymbolOrSlug.js';
import GetCryptocurrencyPriceBySymbolOrSlug from './tools/GetCryptocurrencyPriceBySymbolOrSlug.js';
import GetCoinmarketcapRanking from './tools/GetCoinmarketcapRanking.js';
import GetCryptoContentFromCryptopanic from './tools/GetCryptoContentFromCryptopanic.js';

// Chainlink specific tools

// Currently dataprice feeds are demoed here from Sepolia Test, 
// You can add as many different ones as you need! Just copy the tool code and change necessary parameters
import GetChainlinkBTCUSD from './tools/GetChainlinkBTCUSD.js'; 

// Flow specific tools

// There is an in the flow folder for the different kinds of flow blockchain operations you want to able to do
// mutate, query generic ones, and then the specific ones applied for reading profiles for instance
import GetFlowProfile from './tools/GetFlowProfile.js';
import SetFlowProfileInfo from './tools/SetFlowProfileInfo.js';
import SetFlowProfileName from './tools/SetFlowProfileName.js';

// ****** End Tools import *******

export const methods = [
  {
    id: "ai-flow",
    title: "AI Flow Autonomous Task",
    route: "/ai-flow",
    method: "post",
    description:
      "This endpoint can mutate, query FLOW blockchain using keys predefined so automated tasks can be executed. As a sample demo, querying the accounts, profile and setting the attributes are showcased. It also knows how to get the price feed from chainlink for BTCUSD from Sepolia Blockchain. The power comes when you mix and matched between them, e.g. write the latest BTCUSD price into the profile info",
    inputVariables: ["input"],
    execute: async (input) => {
  
      // ****** Tools Made Available ******* STEP 2 - Specify the tools you want the autonous agent to be able to use when needed 
      // Only include the needed tools!
      // REMEMEBER To add the API keys if you use a specific tools in the .env file

      const tools = [
        // General Tool
        // new SerpAPI(),
        new Calculator(),
        new RequestsPostTool(),
        new RequestsGetTool(),
        // Put Crytpo Tools Below
        new GetCryptocurrencyMetadataBySymbolOrSlug(),
        new GetCryptocurrencyPriceBySymbolOrSlug(),
        new GetCoinmarketcapRanking(),
        // General Crypto
        new GetCryptoContentFromCryptopanic(),
        // ChainLink Specific Tools
        new GetChainlinkBTCUSD(),
        // Flow Specific Tools
        new GetFlowProfile(),
        new SetFlowProfileInfo(),
        new SetFlowProfileName(),
      ];
      
      // Feel free to change the model to sometjing else. e.g. gpt-4 or cohere etc
      const model = new OpenAI({ temperature: 0, model: 'gpt-3.5-turbo' });

      const executor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        { agentType: "zero-shot-react-description" }
      );

      const res = await executor.call(input)

      console.log(res);

      return res
    },
  },
  // Example endpoint for just a general expert on chainlink and flow
  {
    id: "general",
    title: "AI Flow General Chat Engine",
    route: "/general",
    method: "post",
    description: "General Expert on Flow Blockchain and Chainlink - Non technical (Use as stream). It is a generic query engine for things prior to end of 2021. With the power of LangchainJS, you can easily add more complex tools such as querying the flow documentation etc.",
    inputVariables: ["Text"],
    execute: async (input) => {
      const outputStream = new PassThrough()

      const callbackManager = CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          outputStream.write(token)
        },
      })
      const chat = new ChatOpenAI({
        temperature: 0,
        streaming: true,
        callbackManager,
      })

      const translationPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
          "You are a expert in the field of chainlink and flow blockchain. Assist the user with their query."
        ),
        HumanMessagePromptTemplate.fromTemplate("{Text}"),
      ])

      const chain = new LLMChain({ llm: chat, prompt: translationPrompt })

      chain.call(input).then((response) => {
        console.log(response)
        outputStream.end()
      })

      return { stream: outputStream }
    },
  },
  // SAMPLE ENDPOINTS BELOW HERE
  // EG Flow Blochain doumentation
  // Flow Cadence code generation

  // {
  //   id: "chat-translation",
  //   route: "/chat-translate",
  //   method: "post",
  //   description:
  //     "Translates a text from one language to another using a chat model.",
  //   inputVariables: ["Input Language", "Output Language", "Text"],
  //   execute: async (input) => {
  //     const chat = new ChatOpenAI({ temperature: 0 })

  //     const translationPrompt = ChatPromptTemplate.fromPromptMessages([
  //       SystemMessagePromptTemplate.fromTemplate(
  //         "You are a helpful assistant that translates {Input Language} to {Output Language}."
  //       ),
  //       HumanMessagePromptTemplate.fromTemplate("{Text}"),
  //     ])

  //     const chain = new LLMChain({ llm: chat, prompt: translationPrompt })
  //     const res = await chain.call(input)

  //     return res
  //   },
  // },
  // {
  //   id: "translation",
  //   route: "/translate",
  //   method: "post",
  //   description: "Translates a text from one language to another",
  //   inputVariables: ["Input Language", "Output Language", "Text"],
  //   execute: async (input) => {
  //     const llm = new OpenAI({ temperature: 0 })

  //     const template =
  //       "Translate the following text from {Input Language} to {Output Language}\n```{Text}```\n\n"
  //     const prompt = new PromptTemplate({
  //       template,
  //       inputVariables: Object.keys(input),
  //     })
  //     const chain = new LLMChain({ llm, prompt })
  //     const res = await chain.call(input)
  //     return res
  //   },
  // },
  // {
  //   id: "poem",
  //   route: "/poem",
  //   method: "post",
  //   description: "Generates a short poem about your topic (Use as stream)",
  //   inputVariables: ["Topic"],
  //   execute: async (input) => {
  //     const outputStream = new PassThrough()

  //     const callbackManager = CallbackManager.fromHandlers({
  //       async handleLLMNewToken(token) {
  //         outputStream.write(token)
  //       },
  //     })
  //     const llm = new OpenAI({
  //       temperature: 0,
  //       streaming: true,
  //       callbackManager,
  //     })

  //     const template = "Write me very short a poem about {Topic}."
  //     const prompt = new PromptTemplate({
  //       template,
  //       inputVariables: Object.keys(input),
  //     })
  //     const chain = new LLMChain({ llm, prompt })

  //     chain.call(input).then((response) => {
  //       console.log(response)
  //       outputStream.end()
  //     })

  //     return { stream: outputStream }
  //   },
  // },
]
