import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {getEnviromentConfig} from './config'
require('dotenv').config();

class ConfigService {
  
  constructor(private env: { [k: string]: string | undefined }) { }

  public getValue(key: string, throwOnMissing = true): string {

    const config = getEnviromentConfig();

    const value = config[key];
    
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = process.env.NODE_ENV;
    return mode === 'PRODUCTION';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: [__dirname + '/../**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
      logging: false
    };
  }

  public getTypeOrmConfigTest(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      keepConnectionAlive: true,
      ssl: this.isProduction()
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    "PORT",
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DATABASE",
    "COIN_MARKET_URL",
    "COIN_EUR_MARKET_URL"
  ]);

export { configService };