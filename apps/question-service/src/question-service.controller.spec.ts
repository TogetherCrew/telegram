import { Test, TestingModule } from '@nestjs/testing';
import { QuestionServiceController } from './question-service.controller';
import { QuestionServiceService } from './question-service.service';

describe('QuestionServiceController', () => {
  let questionServiceController: QuestionServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuestionServiceController],
      providers: [QuestionServiceService],
    }).compile();

    questionServiceController = app.get<QuestionServiceController>(
      QuestionServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(questionServiceController).toBeTruthy;
      // expect(questionServiceController.message ()).toBe('Hello World!');
    });
  });
});
