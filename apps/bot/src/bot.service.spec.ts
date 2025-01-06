// bot.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from './bot.service';
import { ConfigService } from '@nestjs/config';

describe('BotService', () => {
  let service: BotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'telegram.token') return 'mocked value';
              return null;
            }),
          },
        },
        {
          provide: 'TemporalQueue_default',
          useValue: {
            start: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
