import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { PassportModule } from '@nestjs/passport';
import { configService } from '../../config/config.service';

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfigTest()),
        PassportModule.register({
          defaultStrategy: 'jwt'
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
          useFactory(){
            return {
              secret: jwtConstants.secret,
              signOptions: { expiresIn: "2h" }
            }
          } 
        })
      ],
      providers: [AuthService, JwtStrategy]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

});
