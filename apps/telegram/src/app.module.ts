import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import baseConfig from './config/base.config';
import neo4jConfig from './config/neo4j.config';
import telegramConfig from './config/telegram.config';
import validationSchema from './config/configs.schema';
import { Neo4jModule } from 'nest-neo4j';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
      load: [baseConfig, neo4jConfig, telegramConfig],
    }),
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
