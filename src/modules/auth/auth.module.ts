import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategyService } from './services/jwt-strategy.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategyService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
