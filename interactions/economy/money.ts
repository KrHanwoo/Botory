import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Database } from '../../utils/database';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('money')
    .setDescription('도토리 조회'),
  async execute(cmd: ChatInputCommandInteraction) {
    //TODO: Money feature manager
    let doc = await Database.get('money').findOne({member: cmd.user.id});
    cmd.info(`도토리: ${doc?.money?.toLocaleString() ?? 0}개\n(임시 명령어 입니다.)`);
  }
};