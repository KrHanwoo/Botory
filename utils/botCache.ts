import { Guild, GuildChannel, GuildTextBasedChannel, TextChannel } from 'discord.js';
import { Bot } from '../bot';

export class BotCache {
  static guild: Guild;
  static general: GuildTextBasedChannel;
  static rank: GuildTextBasedChannel;

  static async init() {
    this.guild = await Bot.client.guilds.fetch(Bot.config.guild);
    this.general = await getChannel(Bot.config.channel.general);
    this.rank = await getChannel(Bot.config.channel.rank);
    console.log('Channels fetched');
  }
}

async function getChannel(id: string): Promise<GuildTextBasedChannel> {
  return await Bot.client.channels.fetch(id) as GuildTextBasedChannel;
}