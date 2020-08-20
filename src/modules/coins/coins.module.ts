import { Module } from "@nestjs/common";
import { CoinService } from './coins.service';
import { CoinController } from './coins.controller'
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coin } from "../../entities/coin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Coin])],
  providers: [CoinService],
  controllers: [CoinController],
  exports: [CoinService]
})
export class CoinModule {}
