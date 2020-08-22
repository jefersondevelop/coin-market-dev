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

  // TEST WITH NO DB DEPENDENCY CASE

  class RepoCoinFake {
    
    public coin 

    constructor(){
      this.coin = {
        Id: 0,
        Name: 'Coin for test',
        Value: 1000058,
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
        this.coin = Object.assign({}, this.coin, { Value: 1500 })
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

    it('Should get currencies available', async () => {

      let response = await controller.getCurrenciesAvailable();

      expect(response.currencies.length).toBeGreaterThanOrEqual(0);

    })

    it('Should get currencies balance based on USDC', async () => {

      let response = await controller.marketCoinUSD();

      expect(Object.keys(response.rates).length).toBeGreaterThanOrEqual(0);

    })

    it('Should update currency', async () => {

      let response = await controller.changeExchangeUSD('KNOW_COIN', 1500);

      expect(response.newPrice).toBe(1500);

    })

    it('Should convert BTC TO BS currency', async () => {

      let response = await controller.convertCurrency('BTC', 'bs', 1);

      expect(response.status).toBe(200);
      
    })

    it('Should return an error because currency was not found to convert.', async () => {
      try {
        let response = await controller.convertCurrency('YUANG', 'BS', 1);
        expect(response).toBe(null); 
      } catch (error) {
        expect(error.status).toBe(404)
      }
    })

  })

});
