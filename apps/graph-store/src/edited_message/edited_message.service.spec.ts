import { Test, TestingModule } from '@nestjs/testing';
import { EditedMessageService } from './edited_message.service';

describe('EditedMessageService', () => {
  let service: EditedMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditedMessageService],
    }).compile();

    service = module.get<EditedMessageService>(EditedMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
