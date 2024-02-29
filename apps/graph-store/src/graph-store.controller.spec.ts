import { Test, TestingModule } from '@nestjs/testing';
import { GraphStoreController } from './graph-store.controller';
import { GraphStoreService } from './graph-store.service';

describe('GraphStoreController', () => {
  let graphStoreController: GraphStoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GraphStoreController],
      providers: [GraphStoreService],
    }).compile();

    graphStoreController = app.get<GraphStoreController>(GraphStoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(graphStoreController.getHello()).toBe('Hello World!');
    });
  });
});
