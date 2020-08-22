import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { AuthController } from "./auth.controller";
import { Role } from '../../entities/role.entity'

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      useFactory(){
        return {
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "15d" }
        }
      } 
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService]
})
export class AuthModule {}
