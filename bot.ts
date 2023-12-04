import Discord, { GatewayIntentBits } from 'discord.js';
import config from './config.json';
import fs from 'fs';
import { ExtUtil } from './utils/extUtil';
import { Util } from './utils/util';
import { Database } from './utils/database';
import { Money } from './utils/money';
import { Xp } from './utils/xp';

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
  ]
});

export const Bot = {
  config: config,
  client: client
}

ExtUtil.init();

fs.readdirSync('./events').filter(Util.isScript).forEach(f => {
  const event = require(`./events/${f}`);
  client.on(event.event, (...args) => event.execute(...args));
});

process.on('uncaughtException', (e) => {
  console.log(e);
});

(async () => {
  console.log(new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
  await Database.init();
  console.log('Connected to Database');
  await client.login(config.token);
  console.log(`Logged as ${Bot.client.user?.username}`);
  
  Xp.init();
  Money.init();
})();