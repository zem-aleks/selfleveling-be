import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserPipe } from './pipes/user.pipe';
import { User } from './entities/user.entity';
import { CustomRequest } from '../../shared/decorators/custom-request.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { mapToEntity } from './mappers/mapToEntity';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(
    @CustomRequest(UserPipe)
    user: User,
  ) {
    return mapToEntity(user);
  }
}
