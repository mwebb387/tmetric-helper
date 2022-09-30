import { Config } from './types.ts';

export const readConfig = async (filename: string): Promise<Config> => {
  const configText = await Deno.readTextFile(filename);
  return JSON.parse(configText);
}

