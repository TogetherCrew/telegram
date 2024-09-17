import { Module } from '@nestjs/common';
import { QuestionServiceController } from './question-service.controller';
import { QuestionServiceService } from './question-service.service';
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
  controllers: [QuestionServiceController],
  providers: [QuestionServiceService],
})
export class QuestionServiceModule { }
