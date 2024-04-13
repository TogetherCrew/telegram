import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
