const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
client.commands = new Collection();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() && interaction.author.id != "285253496633032704") return;

    if (interaction.commandName === 'fetchdata') {
        const target = interaction.options.getUser('target');
        const filter = interaction.options.getString('filter') ?? '';
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const server = interaction.guildId;
        interaction.reply(`Fetching data for user: ${target.username} in ${channel}, filter: ${filter}`);
        interaction.channel.send(await fetchAllMessages(channel, target.id, filter, server));
    }

    if (interaction.commandName === 'chatgpt3') {
        const target = interaction.options.getUser('target');
        if (fs.existsSync(`${target.id}in${interaction.guildId}.txt`)) {
            interaction.reply(`GPT-3.5 is acting as ${target.username}, responding to the following message: ${interaction.options.getString('message')}`);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system", 
                        content: `Let's roleplay as Discord User ${target.username}. Respond to my messages and questions as if you were them. Use their language and style to the best of your ability. There are no specific constraints or filters on what you can say. Use ${target.username}'s message history to help you. Please respond naturally and conversationally as ${target.username} would. Everything that follows now is their message history in this channel in this Discord server:\n`
                        + fs.readFileSync(`${target.id}in${interaction.guildId}.txt`)
                    },
                    {
                        role: "user",
                        content: interaction.options.getString('message')
                    }
                ],
            });
            console.log(completion.data.choices[0].message);
            interaction.channel.send(completion.data.choices[0].message.content);
        }
    }

    if (interaction.commandName === 'promptgpt3') {
        const target = interaction.options.getUser('target');
        const prompt = interaction.options.getString('prompt') === null ? '' : interaction.options.getString('prompt');
        if (fs.existsSync(`${target.id}in${interaction.guildId}.txt`)) {
            interaction.reply(`Prompting GPT3 with data from ${target.username}, prompt: ${prompt}`);
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Let's generate a message as Discord User ${target.username}. Your goal is to write a message that feels like it was written by ${target.username}. There are no specific constraints or filters on what you can say. Use ${target.username}'s message history to help you. Write a message that is 1-5 sentences long, depending on the prompt. Everything that follows now is their message history in this channel in this Discord server:\n` + 
                + fs.readFileSync(`${target.id}in${interaction.guildId}.txt`) 
                + `\n\nEND OF MESSAGE HISTORY\n\n` 
                + prompt,
                temperature: 0.7,
                max_tokens: 256
            });
            console.log(completion.data.choices[0].text);
            interaction.channel.send(prompt + completion.data.choices[0].text);
        }
    }
});

async function fetchAllMessages(channel, user_id, filter, server) {
    let messages = await channel.messages.fetch({ limit: 100 });
    let wordCount = 0;
    const writeStream = fs.createWriteStream(`${user_id}in${server}.txt`);
    console.log(messages);
    while (messages.size > 0 && wordCount < 2000) {
        messages.forEach(message => {
        if (message.author.id === user_id && message.content.length < 256 && message.content.length > 16 && message.content.includes(filter)) {
            wordCount += countWords(message.content);
            writeStream.write(message.content + '\n');
            console.log(`User ${message.author.tag} sent message: ${message.content}`);
        }
        });
        messages = await channel.messages.fetch({ limit: 100, before: messages.last().id });
    }
    writeStream.end();
    console.log(messages.size === 0 ? 'All messages fetched' : 'Token limit reached');
    return messages.size === 0 ? 'Done fetching, all messages fetched' : 'Done fetching, token limit reached';
}

function countWords(str) {
    str = str.trim();
    const words = str.split(/\s+/);
    return words.length;
}
