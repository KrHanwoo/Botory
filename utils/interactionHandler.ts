import fs from 'fs';
import { Bot } from '../bot';
const { resolve } = require('path');
const { readdir } = require('fs').promises;

const map = new Map();

export const InteractionHandler = {

  async register() {
    console.log('Registering commands');
    const commands = Bot.client.application?.commands;
    if (!commands) throw Error('Failed to get command manager');

    let cache = await commands.fetch();

    let files = (await getFiles('interactions')).filter(file => file.endsWith('.js'));
    for (let f of files) {
      let interaction = require(f);
      let fn = interaction.execute;
      let data = interaction.data;
      if (data) {
        let cmd = await commands.create(data);
        map.set(data.name, fn);
        cache.delete(cmd.id);
      } else map.set(interaction.id, fn);
    }

    for (let c of cache.values()) {
      await c.delete();
    }

    Bot.client.on('interactionCreate', async (interaction: any) => {
      let key = interaction.commandName ?? interaction.customId;
      let fn = map.get(key);
      if (fn) fn(interaction);
    });

    console.log('Commands registerd');
  }
}


async function getFiles(dir: fs.PathLike) {
  let dirents = await readdir(dir, { withFileTypes: true });
  let files = await Promise.all(dirents.map((dirent: any) => {
    let res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}