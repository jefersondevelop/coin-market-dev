import {
    Controller,
    Post,
    UseGuards,
    Get,
    Put,
    Query,
    Body
} from "@nestjs/common";
import { CoinService } from "./coins.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { CoinResponse, CurrenciesResponse } from './schemas'
import { RolesGuard } from "../utils/roles.guard";

@ApiTags('coins')
@Controller('coins')
export class CoinController {
    constructor(
        private readonly coinService: CoinService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Response about USDC Exchange.',
        type: CoinResponse,
    })
    @ApiResponse({
        status: 500,
        description: 'Server error.',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get("/marketCoinUSD")
    async marketCoinUSD() {
        return this.coinService.coinMarketUSD();
    }

    @ApiResponse({
        status: 200,
        description: 'Response about Currency Exchanges.',
        type: CurrenciesResponse,
    })
    @ApiResponse({
        status: 500,
        description: 'Server error.',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get("/currencies")
    async getCurrenciesAvailable() {
        return this.coinService.getCurrencysAvailable();
    }

    @ApiBody({
        schema: {
            properties: {
                price: {
                    type: 'number',
                    default: '0',
                },
            },
            required: ['price', 'currency'],
        },
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put('')
    async changeExchangeUSD(@Query('currency') currency : string, @Body('price') price : number) {
        return this.coinService.changeExchangeUSD(currency, price)
    }

    @ApiBody({
        schema: {
            properties: {
                ammount: {
                    type: 'number',
                    default: '1',
                },
            },
            required: ['ammount'],
        },
    })
    @Get('/convertCurrency')
    async convertCurrency(@Query('from') currencyFrom : string, @Query('to') currencyTo : string, @Body('ammount') ammount : number) {
        return this.coinService.convertCurrency(currencyFrom, currencyTo, ammount)
    }

}
