import prisma from '../db';

export class ConfigurationService {
  static async getConfig(name: string, defaultValue: string = '') {
    try {
      const config = await prisma.configuration.findUnique({
        where: { name }
      });
      return config ? config.value : defaultValue;
    } catch (error) {
      console.error(`Error fetching config ${name}:`, error);
      return defaultValue;
    }
  }

  static async setConfig(name: string, value: string) {
    try {
      return await prisma.configuration.upsert({
        where: { name },
        update: { value },
        create: { name, value },
      });
    } catch (error) {
      console.error(`Error setting config ${name}:`, error);
      throw error;
    }
  }

  static async getAllConfigs() {
    try {
      return await prisma.configuration.findMany();
    } catch (error) {
      console.error('Error fetching all configs:', error);
      return [];
    }
  }
}
