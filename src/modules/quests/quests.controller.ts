import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class QuestsController {}
