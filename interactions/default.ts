import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('default')
    .setDescription('default'),
  async execute(cmd: ChatInputCommandInteraction) {
    cmd.info(new Date().toString())
  }
};