import { Injectable, Logger } from '@nestjs/common';
import { BotService } from './bot.service';

@Injectable()
export class BotGateway {
  constructor(private botService: BotService) {}
}
