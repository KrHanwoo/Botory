import Discord, { GatewayIntentBits } from 'discord.js';
import config from './config.json';
import fs from 'fs';
import { ExtUtil } from './utils/extUtil';
import { Util } from './utils/util';

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});

export const Bot = {
  config : config,
  client : client
}

ExtUtil.initialize();

fs.readdirSync('./events').filter(Util.isScript).forEach(f => {
  const event = require(`./events/${f}`);
  client.on(event.event, (...args) => event.execute(...args));
});

(async () => {
  console.log(new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
  await client.login(config.token);
  console.log(`Logged as ${Bot.client.user?.username}`);
})();