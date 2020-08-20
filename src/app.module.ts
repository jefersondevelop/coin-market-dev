import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinModule } from './modules/coins/coins.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule, CoinModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
