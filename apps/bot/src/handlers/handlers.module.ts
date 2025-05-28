import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TemporalModule } from 'nestjs-temporal';
import { QuestionHandler } from './question.handler';
import { UpdateHandler } from './update.handler';
import { VerifyHandler } from './verify.handler';
import { SummaryHandler } from './summary.handler';

@Module({
  imports: [ConfigModule, TemporalModule],
  providers: [QuestionHandler, UpdateHandler, VerifyHandler, SummaryHandler],
  exports: [QuestionHandler, UpdateHandler, VerifyHandler, SummaryHandler],
})
export class HandlersModule { }
