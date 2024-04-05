import { Message } from 'discord.js';
import { Logger } from '../utils/logger';

module.exports = {
  event: 'messageUpdate',
  async execute(oldMsg: Message, newMsg: Message) {
    Logger.messageUpdate(oldMsg, newMsg);
  },
};