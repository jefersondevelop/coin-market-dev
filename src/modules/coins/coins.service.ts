import { 
    Injectable, NotFoundException, UseGuards, UnprocessableEntityException, InternalServerErrorException
} from "@nestjs/common";
import { configService } from "../../config/config.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Coin } from "../../entities/coin.entity";
import { Repository } from "typeorm";
import { staticCurrencies } from '../utils/currencies'
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

        if(!currency||(price === null) || (price === undefined))
            throw new UnprocessableEntityException('Currency and Price must be provided.')

        let base = await this.coinRepository.findOne({where: { Name: currency }});
         
        let currenciesAvailable = await this.coinRepository.find({select: ['Name']})
        
        if(!base)
            throw new NotFoundException(`Currency not appear on our DB. Currency Available: ${currenciesAvailable}`)
        
        base.Value = price;
        
        base = await base.save();
        
        return Object.assign({
            status: 200,
            message: `Price for currency ${currency} was changed succesfully.`,
            newPrice: base.Value
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
            return currency.Value

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

    async getValueConverted(from:string,to:string): Promise<object>{
       
        return await new Promise(async (resolve, reject) => {    
            
            try {

                if(from.toUpperCase() === 'BS') from = 'VEF';
                if(to.toUpperCase() === 'BS') to = 'VEF' 
                
                var options = { 
                    method: 'GET',
                    url: `${configService.getValue("COIN_CONVERTER_URL")}?q=${from.toUpperCase()}_${to.toUpperCase()}&compact=y&apiKey=${configService.getValue("COIN_CONVERTER_API_KEY")}`,
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

    async convertCurrency(from:string, to:string) {

        var response;

        try {
            
            if(!from||!to)
                throw new UnprocessableEntityException('Origin Currency and Target Currency must provided');
    
            let fromCurrency = staticCurrencies().indexOf(from.toUpperCase());
            let toCurrency = staticCurrencies().indexOf(to.toUpperCase());
    
            if((fromCurrency < 0)||(toCurrency <0))
                throw new NotFoundException(`Some currency provided was not found. Currency to convert: ${staticCurrencies()} `);
    
            //Call API REST to get Conversion    
            response = await this.getValueConverted(from,to)
            
            if(Object.keys(response).length > 0){
    
                if(from.toUpperCase() === 'BS') from = 'VEF';
                if(to.toUpperCase() === 'BS') to = 'VEF' 
    
                response = Object.assign({
                    status: 200,
                    message: `Conversion for currency: From: ${from.toUpperCase()} To: ${to.toUpperCase()}`,
                    [`${from.toUpperCase()}_${to.toUpperCase()}`]: response[`${from.toUpperCase()}_${to.toUpperCase()}`].val
                })
            }else{

                //Get conversion by db 

                if(from.toUpperCase() === 'USD') from = 'USDC';
                if(to.toUpperCase() === 'USD') to = 'USDC' 
    
                response = await this.getCurrency(`${from.toUpperCase()}_${to.toUpperCase()}`, true);
                response = Object.assign({
                    status: 200,
                    message: `Conversion for currency: From: ${from.toUpperCase()} To: ${to.toUpperCase()}`,
                    [`${from.toUpperCase()}_${to.toUpperCase()}`]: (response !== null && response !== undefined)? response : 'No hay datos'
                })
    
    
            }
    
        } catch (error) {
            
            //Something happend with API Rest (It is offline)

            if(error.status){
                switch(error.status){
                    case 422:
                        throw new UnprocessableEntityException(error.response.message)
                    case 404:
                        throw new NotFoundException(error.response.message)
                }
            }

            if(from.toUpperCase() === 'USD') from = 'USDC';
            if(to.toUpperCase() === 'USD') to = 'USDC' 

            response = await this.getCurrency(`${from.toUpperCase()}_${to.toUpperCase()}`, true);
            response = Object.assign({
                status: 200,
                message: `Conversion for currency: From: ${from.toUpperCase()} To: ${to.toUpperCase()}`,
                [`${from.toUpperCase()}_${to.toUpperCase()}`]: (response !== null && response !== undefined)? response : 'No hay datos'
            })

        }
        
        return response;
    }

}
  