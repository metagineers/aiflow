# AIFlow Autonomous Agents For ChainLink and Flow Blockchain 🚀

## 🏆 Winner of ChainLink Hackthon 🏆
This project won the [ChainLink Spring 2023 Hackathon!](https://chainlinkspring2023.devpost.com/) Flow Prize! 

You can find out more here! [DevPost AI Flow Project Showcase](https://devpost.com/software/aiflow-5kcvd4) Many thanks to the Flow community. I will be writing some blog posts with regards to the journey and few sets of tutorials to show how to use this tools to create autonomous agents for your own projects.

## What's next?
I will continue to maintain this project for quick and dirty Flow/AI Tool. Behind the scene, the next evolution of this tool which is a total rewrite and mostly no code interface will be done in the next few months. 

This will be a SaaS platform for creating autonomous agents for your own AI/Flow Blockchain projects. It will be a paid service but will be free for the first 100 users during the initial beta testing period. 

If you are interested in this, please contact me via [Twitter](https://twitter.com/voicetechguy1) or [LinkedIn](https://www.linkedin.com/in/goldzulu/)

## What is this?
A feature-packed framework tool helps you build expressive and powerful APIs using LangChain and Express.js. This framework tool  provides a solid foundation for creating your own custom automous agents API with a wide range of functionalities. Get started quickly and build amazing AI ChainLink and Flow Blockchain APIs with ease! 🎉

For convinience, and as this started from the Chainlink/Flow hackathon, the demo has a few tools already pre-coded for you to use for both ChainLink (pricefeed) and Flow (query and mutate generic ones and profile smart contract). Just call the API on one of the endpoints and ask for task to be done that use the tools in natural language and the AI agent will the do the heavy lifting for you!

e.g.
1. Get top bullish news on Flow Blockchain and set my profile info on flow blackchain with the news title
2. Get the price of Bitcoin in USD (from chainlink) and send it to my Flow Blockchain profile smart contract

## 🌈 Features

- 📦 Example implementations of common ChainLink pricefeed and Flow Blockchain - query, mutate tasks 
- 📦 Implemetation of getting hot, rising, bullish, bearish,important, saved, lol news from CryptoPanic (specify flow blockchain rather than just flow for best results) e.g. what is the top bullish news on flow blockchain?
- 📦 Implemetation of coinmarketcap ranking, metadata and price (for BTCUSD I have used Chainlink PriceFeed)
- 📋 Clear and simple structure for adding new methods and new crypto tools
- 📚 Auto-generated API documentation using OpenAPI and Swagger UI
- 🚦 Rate limiting and input validation for API routes
- 📈 Logging and error handling
- 🎨 Beautiful and autogenerated frontend for testing your API
- 🚀 Easy deployment to your favorite hosting platform
- 🐳 Docker-ready for smooth deployment

## 🎓 Getting Started

1. Clone this repository:

```bash
git clone https://github.com/metagineers/aiflow
```

2. Install dependencies:

```bash
cd aiflow
npm install
```

3. Create a `.env` file in the root directory and add your API keys for tools you will be using or enabled:

```ini
OPENAI_API_KEY=
SERP_API_KEY=
MORALIS_API_KEY=
X_CMC_PRO_API_KEY=
X_CMC_PRO_API_KEY_SANDBOX=
COINMARKETCAP_SANDBOX=
COINMARKETCAP_PROD=
CRYPTOPANIC_API_KEY=
FLOW_ADDRESS=
FLOW_PRIVATE_KEY=
FLOW_PROFILE_SMART_CONTRACT_ADDRESS=
FLOW_DISCOVERY_WALLET=
FLOW_ACCESSNODE_API=
```

4. Start the development server:

```bash
npm run start
```

5. Open your browser and navigate to `http://localhost:3000` to see the frontend and test your API.

6. Check out the auto-generated API documentation at `http://localhost:3000/api-docs`.

## 🛠 Adding New Methods

1. Open the `methods.js` file in the root directory.

2. Add a new method object to the `methods` array. The method object should have the following properties:

   - `id`: A unique identifier for the method (e.g., "translation").
   - `route`: The API route for the method (e.g., "/translate").
   - `method`: The HTTP method for the route (e.g., "post").
   - `title`: Short Title.
   - `description`: A brief description of the method.
   - `inputVariables`: An array of input variable names (e.g., ["Input Language", "Output Language", "Text"]).
   - `execute`: An async function that takes the input variables and returns the result.

3. In the `execute` function, you can use the `LangChain` library to create your Large Language Model chain. Check out the existing methods for examples.

4. Save the file and restart the development server. Your new method will be automatically added to the API and the documentation.

## 🛠 Adding New Tools

1. Open the folder `tools` in the root directory.

2. Pick a tool you want to start working with as a base implementation e.g. for ChainLink or Flow Blockchain

3. Named the tool file and import it into `methods.js` above.

4. Enable the tool by modifying the Tool array in `methods.js`

Also under the `flow` directory, there are test js files you can use to quickly test flow blockchain operations and created new functionality and features prior to using an embedding them as AI tools.

## ChainLink Notes

1. Price Feed data obtained via offchain methods (reading the smart contract) from Sepolia test

Demoed for BTCUSD.

Feel free to add more pairs and/or chains.

2. The API framework is by itself good to go as an API, it is not hard to use chainlink functions then to call it.

Example would be as a bridge, where you can chainlink function call for a price feed and then automatically write down the state in Flow Blockchain demonstrating some sort of Proof Of Prompt etc.

## Flow Blockchain

The sky is the limit here as any one of the common tasks have been demoed and can be expanded upon. Early experiments have been done to also write cadence code and since it's easy to use the intructional templates, it is easy to create new ones as tools for dynamic custom generation via AI.

1. Currently as this is only a test and as it is meant to be running autonomously, the keys need to be generated first and account funded. After this you can use the AI to Initialise the profile etc as part of the initial setup.

2. Work is started to look at extending this using hybrid custodial wallets etc and using AWS Nitro Enclaves to store the keys securely and use them for signing transactions.

## The Power of LangchainJS

1. Do not underestimate the power that is available to you via LangchainJS. You can use it to create any type of AI tool you want and then use it as a bridge to the blockchain. This is a very powerful concept and can be used to create a whole new generation of tools and applications. Also the fact that you can connect to providers such as Zapier, IFTTT, Google Assistant, Alexa, Siri, Cortana etc. means that you can create a whole new generation of AI tools and applications that can be used by anyone.

## 📖 Documentation

- [LangChainJS Documentation](https://js.langchain.com/docs/)
- [OpenAI API Reference](https://beta.openai.com/docs/api-reference/introduction)
- [Express.js Documentation](https://expressjs.com/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

## 🚢 Deployment

You can easily deploy your AIFlow API to your favorite hosting platform (e.g., Heroku, AWS, Google Cloud, etc.). Just follow the platform-specific deployment instructions and make sure to set the necessary environment variable in your deployment environment. You can also use Docker.

## 🤝 Contributing

We welcome contributions to the AI Flow Autonomous Agents! If you have any ideas, suggestions, or bug reports, please feel free to open an issue or submit a pull request.

## 📃 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---------------------------------------

Made with ❤️ by GoldZulu and the [Metagineers](https://metagineers.com) Team
