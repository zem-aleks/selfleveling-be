import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { memoryStorage } from 'multer';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { Chat } from './modules/chats/entities/chat.entity';
import { ChatsModule } from './modules/chats/chats.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          schema: 'public',
          url: configService.get('DATABASE_URL'),
          entities: [User, Chat],
          synchronize: false,
          migrationsRun: true,
          migrations: ['dist/migration/*{.ts,.js}'],
          logging: false,
          ssl:
            configService.get('ENVIRONMENT') === 'dev'
              ? false
              : { rejectUnauthorized: false },
        };
      },
    }),
    EventEmitterModule.forRoot(),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fieldSize: 25 * 1024 * 1024 },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ChatsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
