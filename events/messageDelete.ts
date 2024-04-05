import { Message } from 'discord.js';
import { Logger } from '../utils/logger.js';

module.exports = {
  event: 'messageDelete',
  async execute(msg: Message) {
    Logger.messageDelete(msg);
  }
};