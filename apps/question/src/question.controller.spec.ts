import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { RmqService } from '@app/common';

// Mock RmqService
class RmqServiceMock {
  ack = jest.fn();
}

describe('QuestionController', () => {
  let controller: QuestionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: {
            test: jest.fn(),
          },
        },
        { provide: RmqService, useClass: RmqServiceMock },
      ],
    }).compile();

    controller = app.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
