import prisma from '../db';

export class ConfigurationService {
  static async getConfig(name: string, defaultValue: string = '') {
    const config = await prisma.configuration.findUnique({
      where: { name }
    });
    return config ? config.value : defaultValue;
  }

  static async setConfig(name: string, value: string) {
    return await prisma.configuration.upsert({
      where: { name },
      update: { value },
      create: { name, value },
    });
  }

  static async getAllConfigs() {
    return await prisma.configuration.findMany();
  }
}
