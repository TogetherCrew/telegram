import { Test, TestingModule } from '@nestjs/testing';
import { MentionedService } from './mentioned.service';

describe('MentionedService', () => {
  let service: MentionedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentionedService],
    }).compile();

    service = module.get<MentionedService>(MentionedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
