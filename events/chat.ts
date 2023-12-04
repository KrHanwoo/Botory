import { Message } from 'discord.js';
import { Chat } from '../features/chat.js';
import { Bot } from '../bot.js';

module.exports = {
  event: 'messageCreate',
  async execute(msg: Message) {
    if (msg.author.bot) return;
    const channel = msg.channel;
    if (channel.isDMBased()) return;
    if (channel.parentId == Bot.config.channel.playgroundCategory) return;

    Chat.chat(msg);
  }
};