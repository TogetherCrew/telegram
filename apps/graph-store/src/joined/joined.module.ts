import { Module } from '@nestjs/common';
import { JoinedService } from './joined.service';

@Module({
  providers: [JoinedService],
})
export class JoinedModule {}
