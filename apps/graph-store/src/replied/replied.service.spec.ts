import { Test, TestingModule } from '@nestjs/testing';
import { RepliedService } from './replied.service';

describe('RepliedService', () => {
  let service: RepliedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepliedService],
    }).compile();

    service = module.get<RepliedService>(RepliedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
