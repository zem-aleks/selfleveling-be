import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { HttpModule } from '@nestjs/axios';
import { TokensService } from './services/tokens.service';

@Module({
  imports: [HttpModule],
  providers: [OpenaiService, TokensService],
  exports: [OpenaiService, TokensService],
})
export class AiModule {}
