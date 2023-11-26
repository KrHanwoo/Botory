import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Raid } from '../../features/raid';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('goraid')
    .setDescription('레이드 시작')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(o => o
      .setName('보상')
      .setDescription('레이드 보상')
      .setMinValue(0)
      .setMaxValue(1000000)
    ),
  async execute(cmd: ChatInputCommandInteraction) {
    let options = cmd.options;
    await cmd.deferReply();
    let amount = options.getInteger('보상') ?? await Raid.calculatePrize();
    Raid.startRaid(amount, cmd);
  }
};