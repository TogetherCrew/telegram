// bot.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from './bot.service';
import { Services } from '@app/common';

describe('BotService', () => {
  let service: BotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        {
          provide: Services.EventStore.name,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: Services.GraphStore.name,
          useValue: {
            emit: jest.fn(),
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
