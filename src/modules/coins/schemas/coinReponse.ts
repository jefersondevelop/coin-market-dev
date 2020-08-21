import { ApiProperty } from '@nestjs/swagger';

export class CoinResponse {

    @ApiProperty({
        default:200,
    })
    status: number;

    @ApiProperty({
        default: 'A message about response.'
    })
    message: string;

    @ApiProperty({
        default: 'This is currency base.'
    })
    base: string;

    @ApiProperty({
        default: {
            "USDC_BTC": 'value',
            "USDC_DASH": 'value',
            "USDC_ETH": 'value',
            "USDC_EUR": 'value',
            "USDC_PTR": 'value',
            "USDC_BS": 'value',
        }
    })
    rates: object;

}