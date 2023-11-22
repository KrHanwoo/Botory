import { Guild, GuildTextBasedChannel } from 'discord.js';
import { Bot } from '../bot';


export const BotCache = {

  async init() {

  }
}

async function getChannel(id: string): Promise<GuildTextBasedChannel> {
  return await Bot.client.channels.fetch(id) as GuildTextBasedChannel;
}