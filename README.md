# Discord Bot: OpenAI Chatbot
This is a Discord bot built using Discord.js library and OpenAI API that can fetch data and generate responses. The bot can perform the following tasks:

Fetch messages from a specific user in a channel and generate a dataset for use with the OpenAI chatbot.
Generate a response from a provided message using the OpenAI chatbot.
Prompt the OpenAI chatbot with a specific message to generate a response.

# Installation
To install the bot, follow these steps:

Clone the repository or download the files.

Install the required dependencies by running npm install.

Create a .env file in the root directory with the following variables:


>TOKEN=the bot's token obtained from the Discord Developer Portal.
>
>CLIENT_ID=the bot's client ID obtained from the Discord Developer Portal.
>
>OPENAI_API_KEY=the OpenAI API key.

Register the commands by running commands.js.
Start the bot by running node index.js.

# Usage
Once the bot is running, it will listen for commands. The available commands are:

/fetchdata - fetches messages from a specific user in a channel and generates a dataset. Takes three options:

>target - the user whose messages to fetch.
  
>channel (optional) - the channel to fetch messages from. Defaults to the current channel.
  
>filter (optional) - a filter to apply to the messages. Only messages containing the filter will be fetched.
  
  
/chatgpt3 - prompts the OpenAI chatbot to generate a response to a provided message. Takes two options:

>target - the user whose chat history the bot will use to generate the response.
  
>message - the message to generate a response to.
  
  
/promptgpt3 - prompts the OpenAI chatbot to generate a message or continue a specific prompt. Takes two options:

>target - the user whose chat history the bot will use to generate the response.
  
>prompt (optional) - the prompt to use. If no prompt is provided, the bot will generate a default prompt.
  
  
Note that the bot will only respond to messages sent by the bot owner or messages that are chat input commands.

# Contributing
If you would like to contribute to the project, feel free to create a pull request or open an issue.

# License
This project is licensed under the MIT license.
