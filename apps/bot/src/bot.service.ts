import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  message(): string {
    return 'Hello World!';
  }
}
