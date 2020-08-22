import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from "../../entities/user.entity";
import { PassportModule } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto'
import { verify } from "jsonwebtoken";
import { configService } from '../../config/config.service';
import { AuthModule } from './auth.module';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../../entities/role.entity';

describe('Auth Controller', () => {
  let controller: AuthController;
  var email;
  // Set a max time out for jest 
  var MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

  jest.setTimeout(MAX_SAFE_TIMEOUT);

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forRoot(configService.getTypeOrmConfigTest()),
        TypeOrmModule.forFeature([User, Role]),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            useFactory(){
                return {
                  secret: jwtConstants.secret,
                  signOptions: { expiresIn: "2h" }
                }
            } 
        }),
        AuthModule
        ],
        providers:[
          AuthService, 
          JwtStrategy
        ],
        controllers: [AuthController]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {

    expect(controller).toBeDefined();
  
  });

  describe('Authorization', () => {


    it("should reguster a new user", async () => {
      
      // User registered data
      const register: RegisterDto = {
        email: `jefer${Math.random()}${new Date().getMilliseconds()}@gmail.com`,
        password: "12345678",
        roleId: 2,
        confirmPassword: "12345678"
      }
      const result = await controller.register(register); 
      email = register.email;
      expect(result.status).toEqual(200);
    
    }, MAX_SAFE_TIMEOUT);

    it("should return an access token", async () => {
      
      // User registered data
      const loginData: LoginDto = {
        username: email,
        password: "12345678"
      }

      const result = await controller.login(loginData);
      const has_acess_token = result.access_token? true : false 
      expect(has_acess_token).toEqual(true);
    
    }, MAX_SAFE_TIMEOUT);

    it('should return a valid token', async () => {
      
      // User registered data
      const loginData: LoginDto = {
        username: email,
        password: "12345678"
      }

      const result = await controller.login(loginData);

      const tokenVerified = verify(result.access_token, jwtConstants.secret); 

      expect(tokenVerified["username"]).toEqual(loginData.username);

    },MAX_SAFE_TIMEOUT)

    it('should validate user not found by username', async () => {
      // User not registered data
      const loginData: LoginDto = {
        username: "nonuser@gmail.com",
        password: "12345678"
      }
      
      async function loginThrow(){
        return controller.login(loginData)
      }
      
      var status = 200;
      
      await loginThrow()
            .catch(er => status = er.status)

      expect(status).toEqual(404);
    },MAX_SAFE_TIMEOUT);

    it('should validate user not found by password incorrect', async () => {
      // User not registered data
      const loginData: LoginDto = {
        username: "jeferson.alvarado@gmail.com",
        password: "123"
      }
      
      async function loginThrow(){
        return controller.login(loginData)
      }

      var status = 200;
      
      await loginThrow()
            .catch(er => status = er.status)

      expect(status).toEqual(404);
    },MAX_SAFE_TIMEOUT);


  })

});
