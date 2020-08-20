import {
Controller,
Post,
Body
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { LoginResponse } from "./schemas/loginResponse";

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/login')
    @ApiResponse({
        status: 201,
        description: 'The user has been logged succesfully.',
        type: LoginResponse,
    })
    @ApiResponse({
        status: 404,
        description: 'Email or password invalid.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request about some empty or wrong field.',
    })
    @Post("/login")
    async login(@Body() LoginDto: LoginDto) {
        return this.authService.login(LoginDto);
    }

    @Post('/register')
    @ApiResponse({
        status: 201,
        description: 'User has been registered successfully.'
    })
    @ApiResponse({
        status: 409,
        description: 'Email has been token.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request about some empty or wrong field.',
    })
    @Post("/register")
    async register(@Body() RegisterDto: RegisterDto) {
        return this.authService.register(RegisterDto);
    }

}
