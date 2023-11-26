import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Money } from '../../utils/money';
import { RankFrame } from '../../utils/rankFrame';
import { Util } from '../../utils/util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('money')
    .setDescription('도토리 확인')
    .setDMPermission(false)
    .addUserOption(o => o
      .setName('멤버')
      .setDescription('확인할 멤버')
    ),
  async execute(cmd: ChatInputCommandInteraction) {
    let options = cmd.options;
    const member = options.getMember('멤버') ?? cmd.member;
    if (!member || !(member instanceof GuildMember)) return cmd.na();

    await cmd.deferReply({ephemeral: true});
    let info = await Money.getInfo(member.id);
    let canvas = await RankFrame.createMoneyFrame(member, info.money, info.rank);
    let filename = `${member.id}_${Util.currentDate()}.png`;
    cmd.reply({
      files: [{ attachment: canvas.toBuffer(), name: filename }],
      ephemeral: true
    });
  }
};