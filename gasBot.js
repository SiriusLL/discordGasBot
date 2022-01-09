const { Client, Intents } = require("discord.js");
const axios = require("axios");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require("dotenv").config();

client.on("ready", () => {
  console.log("Running...");
  getGas();
  setInterval(getGas, [30000]);
});

const getGas = () => {
  const emoji = client.emojis.cache;
  const zap = client.emojis.cache.find((emoji) => console.log(emoji));
  console.log("zap", zap);
  const api = `https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=${process.env.DEFI_PULSE_KEY}`;

  axios
    .get(api)
    .then((res) => {
      gasPrice = res.data;
      console.log(
        "Gas Price:\n",
        gasPrice.fastest / 10,
        "|",
        gasPrice.fast / 10,
        "|",
        gasPrice.safeLow / 10
      );

      client.user.setActivity(
        `${gasPrice.fastest / 10} | ${gasPrice.fast / 10} | ${
          gasPrice.safeLow / 10
        }`,
        { type: "WATCHING" }
      );
    })
    .catch((error) => {
      console.log("Error", error);
    });
};

client.login(process.env.TOKEN);
