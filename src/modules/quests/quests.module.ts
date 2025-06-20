import { forwardRef, Module } from '@nestjs/common';
import { QuestsController } from './quests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from './entities/quest.entity';
import { QuestsService } from './quests.service';
import { HeroesModule } from '../heroes/heroes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quest]), forwardRef(() => HeroesModule)],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}
