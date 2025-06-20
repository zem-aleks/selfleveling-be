import { forwardRef, Module } from '@nestjs/common';
import { HeroesController } from './heroes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroesService } from './heroes.service';
import { Hero } from './entities/hero.entity';
import { QuestsModule } from '../quests/quests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hero]), forwardRef(() => QuestsModule)],
  controllers: [HeroesController],
  providers: [HeroesService],
  exports: [HeroesService],
})
export class HeroesModule {}
