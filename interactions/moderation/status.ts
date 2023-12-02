import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Database } from '../../utils/database';
import { Util } from '../../utils/util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('상태 변경')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(o => o
      .setName('reset')
      .setDescription('상태 초기화')
    ).addSubcommand(o => o
      .setName('fix')
      .setDescription('점검 상태')
    ).addSubcommand(o => o
      .setName('set')
      .setDescription('상태 설정')
      .addStringOption(o => o
        .setName('상태')
        .setDescription('상태 종류')
        .addChoices(
          { name: 'online', value: 'online' },
          { name: 'idle', value: 'idle' },
          { name: 'dnd', value: 'dnd' },
          { name: 'invisible', value: 'invisible' },
        )
      ).addStringOption(o => o
        .setName('문구')
        .setDescription('상태 문구')
        .setMaxLength(128)
      )
    ),
  async execute(cmd: ChatInputCommandInteraction) {
    let options = cmd.options;
    let subcommand = options.getSubcommand();
    switch (subcommand) {
      case 'reset': {
        setStatus();
        return cmd.info('상태를 초기화 했습니다.');
      }
      case 'fix': {
        setStatus('dnd', '점검 중');
        return cmd.info('점검 상태로 변경했습니다.');
      }
      case 'set': {
        let status = options.getString('상태');
        let text = options.getString('문구');
        setStatus(status, text);
        return cmd.info('상태를 변경했습니다.');
      }
    }
  }
};

function setStatus(status?: string | null, activity?: string | null) {
  Util.setStatus(status, activity);
  Database.setStorage('status', { status, activity });
}
