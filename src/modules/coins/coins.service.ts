import { 
    Injectable, NotFoundException, UseGuards, UnprocessableEntityException
} from "@nestjs/common";
import { configService } from "../../config/config.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Coin } from "../../entities/coin.entity";
import { Repository, Not } from "typeorm";
var request = require("request");  

@Injectable()
export class CoinService {

    constructor(
        @InjectRepository(Coin)
        private readonly coinRepository: Repository<Coin>
    ){}
    
    async getUSDValues() : Promise<Object>{

        return await new Promise(async (resolve, reject) => {    
            
            try {
                
                var options = { 
                    method: 'GET',
                    url: `${configService.getValue("COIN_MARKET_URL")}/public?command=returnTicker`,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                };
            
    
                request(options, function (error, response, body) {
                    
                    if (error) return reject(error);
    
                    let resp = JSON.parse(body)
    
                    if(resp.error)
                        return reject(resp)
                    
                    return resolve(JSON.parse(body))
                }); 

            }catch(err){
                throw err
            } 
        }) 
        
    }

    async getEURValue() : Promise<number>{

        return await new Promise(async (resolve, reject) => {    
            
            try {
                
                var options = { 
                    method: 'GET',
                    url: `${configService.getValue("COIN_EUR_MARKET_URL")}`,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                };
            
    
                request(options, function (error, response, body) {
                    
                    if (error) return reject(error);
    
                    let resp = JSON.parse(body)
    
                    if(resp.error)
                        return reject(resp)
                    
                    return resolve(JSON.parse(body))
                }); 

            }catch(err){
                throw err
            } 
        }) 
        
    }

    async coinMarketUSD() {

        let dbExchange;

        // Get BTC, DASH, ETH, PTR, BS, USDC_EUR price based on USDC

        try {            
            let USDC_BTC, USDC_DASH, USDC_ETH, USDC_PTR, USDC_BS, USDC_EUR;
            USDC_EUR = await this.getEURValue();
            let responseExchange = await this.getUSDValues();
            
            // If response has data 
            if(responseExchange && Object.keys(responseExchange).length > 0){
                USDC_BTC = responseExchange['USDC_BTC']? responseExchange['USDC_BTC'] : 'No hay datos'
                USDC_DASH = responseExchange['USDC_DASH']? responseExchange['USDC_DASH'] : 'No hay datos'
                USDC_ETH = responseExchange['USDC_ETH']? responseExchange['USDC_ETH'] : 'No hay datos'
                USDC_EUR = USDC_EUR.date? USDC_EUR.rates.USD : 'No hay datos'
                USDC_PTR = await this.getCurrency('USDC_PTR', true)
                USDC_BS = await this.getCurrency('USDC_BS', true)

                return Object.assign({
                    status: 200,
                    message:'This is coin market based on USDC. Price of PTR AND BS was calculated on our server side',
                    base: 'USDC',
                    rates: {
                        USDC_BTC: Number(USDC_BTC.last),
                        USDC_DASH: Number(USDC_DASH.last),
                        USDC_ETH: Number(USDC_ETH.last),
                        USDC_EUR,
                        USDC_PTR,
                        USDC_BS
                    }
        
                })

            }else{ // If there is no data
                dbExchange = await this.getDBExchange();

                return Object.assign({
                    status: 200,
                    message:'This is coin market based on USDC. Price of PTR AND BS was calculated on our server side',
                    base: 'USDC',
                    rates: dbExchange.local_currencies
                })
            }
        
        } catch (error) {

            dbExchange = await this.getDBExchange();

            return Object.assign({
                status: 200,
                message:'This is coin market based on USDC. Price of PTR AND BS was calculated on our server side',
                base: 'USDC',
                rates: dbExchange.local_currencies
            })

        }

    }

    async changeExchangeUSD(currency, price){

        if(!currency||!price)
            throw new UnprocessableEntityException('Currency and Price must be provided.')

        let base = await this.coinRepository.findOne({where: { Name: currency }});
        
        if(!base)
            throw new NotFoundException(`Currency not appear on our DB. Currency Available: USDC_BTC, USDC_DASH, USDC_ETH, USDC_PTR, USDC_BS`)
        
        base.ValueUSD = price;
        
        base = await base.save();
        
        return Object.assign({
            status: 200,
            message: `Price for currency ${currency} was changed succesfully.`,
            newPrice: base.ValueUSD
        })

    }

    async getCurrencysAvailable(){

        return Object.assign({
            status: 200,
            base: 'USDC',
            currencies: await this.coinRepository.find()
        })
        
    }

    async getCurrency(name:string, isInternal: boolean = false){

        const currency = await this.coinRepository.findOne({where:{Name: name}});
    
        if(!(currency || isInternal))
            throw new NotFoundException('Currency was not found.')

        if(!currency && isInternal)
            return 'No hay datos'

        if(currency && isInternal)
            return currency.ValueUSD

        return Object.assign({
            status: 200,
            currency
        })
        
    }

    async getDBExchange(){
        let USDC_BTC, USDC_DASH, USDC_ETH, USDC_EUR, USDC_PTR, USDC_BS;

        // Get DB USDC_PTR OR CONSTANT VALUE SUGGESTION
        USDC_PTR = await this.getCurrency('USDC_PTR', true);
        USDC_PTR = USDC_PTR? USDC_PTR: 60;

        // Get DB USDC_BS OR CONSTANT VALUE SUGGESTION
        USDC_BS = await this.getCurrency('USDC_BS', true);
        USDC_BS = USDC_BS? USDC_BS : 0.00001;

        // Get DB Values just in case API REST is down
        USDC_BTC = await this.getCurrency('USDC_BTC', true);
        USDC_BTC = USDC_BTC? USDC_BTC  : 'No hay datos';
        USDC_DASH = await this.getCurrency('USDC_DASH', true);
        USDC_DASH = USDC_DASH? USDC_DASH  : 'No hay datos';
        USDC_ETH = await this.getCurrency('USDC_ETH', true);
        USDC_ETH = USDC_ETH? USDC_ETH: 'No hay datos';
        USDC_EUR = await this.getCurrency('USDC_EUR', true);
        USDC_EUR = USDC_EUR? USDC_EUR  : 'No hay datos';
        
        return Object.assign({
            status: 200,
            local_currencies: {
                USDC_PTR,
                USDC_BS,
                USDC_BTC, 
                USDC_DASH, 
                USDC_ETH, 
                USDC_EUR
            }
        })
    }
}
  