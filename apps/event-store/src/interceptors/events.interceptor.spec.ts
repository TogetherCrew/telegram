// events.interceptor.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { EventsInterceptor } from './events.interceptor';

describe('EventsInterceptor', () => {
  let interceptor: EventsInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsInterceptor],
    }).compile();

    interceptor = module.get<EventsInterceptor>(EventsInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
