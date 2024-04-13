import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RmqService } from './rmq.service';
import { RmqModule } from './rmq.module';

describe('RmqModule', () => {
  let service: RmqService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        RmqModule.register({
          name: 'TestRmqService',
          queue: 'testQueue',
        }),
      ],
    }).compile();

    service = module.get<RmqService>(RmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should use provided queue name', () => {
    const clientOptions = module.get('TestRmqService');
    expect(clientOptions).toBeDefined();
    expect(clientOptions.options).toBeDefined();
    expect(clientOptions.options.queue).toBe('testQueue');
  });
});
