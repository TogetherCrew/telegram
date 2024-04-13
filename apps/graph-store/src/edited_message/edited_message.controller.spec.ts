import { Test, TestingModule } from '@nestjs/testing';
import { EditedMessageController } from './edited_message.controller';

describe('EditedMessageController', () => {
  let controller: EditedMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditedMessageController],
    }).compile();

    controller = module.get<EditedMessageController>(EditedMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
