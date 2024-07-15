import { forwardRef, Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { HttpModule } from '@nestjs/axios';
import { TokensService } from './services/tokens.service';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [HttpModule, forwardRef(() => ChatsModule)],
  providers: [OpenaiService, TokensService],
  exports: [OpenaiService, TokensService],
})
export class AiModule {}
