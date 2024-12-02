import { Module } from '@nestjs/common';
import { MentionedService } from './mentioned.service';

@Module({
  providers: [MentionedService],
})
export class MentionedModule {}
