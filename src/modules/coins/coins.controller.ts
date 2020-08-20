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

@Controller('coins')
export class CoinController {
    constructor(
        private readonly coinService: CoinService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get("/marketCoinUSD")
    async marketCoinUSD() {
        return this.coinService.coinMarketUSD();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("/currencies")
    async getCurrenciesAvailable() {
        return this.coinService.getCurrencysAvailable();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    async changeExchangeUSD(@Query('currency') currency : string, @Body('price') price : number) {
        return this.coinService.changeExchangeUSD(currency, price)
    }

}
