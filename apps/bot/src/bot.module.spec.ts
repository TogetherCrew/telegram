// bot.module.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot.module';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { RmqModule } from '@app/common';
import { NestjsGrammyModule } from '@grammyjs/nestjs';

describe('BotModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        BotModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide BotService', () => {
    const botService = module.get<BotService>(BotService);
    expect(botService).toBeDefined();
  });

  it('should provide BotUpdate', () => {
    const botUpdate = module.get<BotUpdate>(BotUpdate);
    expect(botUpdate).toBeDefined();
  });

  it('should import RmqModule', () => {
    const rmqModule = module.get(RmqModule);
    expect(rmqModule).toBeDefined();
  });

  it('should import NestjsGrammyModule', () => {
    const nestjsGrammyModule = module.get(NestjsGrammyModule);
    expect(nestjsGrammyModule).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
