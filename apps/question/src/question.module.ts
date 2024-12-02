import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import {
  schemaConfig,
  rmqConfig,
  RmqModule,
  Services,
  questionConfig,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, questionConfig],
      isGlobal: true,
    }),
    RmqModule,
    HttpModule,
    RmqModule.register(Services.TelegramBot),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
