import fs from 'fs';
import { Bot } from '../bot';
import path from 'path';
import { Util } from './util';
import { REST, Routes } from 'discord.js';

const map = new Map();

export class InteractionHandler {

  static async init() {
    console.log('Registering commands');
    let commands = [];

    for (let f of getFiles('interactions')) {
      if (!Util.isScript(f)) continue;
      let interaction = require(f);
      let fn = interaction.execute;
      let data = interaction.data;
      if (data) {
        map.set(data.name, fn);
        commands.push(data.toJSON());
      } else map.set(interaction.id, fn);
    }

    const rest = new REST().setToken(Bot.config.token);
    await rest.put(Routes.applicationCommands(Bot.config.clientId), {body: commands});
    
    Bot.client.on('interactionCreate', async (interaction: any) => {
      let key = interaction.commandName ?? interaction.customId;
      let fn = map.get(key);
      fn(interaction).catch(() => null);
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