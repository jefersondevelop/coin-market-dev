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
        description: 'Response about USDC Exchange.',
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
    @Put('')
    async changeExchangeUSD(@Query('currency') currency : string, @Body('price') price : number) {
        return this.coinService.changeExchangeUSD(currency, price)
    }

}
