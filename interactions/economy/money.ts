import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Database } from '../../utils/database';
import { Money } from '../../utils/money';
import { RankFrame } from '../../utils/rankFrame';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('money')
    .setDescription('도토리 조회'),
  async execute(cmd: ChatInputCommandInteraction) {
    const member = cmd.member;
    if (!member || !(member instanceof GuildMember)) return cmd.na();

    let info = await Money.getInfo(member.id);
    let avatar = member.displayAvatarURL({ size: 128, extension: "png" });
    let canvas = await RankFrame.createMoneyFrame(member.displayName, info.money, info.rank, avatar);
    let filename = `${member.id}_${new Date().toISOString().split('T')[0]}.png`
    cmd.reply({
      files: [{ attachment: canvas.toBuffer(), name: filename }]
    });
  }
};