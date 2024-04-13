import { Module } from '@nestjs/common';
import { RepliedService } from './replied.service';

@Module({
  providers: [RepliedService]
})
export class RepliedModule {}
