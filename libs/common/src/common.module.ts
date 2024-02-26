import { Module } from '@nestjs/common';
// import { EVENT_SERVICE, TELEGRAM_SERVICE } from './constants/services';
import { EVENT_QUEUE } from './constants/queues';

@Module({
  exports: [EVENT_QUEUE],
})
export class CommonModule {}
