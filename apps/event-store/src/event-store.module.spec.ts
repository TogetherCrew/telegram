// event-store.module.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreModule } from './event-store.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';

describe('EventStoreModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        EventStoreModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        RmqModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: 'mongodb://localhost:27017/test',
          }),
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
