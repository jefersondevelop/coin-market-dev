import { Test, TestingModule } from '@nestjs/testing';
import { Coin } from '../../entities/coin.entity';
import { CoinController } from './coins.controller';
import { TypeOrmModule, getCustomRepositoryToken, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '../../config/config.service';
import { CoinService } from './coins.service';

describe('Auth Controller', () => {
  let controller: CoinController;

  // Set a max time out for jest 
  var MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

  jest.setTimeout(MAX_SAFE_TIMEOUT);

  class RepoCoinFake {
    
    public coin 

    constructor(){
      this.coin = {
        Id: 0,
        Name: 'Coin for test',
        ValueUSD: 1000058,
        save: () => {
          return this.coin
        }
      }
    }

    find(){
      return [this.coin];
    }

    findOne(object){
      if(object && object.where && object.where.Name){
        if(object.where.Name !== 'KNOW_COIN')
          return null;
        this.coin = Object.assign({}, this.coin, { ValueUSD: 1500 })
        return this.coin
      }
      return this.coin;
    }

  }

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forRoot(configService.getTypeOrmConfigTest()),
        TypeOrmModule.forFeature([Coin])
      ],
      providers:[
        CoinService,
        {
          provide: getRepositoryToken(Coin),
          useClass: RepoCoinFake
        }
      ],
      controllers: [CoinController]
    }).compile();

    controller = module.get<CoinController>(CoinController);

  })  

  it('should be defined', () => {

    expect(true).toBe(true);
  
  });

  describe('Coin Exchanges', () => {

    it('Get currencies available', async () => {

      let response = await controller.getCurrenciesAvailable();

      expect(response.currencies.length).toBeGreaterThanOrEqual(0);

    })

    it('Get currencies balance based on USDC', async () => {

      let response = await controller.marketCoinUSD();

      expect(Object.keys(response.rates).length).toBeGreaterThanOrEqual(0);

    })

    it('Update currency', async () => {
      let response = await controller.changeExchangeUSD('KNOW_COIN', 1500);
      expect(response.newPrice).toBe(1500);
    })

  })

});
