import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timezone')
    .setDescription('시간대 관리')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(o => o
      .setName('add')
      .setDescription('시간대 추가')
      .addUserOption(o => o
        .setName('멤버')
        .setDescription('대상 멤버')
        .setRequired(true)
      ).addStringOption(o => o
        .setName('시간대')
        .setDescription('시간대 코드')
        .setRequired(true)
      ).addNumberOption(o => o
        .setName('시차')
        .setDescription('시간대의 시차')
        .setMinValue(-12)
        .setMaxValue(14)
      )
    ).addSubcommand(o => o
      .setName('remove')
      .setDescription('멤버 제거')
      .addUserOption(o => o
        .setName('멤버')
        .setDescription('대상 멤버')
        .setRequired(true)
      )
    ),
  async execute(cmd: ChatInputCommandInteraction) {
    let options = cmd.options;
    cmd.info(options.getSubcommand());
  }
};