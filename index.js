const { default: axios } = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const Twit = require('twit');

dotenv.config();

const consumer_key_twitter = process.env.CONSUMER_KEY;
const consumer_secret_twitter = process.env.CONSUMER_SECRET;
const access_token_twitter = process.env.ACCESS_TOKEN;
const access_token_secret_twitter = process.env.ACCESS_TOKEN_SECRET;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const T = new Twit({
  consumer_key: consumer_key_twitter,
  consumer_secret: consumer_secret_twitter,
  access_token: access_token_twitter,
  access_token_secret: access_token_secret_twitter,
});

client.on('ready', () => {
  console.log('Ready!');
});

// Le bot écoute les messages sur le serveur
client.on('messageCreate', (message) => {
  if (message.channel.name != 'tweet') {
    if (message.content.startsWith('!tweet')) {
      message.channel.send(
        'Vous devez envoyer votre tweet dans le channel #tweet'
      );
    }
  } else if (message.channel.name == 'tweet') {
    if (message.content.startsWith('!tweet') && message.content.length <= 280) {
      message.content = message.content.replace('!tweet', '');
      T.post(
        'statuses/update',
        { status: message.content },
        function (err, data, response) {
          console.log('Tweet envoyé');
        }
      );
    } else if (
      message.content.startsWith('!tweet') == false &&
      message.author.bot == false
    ) {
      message.delete();
    } else if (message.content.length > 280) {
      message.channel.send(
        'Votre tweet ne doit pas dépasser 280 caractères, il fait ' +
          message.content.length +
          ' caractères'
      );
    }
  }
  if (message.content == '!epic') {
    axios
      .get(
        'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=fr'
      )
      .then((response) => {
        console.log(response.data.data.Catalog.searchStore.elements[1].title);
      });
  }
});

client.login(process.env.TOKEN);
