import DiscordBot, { Client, Intents } from "discord.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    ,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
});

const guildId = process.env.GUILD_ID;

const gasPrices = {
  fastest: null,
  fast: null,
  safeLow: null,
  average: null,
};

const getGas = () => {
  let gas;

  const api = `https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=${process.env.DEFI_PULSE_KEY}`;

  axios
    .get(api)
    .then((res) => {
      console.log(`Status: ${res.status}`);
      const gasPrice = res.data;
      console.log(
        `Gas Price:\n${gasPrice.fastest / 10} | ${gasPrice.fast / 10} | ${
          gasPrice.safeLow / 10
        }`
      );
      gas = `${gasPrices.fastest / 10} | ${gasPrices.fast / 10} | ${
        gasPrices.safeLow / 10
      } | ${gasPrices.average / 10}`;
      if (gasPrice && res.status === 200) {
        gasPrices.fastest = gasPrice.fastest;
        gasPrices.fast = gasPrice.fast;
        gasPrices.safeLow = gasPrice.safeLow;
        gasPrices.average = gasPrice.average;
      }
      // console.log("object", client.user);
      client.user.setUsername("Gas-Bot");
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
  setInterval(getGas, 30000);

  //guild '/' command
  const guild = client.guilds.cache.get(guildId);
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  commands?.create({
    name: "hello",
    description: "replies with a greeting",
  });

  commands?.create({
    name: "add",
    description: "Adds two numbers.",
    options: [
      {
        name: "num1",
        description: "The first numbers.",
        required: true,
        type: DiscordBot.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
      {
        name: "num2",
        description: "The second number",
        required: true,
        type: DiscordBot.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  });

  commands?.create({
    name: "gas",
    description: "fetches fast medium and slow gas price",
  });
});

client.on("messageCreate", (msg) => {
  const action = "!gas";
  // if (Interaction.isCommand()) return;
  if (msg.content === action) {
    msg.reply({
      content: `Fastest: ${gasPrices.fastest / 10} gwei\nFast: ${
        gasPrices.fast / 10
      } gwei\nAverage: ${gasPrices.average / 10} gwei\nSafe Low: ${
        gasPrices.safeLow / 10
      } gwei`,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "ping") {
    interaction.reply({
      content: "Hello Friend!!!",
      ephemeral: true,
    });
  } else if (commandName === "add") {
    //if using typescript can use ! at the end instead of || 0
    const num1 = options.getNumber("num1") || 0;
    const num2 = options.getNumber("num2") || 0;

    await interaction.deferReply({
      ephemeral: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await interaction.editReply({
      content: `The sum is ${num1 + num2}`,
    });
  } else if (commandName === "gas") {
    interaction.reply({
      content: `Fastest: ${gasPrices.fastest / 10} gwei\nFast: ${
        gasPrices.fast / 10
      } gwei\nAverage: ${gasPrices.average / 10} gwei\nSafe Low: ${
        gasPrices.safeLow / 10
      } gwei`,
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
