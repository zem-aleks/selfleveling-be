import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { mapHeroToEntity } from './mappers/mapHeroToEntity';
import { HeroEntity } from './types/entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../../shared/decorators/auth.decorator';
import { User } from '@supabase/supabase-js';
import { HeroByIdPipe } from './pipes/hero-by-id.pipe';
import { Hero } from './entities/hero.entity';

@Controller('heroes')
@UseGuards(JwtAuthGuard)
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  async getUserHeroes(@AuthUser() user: User): Promise<HeroEntity[]> {
    const heroes = await this.heroesService.getHeroesByUserId(user.id);
    return heroes.map(mapHeroToEntity);
  }

  @Get(':id')
  async getHero(
    @AuthUser() user: User,
    @Param('id', HeroByIdPipe) hero: Hero,
  ): Promise<HeroEntity> {
    if (hero.userId !== user.id) {
      throw new NotFoundException(`Hero not found`);
    }

    return mapHeroToEntity(hero);
  }

  @Post()
  async create(
    // @Res() res: Response,
    @AuthUser() user: User,
    @Body() data: Omit<HeroEntity, 'id' | 'createdAt' | 'updatedAt' | 'userId'>,
  ): Promise<HeroEntity> {
    const hero = await this.heroesService.create({ ...data, userId: user.id });
    return mapHeroToEntity(hero);
  }
}
