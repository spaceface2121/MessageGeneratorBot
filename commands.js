const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const { SlashCommandBuilder } = require('discord.js');

const fetchdata = new SlashCommandBuilder()
  .setName('fetchdata').setDescription('Fetches messages for a user')
  .addUserOption(option => 
    option
    .setName('target')
    .setDescription('User')
    .setRequired(true))
  .addStringOption(option => 
    option
    .setName('filter')
    .setDescription('Filter'))
  .addChannelOption(option =>
    option
    .setName('channel')
    .setDescription('The channel to fetch messages from. Defaults to where you are right now.'));

const chatgpt3 = new SlashCommandBuilder()
  .setName('chatgpt3').setDescription('Chat with GPT3 behaving like a user')
  .addUserOption(option => 
    option
    .setName('target')
    .setDescription('User')
    .setRequired(true))
  .addStringOption(option => 
    option
    .setName('message')
    .setDescription('Message')
    .setRequired(true));

const promptgpt3 = new SlashCommandBuilder()
  .setName('promptgpt3').setDescription('Prompts GPT3 to behave like a user')
  .addUserOption(option => 
    option
    .setName('target')
    .setDescription('User')
    .setRequired(true))
  .addStringOption(option => 
    option
    .setName('prompt')
    .setDescription('prompt'));

const data = [fetchdata, chatgpt3, promptgpt3];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: data });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();