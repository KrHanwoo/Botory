import fs from 'fs';
import { Bot } from '../bot';
import path from 'path';
import { Util } from './util';

const map = new Map();

export const InteractionHandler = {

  async init() {
    console.log('Registering commands');
    const commands = Bot.client.application?.commands;
    if (!commands) throw Error('Failed to get command manager');

    let cache = await commands.fetch();

    for (let f of getFiles('interactions')) {
      if (!Util.isScript(f)) continue;
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

function* getFiles(dir: string): Generator<string> {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) yield* getFiles(path.resolve(dir, file.name));
    else yield path.resolve(dir, file.name);
  }
}