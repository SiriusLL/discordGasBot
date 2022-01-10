const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = requre("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const { clientId, guildId, token } = process.env;
