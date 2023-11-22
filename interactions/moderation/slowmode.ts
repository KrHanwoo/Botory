import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('슬로우 모드 설정')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addIntegerOption(o => o
      .setName('시간')
      .setDescription('슬로우 모드 시간')
      .setMinValue(0)
      .setMaxValue(21600)
      .setRequired(true)
    ),
  async execute(cmd: ChatInputCommandInteraction) {
    let channel = cmd.channel;
    let options = cmd.options;
    if (!channel) return cmd.na();
    if (channel.isDMBased()) return cmd.na();
    let time = options.getInteger('시간', true);
    let slowmode = await channel.setRateLimitPerUser(time).catch(() => null);
    if(!slowmode)return cmd.na();
    cmd.info(`슬로우 모드를 ${time.toLocaleString()}초로 설정했습니다.`, false);
  }
};