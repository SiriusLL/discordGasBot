const { Client, Intents, Interaction } = require("discord.js");
const axios = require("axios");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require("dotenv").config();

const gasPrices = {
  fastest: null,
  fast: null,
  safeLow: null,
  average: null,
};

const getGas = () => {
  let gas;
  // const emoji = client.emojis.cache;
  // const zap = client.emojis.cache.find((emoji) => console.log(emoji));
  // console.log("zap", zap);
  const api = `https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=${process.env.DEFI_PULSE_KEY}`;

  axios
    .get(api)
    .then((res) => {
      console.log("statussss", res.status);
      gasPrice = res.data;
      console.log(
        "Gas Price:\n",
        gasPrice.fastest / 10,
        "|",
        gasPrice.fast / 10,
        "|",
        gasPrice.safeLow / 10
      );
      gas = `${gasPrices.fastest / 10} | ${gasPrices.fast / 10} | ${
        gasPrices.safeLow / 10
      } | ${gasPrices.average / 10}`;
      if (res.status === 200) {
        gasPrices.fastest = gasPrice.fastest;
        gasPrices.fast = gasPrice.fast;
        gasPrices.safeLow = gasPrice.safeLow;
        gasPrices.average = gasPrice.average;
      }
      client.user.setActivity(
        `${gasPrices.fastest / 10} | ${gasPrices.fast / 10} | ${
          gasPrices.safeLow / 10
        }`,
        { type: "WATCHING" }
      );
    })
    .catch((error) => {
      // console.log("error", error);
      console.log("Error", error.response.statusText);
      client.user.setActivity(
        `S=>${gasPrices.fastest / 10} | ${gasPrices.fast / 10} | ${
          gasPrices.safeLow / 10
        }`,
        { type: "WATCHING" }
      );
    });
};

client.on("ready", () => {
  console.log(`BeepBop successfully started as ${client.user.tag} 🤖`);
  getGas();
  setInterval(getGas, [30000]);
});

client.on("interactionCreate", async (msg) => {
  const action = "!gas";
  if (!interaction.isCommand()) return;
  if (interaction.commandName === action) {
    msg.reply(
      `Fastest: ${gasPrices.fastest / 10} gwei\nFast: ${
        gasPrices.fast / 10
      } gwei\nAverage: ${gasPrices.average / 10} gwei\nSafe Low: ${
        gasPrices.safeLow / 10
      } gwei`
    );
  }
});

client.login(process.env.TOKEN);
