import { Module } from '@nestjs/common';
import { QuestionServiceController } from './question-service.controller';
import { QuestionServiceService } from './question-service.service';
import { schemaConfig, rmqConfig, mongoConfig, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, mongoConfig],
      isGlobal: true,
    }),
    RmqModule,
    HttpModule,
  ],
  controllers: [QuestionServiceController],
  providers: [QuestionServiceService],
})
export class QuestionServiceModule { }
