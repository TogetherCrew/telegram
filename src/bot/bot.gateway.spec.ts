import { Test, TestingModule } from '@nestjs/testing';
import { BotGateway } from './bot.gateway';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';

describe('BotGateway', () => {
  let gateway: BotGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [BotGateway, BotService],
    }).compile();

    gateway = module.get<BotGateway>(BotGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
