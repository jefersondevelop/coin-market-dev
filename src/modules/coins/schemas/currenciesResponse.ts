import { ApiProperty } from '@nestjs/swagger';

export class CurrenciesResponse {

    @ApiProperty({
        default:200,
    })
    status: number;

    @ApiProperty({
        default: 'This is currency base.'
    })
    base: string;

    @ApiProperty({
        default: {}
    })
    currencies: object;

}