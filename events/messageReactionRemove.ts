import { MessageReaction, User } from 'discord.js';
import { Logger } from '../utils/logger.js';

module.exports = {
  event: 'messageReactionRemove',
  async execute(reaction: MessageReaction, user: User) {
    Logger.messageReactionRemove(reaction, user);
  },
};