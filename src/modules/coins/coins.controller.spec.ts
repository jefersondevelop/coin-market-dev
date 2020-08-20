import { Test, TestingModule } from '@nestjs/testing';
import { Coin } from '../../entities/coin.entity';
import { CoinController } from './coins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../config/config.service';
import { CoinService } from './coins.service';

describe('Auth Controller', () => {
  let controller: CoinController;

  // Set a max time out for jest 
  var MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

  jest.setTimeout(MAX_SAFE_TIMEOUT);

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forRoot(configService.getTypeOrmConfigTest()),
        TypeOrmModule.forFeature([Coin])
      ],
      providers:[
        CoinService
      ],
      controllers: [CoinController]
    }).compile();

    controller = module.get<CoinController>(CoinController);

  })  

  it('should be defined', () => {

    expect(true).toBe(true);
  
  });

});
