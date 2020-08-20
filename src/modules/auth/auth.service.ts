import { 
  Injectable, 
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from './dto/register.dto';
import { User } from '../../entities/user.entity';
import { PayLoad } from './jwt-payload.interface';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(LoginDto: LoginDto) {
    const { username, password } = LoginDto;
    
    const user_exist = await this.authRepository.findOne({
      where: [{ Email: username }],
      select: ['Id', 'Email', 'Password', 'Status']
    });
    
    if (!user_exist) {
      throw new NotFoundException('Email or password invalid.');
    }
    
    const isMatch = await compare(password, user_exist.Password);
    
    if (!isMatch) {
      throw new NotFoundException('Email or password invalid.');
    }

    const payload: PayLoad = {
      username: user_exist.Email,
      id: user_exist.Id
    };

    const token = await this.jwtService.sign(payload);
    return Object.assign({
      access_token: token,
      decoded: payload
    });
  }

  async register(RegisterDto: RegisterDto) {

    
    const { email, password, confirmPassword } = RegisterDto;

    if(password !== confirmPassword)
      throw new BadRequestException('Password and confirmPassword must be equals.');

    const user_exist = await this.authRepository.findOne({
      where: [{ Email: email }]
    });

    if(user_exist)
      throw new ConflictException('Email has been token.')

    let user = new User();

    user.Email = email;
    const salt = await genSalt(10);
    user.Password = await hash(password, salt);
    
    let user_saved = await user.save();
    
    delete user_saved.Password;

    return Object.assign(
      {},
      {
        status: 200,
        message: 'User has been registered successfully.',
        user: user_saved
      },
    ); 

  }

}
